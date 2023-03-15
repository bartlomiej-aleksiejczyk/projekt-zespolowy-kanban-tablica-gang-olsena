import React, {useState} from 'react'
import styled from 'styled-components';
import {Droppable} from 'react-beautiful-dnd';
import Card from "./Card";
import 'primeicons/primeicons.css';
import CommonService from "../services/CommonService";
import {Button} from 'primereact/button';
import {ConfirmDialog} from 'primereact/confirmdialog';
import {InputText} from 'primereact/inputtext';
import {ToggleButton} from 'primereact/togglebutton';
import {useUserService} from "../utils/UserServiceContext";

const RowsStyle = styled.div`
  //box-shadow: 0px 1px 7px rgba(0, 0, 0, 0.1), 0px 4px 5px -2px rgba(0, 0, 0, 0.12), 0px 10px 15px -5px rgba(0, 0, 0, 0.2);
  max-width: 245px;
  min-width: 245px;
  max-height: 240px;
  min-height: 240px;
  zIndex : 1;
  margin-top: 3px;
  margin-right: 2px;
  margin-bottom: 3px;
  border-radius: 6px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;


`;
const RowsStyleExtension = styled.div`
  //box-shadow: 0px 1px 7px rgba(0, 0, 0, 0.1), 0px 4px 5px -2px rgba(0, 0, 0, 0.12), 0px 10px 15px -5px rgba(0, 0, 0, 0.2);
  max-width: 250px;
  min-width: 250px;
  max-height: 250px;
  min-height: 60px;
  //border: 3px solid #b7b3ea;
  border-radius: 6px;
  background-color: #c4c0f1;
  margin-top: 3px;
`;

const CardsStyle = styled.div`
  max-width: 242px;
  min-width: 242px;
  margin-top: 3px;
  position: absolute;
  margin-left: 6px;
  margin-bottom: 3px;
  min-height: 235px;
  max-height: 235px;
  overflow: auto;
  border-radius: 6px;
  border: 3px solid #b7b3ea;
  transition: background-color 2s ease;
  background-color: ${props =>
    props.rowOverflow ? '#800000' : 'white'};
  color: ${props =>
    props.rowOverflow ? 'white' : 'inherit'};
`;
const RowSide = styled.div`
  position: absolute;
  margin-left: -250px;
  min-width: 246px;
  min-width: 246px;
  z-index: 10;
`;
const RowSideCollapsable = styled.div`
  position: absolute;
  margin-left: -250px;
  margin-top: 3px;
  min-width: 246px;
  min-height: 235px;
  max-height: 235px;
  
  z-index: 8;
  border: 3px solid #b7b3ea;
  border-radius: 6px;
  background-color: white;

`;
const RowCollapsable = styled.div`
  max-width: 250px;
  min-width: 250px;
  max-height: 260px;
  min-height: 60px;
  margin-bottom: 3px;
  border-radius: 6px;
  background-color: white;
  margin-top: 3px;
`;

function Row(props) {
    const [value3, setValue3] = useState(props.name);
    const [visible1, setVisible1] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const apiService = useUserService();


    const handleCollapse = () => {
        apiService.updateRow(props.backId, {"is_collapsed": true, "index": props.index}).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards)
        });

    }
    const handleExpand = () => {
        apiService.updateRow(props.backId, {"is_collapsed": false, "index": props.index}).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards)
        });

    }
    const acceptEditRow = () => {
        apiService.updateRow(props.backId, {"name": value3}).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards)
        });

    }
    const rejectEditRow = () => {
        setValue3(props.name);
    }
    const acceptRowDelete = () => {
        apiService.removeRow((props.backId)).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards)
        });
    }
    return (

        <RowsStyleExtension>
            {props.boardIndex === 0 &&
            <RowSide>
                <ToggleButton style={{width: "227px", marginLeft: "10px", marginTop: "10px", height: "50"}}
                              onLabel={props.name} offLabel={props.name} onIcon="pi pi-minus" offIcon="pi pi-plus"
                              checked={!props.isCollapsed}
                              onChange={props.isCollapsed ? () => handleExpand() : () => handleCollapse()}/>
            </RowSide>
            }
            {!props.isCollapsed &&
            <RowCollapsable>
                {props.boardIndex === 0 &&
                <RowSideCollapsable>
                    <Button style={{marginLeft: "50px", marginTop: "80px", zIndex: 7, scale: "120%"}}
                            icon="pi pi-pencil"
                            size="lg"
                            rounded
                            text
                            onClick={() => CommonService.onOpenDialog(setVisible2, setValue3, props.name)}/>
                    <Button style={{marginLeft: "40px", marginTop: "80px", zIndex: 7, fontSize: "12px", scale: "120%"}}
                            icon="pi pi-trash"
                            size="lg"
                            rounded
                            text
                            onClick={() => setVisible1(true)}/>
                </RowSideCollapsable>
                }
                <RowsStyle>
                    <ConfirmDialog visible={visible2}
                                   onHide={() => setVisible2(false)}
                                   message=<InputText value={value3} onChange={(e) => setValue3(e.target.value)}/>
                    header="Edytuj rząd:"
                    icon="pi pi-pencil"
                    acceptLabel="Akceptuj"
                    rejectLabel="Odrzuć"
                    accept={acceptEditRow}
                    reject={rejectEditRow}
                    />
                    <ConfirmDialog visible={visible1}
                                   onHide={() => setVisible1(false)}
                                   message="Czy na pewno chcesz usunąć rząd?"
                                   header="Potwierdzenie usunięcia"
                                   icon="pi pi-trash"
                                   acceptLabel="Tak"
                                   rejectLabel="Nie"
                                   accept={acceptRowDelete}
                                   reject={() => {}}/>
                    <Droppable droppableId={props.droppableId}
                               type="card">
                        {(provided) => (
                            <CardsStyle
                                rowOverflow={(props.limit < (props.cards).length) && (props.limit != null)}
                                ref={provided.innerRef}
                                {...provided.droppableId}>
                                {(props.cards).map((card, indexDrag) =>
                                    <Card key={card.id}
                                          backId={card.id}
                                          dragId={(card.id).toString() + "c"}
                                          description={card.description}
                                          setBoards={props.setBoards}
                                          indexDrag={indexDrag}
                                          data={card}
                                          name={card.name}
                                          board={card.board}/>
                                )}
                                {provided.placeholder}
                            </CardsStyle>
                        )}
                    </Droppable>
                </RowsStyle>
            </RowCollapsable>
            }
        </RowsStyleExtension>
    )
}

export default Row;