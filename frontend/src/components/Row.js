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

const CardsStyle = styled.div`
  max-width: 710px;
  min-width: 228px;
  margin-top: 3px;
  margin-left: 11.5px;
  margin-right: auto;
  width: auto;
  margin-bottom: 3px;
  min-height: 247px;
  max-height: 247px;
  overflow: auto;
  background-color:white;
  transition: background-color 0.4s;
  display: inline-flex;
  
  // background-color: {props =>
  //   props.rowOverflow ? '#800000' : 'white'};
  // color: {props =>
  //   props.rowOverflow ? 'white' : 'inherit'};
`;
const RowsStyle = styled.div`
  //box-shadow: 0px 1px 7px rgba(0, 0, 0, 0.1), 0px 4px 5px -2px rgba(0, 0, 0, 0.12), 0px 10px 15px -5px rgba(0, 0, 0, 0.2);
  max-width: 710px;
  min-width: 245px;
  max-height: 250px;
  min-height: 250px;
  zIndex : 1;
  margin-top: 3px;
  margin-right: 2px;
  margin-bottom: 3px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;


`;
const RowsStyleExtension = styled.div`
  //box-shadow: 0px 1px 7px rgba(0, 0, 0, 0.1), 0px 4px 5px -2px rgba(0, 0, 0, 0.12), 0px 10px 15px -5px rgba(0, 0, 0, 0.2);
  max-width: 720px;
  min-width: 250px;
  max-height: 250px;
  min-height: 60px;
  //border: 3px solid #b7b3ea;
  background-color: #c4c0f1;
  margin-top: 3px;
`;


const RowSide = styled.div`
  position: absolute;
  margin-left: -250px;
  min-width: 246px;
  z-index: 10;
`;
const RowSideCollapsable = styled.div`
  position: absolute;
  margin-left: -252px;
  margin-top: 3px;
  min-width: 246px;
  min-height: 235px;
  max-height: 235px;
  z-index: 8;
  border-radius: 6px;
  background-color: white;

`;
const RowCollapsable = styled.div`
  content: "my tooltip";
  min-width: 250px;
  max-height: 250px;
  min-height: 60px;
  margin-bottom: 3px;
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
            CommonService.toastCallback(response_data, props.setBoards,props.setRemaining)
        });
    }
    return (

        <RowsStyleExtension>
            {props.boardIndex === 0 &&
            <RowSide>
                <ToggleButton style={{width: "227px", marginLeft: "10px", marginTop: "10px"}}
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
                            onClick={() => CommonService.onOpenDialog(setVisible2, [{callback: setValue3, value: props.name}])}/>
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
                               type="card"
                               direction="horizontal"

                    >
                        {(provided) => (
                            <CardsStyle
                                rowOverflow={(props.limit < (props.cards).length) && (props.limit != null)}
                                ref={provided.innerRef}
                                {...provided.droppableId}>
                                {(props.cards).map((card, indexDrag) =>
                                    <Card key={card.id}
                                          backId={card.id}
                                          color={card.color}
                                          locked={card.is_locked}
                                          dragId={(card.id).toString() + "c"}
                                          dropId={(card.id).toString() + "cd"}
                                          description={card.description}
                                          indexDrag={indexDrag}
                                          data={card}
                                          name={card.name}
                                          board={card.board}
                                          users={props.users}
                                          setBoards={props.setBoards}
                                          setRemaining={props.setRemaining}
                                    />
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