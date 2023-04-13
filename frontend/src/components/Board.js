import React, {useState, useRef} from 'react'
import styled from 'styled-components';
import {Draggable} from 'react-beautiful-dnd';
import ContentEditable from 'react-contenteditable';
import 'primeicons/primeicons.css';
import {Button} from 'primereact/button';
import {ConfirmDialog} from 'primereact/confirmdialog';
import {InputText} from 'primereact/inputtext';
import {InputNumber} from 'primereact/inputnumber';
import ApiService from "../services/ApiService";
import CommonService from "../services/CommonService";
import Row from "./Row";
import {useUserService} from "../utils/UserServiceContext";
import {useTranslation} from 'react-i18next';
import {Tooltip} from 'primereact/tooltip';
import { ContextMenu } from 'primereact/contextmenu';

const BoardStyle = styled.div`
  box-shadow: 0px 1px 7px rgba(0, 0, 0, 0.1), 0px 4px 5px -2px rgba(0, 0, 0, 0.12), 0px 10px 15px -5px rgba(0, 0, 0, 0.2);
  min-width: ${props=>props.is_static? ("300px"):("250px")}
  max-width: 474px;
  margin-right: 6px;
  margin-top: 108px;
  margin-bottom: 27px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  transition: background-color 2s ease;
  background-color: ${props =>
    props.boardOverflow ? '#800000' : 'white'};
  color: ${props =>
    props.boardOverflow ? 'white' : 'inherit'};

`;

const Label = styled.label`
  align-items: center;
  font-weight: bold;
  justify-content: center;
  display: flex;
  //margin-left: -12%;
  color: #3e4349;
  gap: 5px;
  margin-bottom: 10px;
  font-style: oblique
`
const LabelDummy = styled.label`
    padding: 22px;
`
const BoardTop = styled.label`
    height: 100px;
`
const Title = styled.h3`
  text-align: center;
  padding: 5px;
  flex-direction: column;
  word-wrap: break-word;
  flex-wrap: wrap;
  overflow: auto;
`;

const RowStyle = styled.section`
  width: inherit;
  display: flex;
  flex-direction: column;
  justify-content: start;

`;
const CardButtons = styled.div`
  margin-top:3px;
  margin-left: auto;
  margin-right: auto;


`;

