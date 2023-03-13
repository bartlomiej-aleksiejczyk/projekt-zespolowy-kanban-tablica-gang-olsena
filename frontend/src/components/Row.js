import React, {useState} from 'react'
import styled from 'styled-components';
import {Droppable} from 'react-beautiful-dnd';
import Card from "./Card";
import 'primeicons/primeicons.css';
import ApiService from "../services/ApiService";
import CommonService from "../services/CommonService";
import {Button} from 'primereact/button';
import {ConfirmDialog} from 'primereact/confirmdialog';
import {InputText} from 'primereact/inputtext';

const TitleRow = styled.h3`
  text-align: center;
  max-width: 200px;
  min-width: 200px;
  padding: 0px;
  margin-bottom: 20px;
  flex-direction: column;
  word-wrap: break-word;
  flex-wrap: wrap;
` ;
const RowsStyle = styled.div`
  //box-shadow: 0px 1px 7px rgba(0, 0, 0, 0.1), 0px 4px 5px -2px rgba(0, 0, 0, 0.12), 0px 10px 15px -5px rgba(0, 0, 0, 0.2);
  max-width: 230px;
  min-width: 230px;
  max-height: 200px;
  min-height: 200px;
  zIndex : 1;
  margin-top: 14px;
  margin-bottom: -14px;
  border-radius: 6px;
  border: 3px solid #b7b3ea;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  transition: background-color 2s ease;
  background-color: ${props =>
    props.boardOverflow ? '#800000' : 'white'};
  color: ${props =>
    props.boardOverflow ? 'white' : 'inherit'};
` ;
const RowsStyleExtension = styled.div`
  //box-shadow: 0px 1px 7px rgba(0, 0, 0, 0.1), 0px 4px 5px -2px rgba(0, 0, 0, 0.12), 0px 10px 15px -5px rgba(0, 0, 0, 0.2);
  max-width: 230px;
  min-width: 230px;
  max-height: 200px;
  min-height: 80px;
  background-color: lightblue;
  margin-top: 4px;
` ;

const CardsStyle = styled.div`
  margin-top: 10px;
  position: absolute;
  flex-grow: 2;
  min-height: 200px;
  max-height: 200px;
` ;
const RowSide = styled.div`
  position: absolute;
  margin-left: -200px;
  z-index: 10;
` ;
const RowSideCollapsable = styled.div`
  position: absolute;
  margin-left: -200px;
  margin-top: 100px;
  z-index: 10;
` ;
const RowCollapsable = styled.div`

` ;
function Row(props) {
    const [value3, setValue3] = useState(props.name);
    const [visible1, setVisible1] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const handleCollapse = () => {
        ApiService.updateRow(props.backId, {"is_collapsed": true, "index":props.index}).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards)
        });

    }
    const handleExpand = () => {
        ApiService.updateRow(props.backId, {"is_collapsed": false, "index":props.index}).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards)
        });

    }
    const acceptEditRow = () => {
        ApiService.updateRow(props.backId, {"name": value3}).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards)
        });

    }
    const rejectEditRow = () => {
        setValue3(props.name);
    }
    const acceptRowDelete = () => {
        ApiService.removeRow((props.backId)).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards)
        });
    }
    return(

        <RowsStyleExtension>
            {props.boardIndex === 0 &&
                <RowSide>
                    <Button style={{marginRight: "20px", width: "80px"}}
                            label={props.isCollapsed ? "Rozwiń" : "Zwiń"}
                            size="sm"
                            onClick={props.isCollapsed ?  () => handleExpand() :  () => handleCollapse()}
                               />
                    <TitleRow>
                            {props.name}
                    </TitleRow>
                </RowSide>
            }
            {!props.isCollapsed &&
            <RowCollapsable>
                    {props.boardIndex===0 &&
                        <RowSideCollapsable>

                            <Button style={{marginRight: "20px"}}
                                    icon="pi pi-pencil"
                                    size="lg"
                                    rounded
                                    text
                                    aria-label="Filter"
                                    onClick={() => CommonService.onOpenDialog(setVisible2,setValue3,props.name)}/>
                            <Button style={{marginRight: "20px"}}
                                    icon="pi pi-trash"
                                    size="lg"
                                    rounded
                                    text
                                    aria-label="Filter"
                                    onClick={() => setVisible1(true)}/>
                        </RowSideCollapsable>
                    }
                    <RowsStyle>
                        <ConfirmDialog visible={visible2}
                                       onHide={() => setVisible2(false)}
                                       message=<InputText value={value3} onChange={(e) => setValue3(e.target.value)} />
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
                            ref={provided.innerRef}
                            {...provided.droppableId}>
                            {(props.cards).map((card, indexDrag) =>
                                <Card key={card.id}
                                      backId={card.id}
                                      dragId={(card.id).toString() + "c"}
                                      description={card.description}
                                      setBoards={props.setBoards}
                                      indexDrag={indexDrag}
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