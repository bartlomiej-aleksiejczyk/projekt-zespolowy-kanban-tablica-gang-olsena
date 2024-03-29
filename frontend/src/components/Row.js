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
import {useTranslation} from 'react-i18next';
import LanguageChoose from "./LanguageChoose";

const CardsStyle = styled.div`
  max-width: 770px;
  min-width: 228px;
  margin-top: 3px;
  margin-left: 11.5px;
  margin-right: auto;
  width: auto;
  margin-bottom: 3px;
  min-height: 305px;
  max-height: 305px;
  overflow: auto;
  display: inline-flex;
  
  // background-color: {props =>
  //   props.rowOverflow ? '#800000' : 'white'};
  // color: {props =>
  //   props.rowOverflow ? 'white' : 'inherit'};
`;
const RowsStyleExtension = styled.div`
  //box-shadow: 0px 1px 7px rgba(0, 0, 0, 0.1), 0px 4px 5px -2px rgba(0, 0, 0, 0.12), 0px 10px 15px -5px rgba(0, 0, 0, 0.2);
  max-width: 790px;
  min-width: 250px;
  max-height: 310px;
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
  max-height: 310px;
  min-height: 60px;
  margin-bottom: 3px;
  background-color: white;
  margin-top: 3px;
`;
const RowsStyle = styled.div`
  //box-shadow: 0px 1px 7px rgba(0, 0, 0, 0.1), 0px 4px 5px -2px rgba(0, 0, 0, 0.12), 0px 10px 15px -5px rgba(0, 0, 0, 0.2);
  max-width: 790px;
  min-width: 245px;
  max-height: 310px;
  min-height: 310px;
  zIndex : 1;
  margin-top: 3px;
  margin-right: 2px;
  margin-bottom: 3px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  transition: background-color 0.4s;
  background-color: ${props =>props.rowOverflowBothEnds ? '#800000' : 'white'};
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
                            onClick={() => CommonService.onOpenDialog(setVisible2, [{
                                callback: setValue3,
                                value   : props.name
                            }])}/>
                    <Button style={{marginLeft: "40px", marginTop: "80px", zIndex: 7, fontSize: "12px", scale: "120%"}}
                            icon="pi pi-trash"
                            size="lg"
                            rounded
                            text
                            onClick={() => setVisible1(true)}/>
                </RowSideCollapsable>
                }
                <RowsStyle rowOverflowBothEnds={
                    ((props.board && !props.board.is_static) &&
                        ((props.board.min_card > (props.row.card_data.length)&& (props.board.min_card != null)) ||
                        ((props.board.max_card < props.row.card_data.length)&& (props.board.max_card != null))))
                }>

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
                               direction="horizontal"
                    >
                        {(provided) => (
                            <CardsStyle
                                rowOverflow={(props.limit < (props.cards).length) && (props.limit != null)
                            }

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
                                          restrictedBoardsData={card.restricted_boards}
                                          parentCard={card.parent_card}
                                          childData={card.child_data}
                                          setBoards={props.setBoards}
                                          setRemaining={props.setRemaining}
                                          cardsChoice={props.cardsChoice}
                                          setCardsChoice={props.setCardsChoice}
                                          callRestrictionUpdate={props.callRestrictionUpdate}
                                          areChildrenCollapsed={card.are_children_collapsed}
                                          areCarditemsCollapsed={card.are_carditems_collapsed}
                                          updatedAt={card.updated_at}
                                        // setCallRestrictionUpdate={props.setCallRestrictionUpdate}
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