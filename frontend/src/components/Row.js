import React, {useState,useEffect,useRef} from 'react'
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
import {useTranslation} from 'react-i18next';
import LanguageChoose from "./LanguageChoose";
import {Tooltip} from 'primereact/tooltip';

const CardsStyle = styled.div`
  max-width: 280px;
  min-width: 280px;
  margin-top: 8px;
  margin-bottom: 8px;
  margin-right: auto;
  margin-left: 17px;
  width: auto;
  height: complex;
  min-height: 100px;
  max-height: 400px;
  overflow: scroll;
  justify-content: center;
  display: flex;
  flex-direction: column;
  
  // background-color: {props =>
  //   props.rowOverflow ? '#800000' : 'white'};
  // color: {props =>
  //   props.rowOverflow ? 'white' : 'inherit'};
`;
const RowsStyleExtension = styled.div`
  //box-shadow: 0px 1px 7px rgba(0, 0, 0, 0.1), 0px 4px 5px -2px rgba(0, 0, 0, 0.12), 0px 10px 15px -5px rgba(0, 0, 0, 0.2);
  max-width: 474px;
  min-width: 150px;
  min-height: 45px;
  height: ${props=>props.rowHeight};
  //border: 3px solid #b7b3ea;
  background-color: #c4c0f1;
  margin-top: 2px;
  transition: height 0.25s ease-in;;

`;


const RowSide = styled.div`
  position: absolute;
  margin-left: -150px;
  min-width: 148px;
  z-index: 10;
`;
const RowSideCollapsable = styled.div`
  position: absolute;
  margin-left: -151px;
  max-width: 145px;
  min-width: 145px;
  min-height: 100px;
  height: ${props=>props.rowHeight};
  z-index: 8;
  border-radius: 4px;
  background-color: white;
  transition: background-color 0.4s, height 0.25s ease-in;;


`;
const RowCollapsable = styled.div`
  content: "my tooltip";
  min-width: 150px;
  max-height: 400px;
  min-height: 100px;
  margin-bottom: 2px;
  background-color: white;
  margin-top: 3px;
`;
const RowsStyle = styled.div`
  //box-shadow: 0px 1px 7px rgba(0, 0, 0, 0.1), 0px 4px 5px -2px rgba(0, 0, 0, 0.12), 0px 10px 15px -5px rgba(0, 0, 0, 0.2);
  max-width: 474px;
  min-width: 147px;
  max-height: 400px;
  min-height: 100px;
  height: ${props=>(props.rowHeight)};
  zIndex : 1;
  margin-top: 2px;
  margin-right: 1px;
  margin-bottom: 2px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  transition: background-color 0.4s, height 0.25s ease-in;;
  background-color: ${props =>props.rowOverflowBothEnds ? '#a94848' : 'white'};
/*
  background {isBetween ? 'white' : 'red'};
*/
  //background-color: {props =>
  //     props.rowOverflow ? '#800000' : 'white'};
`;

function Row(props) {
    // let isBetween = true;
    // if(props.board && !props.board.is_static) {
    //     isBetween = props.board.min_card <= props.row.card_data.length && props.board.max_card >= props.row.card_data.length;
    // }



    const {t, i18n} = useTranslation();
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
            CommonService.toastCallback(response_data, props.setBoards, props.setRemaining)
        });
    }

    return (

        <RowsStyleExtension
            rowHeight={props.rowHeightDict?(props.rowHeightDict[props.backId]+3)+"px":null}
        >
            <Tooltip target={`.row-${props.backId}`} autoHide={false}>
                <div className="flex align-items-center">
                    <Button style={{marginRight: "20px"}}
                            icon="pi pi-pencil"
                            size="sm"
                            onClick={() => CommonService.onOpenDialog(setVisible2, [{
                                callback: setValue3,
                                value   : props.name
                            }])}/>
                    {(props.backId!==1)&&
                        <Button
                        icon="pi pi-trash"
                        size="sm"
                        onClick={() => setVisible1(true)}/>}
                </div>
            </Tooltip>
            {props.boardIndex === 0 &&
            <RowSide>
                <ToggleButton className={`row-${props.backId}`}
                              style={{width: "136px", marginLeft: "4px", marginTop: "6px",height:"30px"}}
                              onLabel={props.name} offLabel={props.name} onIcon="pi pi-minus" offIcon="pi pi-plus"
                              checked={!props.isCollapsed}
                              onChange={props.isCollapsed ? () => handleExpand() : () => handleCollapse()}/>
            </RowSide>
            }
            {!props.isCollapsed &&
            <RowCollapsable>
                {props.boardIndex === 0 &&
                <RowSideCollapsable
                    rowHeight={props.rowHeightDict?props.rowHeightDict[props.backId]+"px":null}
                >
                </RowSideCollapsable>
                }
                <RowsStyle rowOverflowBothEnds={
                    ((props.board && !props.board.is_static) &&
                        ((props.board.min_card > (props.row.card_data.length)&& (props.board.min_card != null)) ||
                        ((props.board.max_card < props.row.card_data.length)&& (props.board.max_card != null))))
                }
                           rowHeight={props.rowHeightDict?(props.rowHeightDict[props.backId])+"px":null}

                           onClick={()=>console.log(props.rowHeightDict[props.backId])}

                >

                    <ConfirmDialog visible={visible2}
                                   onHide={() => setVisible2(false)}
                                   message=<InputText value={value3} onChange={(e) => setValue3(e.target.value)}/>
                    header={t("rowEditHeader")}
                    icon="pi pi-pencil"
                    acceptLabel={t("accept")}
                    rejectLabel={t("reject")}
                    accept={acceptEditRow}
                    reject={rejectEditRow}
                    />
                    <ConfirmDialog visible={visible1}
                                   onHide={() => setVisible1(false)}
                                   message={t("rowRemoveConfirmationMessage")}
                                   header={t("rowRemoveConfirmationHeader")}
                                   icon="pi pi-trash"
                                   acceptLabel={t("yes")}
                                   rejectLabel={t("no")}
                                   accept={acceptRowDelete}
                                   reject={() => {}}/>
                    <Droppable droppableId={props.droppableId}
                               type="card"
                               direction="vertical"

                    >
                        {(provided) => (
                            <CardsStyle
                                rowOverflow={(props.limit < (props.cards).length) && (props.limit != null)

                            }
                                className={`heightRow-${props.backId}`}
                                ref={provided.innerRef}
                                {...provided.droppableId}>
                                {(props.cards).map((card, indexDrag) =>
                                    <Card key={card.id}
                                          index={card.index}
                                          backId={card.id}
                                          color={card.color}
                                          locked={card.is_locked}
                                          dragId={(card.id).toString() + "c"}
                                          dropId={(card.id).toString() + "cd"}
                                          description={card.description}
                                          indexDrag={indexDrag}
                                          data={card}
                                          itemDataNew={card.item_data}
                                          isCardCompleted={card.is_card_completed}
                                          isCardDone={card.is_card_finished}
                                          hasBug={card.has_bug}
                                          name={card.name}
                                          board={card.board}
                                          row={card.row}
                                          boards={props.boards}
                                          users={props.users}
                                          parentCard={card.parent_card}
                                          childData={card.child_data}
                                          setBoards={props.setBoards}
                                          setRemaining={props.setRemaining}
                                          cardsChoice={props.cardsChoice}
                                          setCardsChoice={props.setCardsChoice}
                                          areChildrenCollapsed={card.are_children_collapsed}
                                          areCarditemsCollapsed={card.are_carditems_collapsed}
                                          updatedAt={card.updated_at}
                                          parentName={card.parent_name}
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