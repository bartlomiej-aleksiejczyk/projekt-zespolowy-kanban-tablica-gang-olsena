import React, {useState, useRef} from 'react'
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
import { ContextMenu } from 'primereact/contextmenu';

const CardsStyle = styled.div`
  max-width: 473px;
  min-width: 137px;
  margin-top: 3px;
  margin-right: auto;
  width: auto;
  margin-bottom: 3px;
  min-height: 183px;
  max-height: 183px;
  overflow: auto;
  display: inline-flex;
  
  // background-color: {props =>
  //   props.rowOverflow ? '#800000' : 'white'};
  // color: {props =>
  //   props.rowOverflow ? 'white' : 'inherit'};
`;
const RowsStyleExtension = styled.div`
  //box-shadow: 0px 1px 7px rgba(0, 0, 0, 0.1), 0px 4px 5px -2px rgba(0, 0, 0, 0.12), 0px 10px 15px -5px rgba(0, 0, 0, 0.2);
  max-width: 474px;
  min-width: 150px;
  max-height: 186px;
  min-height: 36px;
  //border: 3px solid #b7b3ea;
  background-color: #c4c0f1;
  margin-top: 2px;
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
  min-height: 183px;
  max-height: 183px;
  z-index: 8;
  border-radius: 4px;
  background-color: white;

`;
const RowCollapsable = styled.div`
  content: "my tooltip";
  min-width: 150px;
  max-height: 186px;
  min-height: 186px;
  margin-bottom: 2px;
  background-color: white;
  margin-top: 3px;
`;
const RowsStyle = styled.div`
  //box-shadow: 0px 1px 7px rgba(0, 0, 0, 0.1), 0px 4px 5px -2px rgba(0, 0, 0, 0.12), 0px 10px 15px -5px rgba(0, 0, 0, 0.2);
  max-width: 474px;
  min-width: 147px;
  max-height: 186px;
  min-height: 186px;
  zIndex : 1;
  margin-top: 2px;
  margin-right: 1px;
  margin-bottom: 2px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  transition: background-color 0.4s;
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
    const menu = useRef(null);
    const items = [
        {
            label: t("rowEdit"),
            icon: 'pi pi-pencil',
            command: () => CommonService.onOpenDialog(setVisible2, [{
                callback: setValue3,
                value   : props.name
            }])
        },
        {
            label: t("rowRemove"),
            icon: 'pi pi-trash',
            command:() => setVisible1(true)
        }
    ];
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
            <ContextMenu model={items} ref={menu}></ContextMenu>
            {props.boardIndex === 0 &&
            <RowSide>
                <ToggleButton className={`row-${props.backId}`}
                              onContextMenu={(e) => menu.current.show(e)}
                              style={{width: "136px", marginLeft: "4px", marginTop: "6px",height:"30px"}}
                              onLabel={props.name} offLabel={props.name} onIcon="pi pi-minus" offIcon="pi pi-plus"
                              checked={!props.isCollapsed}
                              onChange={props.isCollapsed ? () => handleExpand() : () => handleCollapse()}/>
            </RowSide>
            }
            {!props.isCollapsed &&
            <RowCollapsable>
                {props.boardIndex === 0 &&
                <RowSideCollapsable onContextMenu={(e) => menu.current.show(e)}>

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