function Board(props) {
    const {t, i18n} = useTranslation();
    const [visible, setVisible] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [visi, setVisi] = useState(false);
    const [value, setValue] = useState('');
    const [minCard, setMinCard] = useState(props.board.min_card);
    const [maxCard, setMaxCard] = useState(props.board.max_card);
    const [value3, setValue3] = useState(props.name);
    const apiService = useUserService();
    const menu = useRef(null);
    const items = [
                {
                    label: t("BoardAddCard"),
                    icon: 'pi pi-plus',
                    command: () => CommonService.onOpenDialog(setVisi, [{callback: setValue, value: ''}])
                },
                {
                    label: t("BoardEditColumnContext"),
                    icon: 'pi pi-pencil',
                    command: () => CommonService.onOpenDialog(setVisible2, [{
                        callback: setValue3,
                        value   : props.name
                    }])
                },
                {
                    label: t("BoardRemoveColumn"),
                    icon: 'pi pi-trash',
                    command:() => setVisible(true)
                }
            ];

    const handleInputChangeName = (e) => {
        apiService.updateBoard(props.backId, {"name": e.target.innerHTML}).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards)
        });
    }
    const handleInputChangeLimit = (min_card, max_card) => {
        if(min_card === props.board.min_card && max_card === props.board.max_card) return;

        setMinCard(min_card);
        setMaxCard(max_card);
        apiService.updateBoard(props.backId, {"min_card": min_card, "max_card": max_card}).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards)
        });
    }

    const accept = () => {

        apiService.removeBoard((props.backId)).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards, props.setRemaining);
        });
    }

    const acceptAddCard = () => {
        apiService.newCard(props.backId, value).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards, props.setRemaining, props.setCardsChoice,)
            ;
        });
    }
    const rejectAddCard = () => {
        setValue('');
    }
    const acceptEditBoard = () => {
        apiService.updateBoard(props.backId, {"name": value3, "min_card": minCard, "max_card": maxCard}).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards);

        });


    }
    const rejectEditBoard = () => {
        setValue3(props.name);

    }


    return (
        <Draggable key={props.backId}
                   draggableId={props.dragId}
                   isDragDisabled={props.is_static}
                   index={props.index}>
            {provided => (
                <BoardStyle
                    {...provided.dragHandleProps}
                    {...provided.draggableProps}
                    ref={provided.innerRef}>
                    <ContextMenu model={items} ref={menu} ></ContextMenu>
                    <BoardTop className={`board-${props.backId}`} onContextMenu={(e) => menu.current.show(e)} >
                        <Title>
                            <ContentEditable spellCheck="false"
                                             className="Title"
                                             html={props.name}
                                             disabled={true}
                                             onBlur={handleInputChangeName}/>
                        </Title>
                        {(!props.is_static)
                            ? <Label>
                                Limit:
                                {` `}
                                {minCard}
                                <div>:</div>
                                {maxCard}
                            </Label>
                            : <LabelDummy>
                            </LabelDummy>
                        }
                        <ConfirmDialog visible={visi} onHide={() => setVisi(false)}
                                       message=<InputText value={value} onChange={(e) => setValue(e.target.value)}/>
                        header={t("BoardNewCard")}
                        icon="pi pi-check-square"
                        acceptLabel={t("accept")}
                        rejectLabel={t("reject")}
                        accept={acceptAddCard}
                        reject={rejectAddCard}
                        />
                        <CardButtons>

                            <ConfirmDialog visible={visible2} onHide={() => setVisible2(false)}
                                           message={<div className="flex flex-wrap justify-content-center gap-2 mb-2">
                                               <InputText value={value3}
                                                               onChange={(e) => setValue3(e.target.value)}/>
                                           {(!props.is_static)
                                               ? <Label>
                                               Limit:
                                               <InputNumber inputId="minmax-buttons" value={minCard}
                                               onValueChange={(e) => setMinCard(e.value)}
                                               mode="decimal"
                                               showButtons
                                               max={maxCard?maxCard-1:100}
                                               size="1"
                                               style={{height: '2em', width: '80px',marginRight:'30px'}}
                                               min={maxCard>1?1:0}
                                               />
                                               <div>:</div>
                                               <InputNumber inputId="minmax-buttons" value={maxCard}
                                               onValueChange={(e) => setMaxCard(e.value)}
                                               min={(minCard+1)}
                                               mode="decimal"
                                               showButtons
                                               max={100}
                                               size="1"
                                               style={{height: '2em', width: '80',marginRight:'30px'}}
                                               />
                                               </Label>
                                               : <LabelDummy>
                                               </LabelDummy>
                                           }</div>}
                            header={t("BoardEditColumn")}
                            icon="pi pi-pencil"
                            acceptLabel={t("accept")}
                            rejectLabel={t("reject")}
                            accept={acceptEditBoard}
                            reject={rejectEditBoard}
                            />
                            {!props.is_static &&
                            <span>
                                <ConfirmDialog visible={visible}
                                               onHide={() => setVisible(false)}
                                               message={t("BoardRemoveConfirmationDetail")}
                                               header={t("BoardRemoveConfirmation")}
                                               icon="pi pi-trash"
                                               acceptLabel={t("yes")}
                                               rejectLabel={t("no")}
                                               accept={accept}
                                               reject={() => {}}/>
                            </span>
                            }
                        </CardButtons>
                    </BoardTop>
                    <RowStyle>
                        {(props.rows).map((row, indexDrag) =>
                            <Row key={row.id}
                                 limit={props.limit}
                                 boardIndex={(props.board).index}
                                 backId={row.id}
                                 isCollapsed={row.is_collapsed}
                                 dragId={(row.id).toString() + "c"}
                                 droppableId={((props.rows).indexOf(row)).toString() + ((props.boards).indexOf(props.board)).toString()}
                                 cards={row.card_data}
                                 indexDrag={indexDrag}
                                 name={row.name}
                                 row={row}
                                 board={props.board}
                                 users={props.users}
                                 setBoards={props.setBoards}
                                 boards={props.boards}
                                 setRemaining={props.setRemaining}
                                 cardsChoice={props.cardsChoice}
                                 setCardsChoice={props.setCardsChoice}

                            />
                        )}
                    </RowStyle>
                </BoardStyle>
            )}
        </Draggable>
    )
}

export default Board;

