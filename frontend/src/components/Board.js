import React, {useState} from 'react'
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

const BoardStyle = styled.div`
  box-shadow: 0px 1px 7px rgba(0, 0, 0, 0.1), 0px 4px 5px -2px rgba(0, 0, 0, 0.12), 0px 10px 15px -5px rgba(0, 0, 0, 0.2);
  min-width: ${props=>props.is_static? ("300px"):("250px")}
  max-width: 474px;
  margin-right: 4px;
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
  margin-left: 12px;
  //margin-left: -12%;
  margin-top: 6px;
  gap: 5px;
  margin-bottom: 0px;
`
const LabelDummy = styled.label`
    padding: 13px;
`

const Title = styled.h4`
  text-align: center;
  min-width: 131px;
  height: 21px;
  padding: 0px;
  margin-bottom: 0px;
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
    const [callRestrictionUpdate, setCallRestrictionUpdate] = useState(false);

    const apiService = useUserService();


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
        setCallRestrictionUpdate(true)
        console.log(callRestrictionUpdate)
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
        apiService.updateBoard(props.backId, {"name": value3}).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards);
            setCallRestrictionUpdate(true);
            console.log("props.callRestrictionUpdate");
            console.log(callRestrictionUpdate)

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
                            {/*Są tutaj przyciski min z max pomylone do naprawy*/}
                            <InputNumber inputId="minmax-buttons" value={minCard}
                                         onValueChange={(e) => handleInputChangeLimit(e.value, props.board.max_card)}
                                         mode="decimal"
                                         showButtons
                                         max={maxCard-1}
                                         size="1"
                                         style={{scale:'60%',marginRight:'8px'}}
                                         min={maxCard>1?1:0}
                            />
                            <div>:</div>
                            <InputNumber inputId="minmax-buttons" value={maxCard}
                                         onValueChange={(e) => handleInputChangeLimit(props.board.min_card, e.value)}
                                         min={(minCard+1)}
                                         mode="decimal"
                                         showButtons
                                         max={100}
                                         size="1"
                                         style={{scale:'60%',marginRight:'8px'}}
                            />
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
                        <Button style={{marginRight: "20px"}}
                                icon="pi pi-pencil"
                                size="sm"
                                rounded
                                text
                                aria-label="Filter"
                                onClick={() => CommonService.onOpenDialog(setVisible2, [{
                                    callback: setValue3,
                                    value   : props.name
                                }])}/>
                        <Button style={{}}
                                icon="pi pi-plus"
                                size="sm"
                                rounded
                                text
                                aria-label="Filter"
                                onClick={() => CommonService.onOpenDialog(setVisi, [{callback: setValue, value: ''}])}/>
                        <ConfirmDialog visible={visible2} onHide={() => setVisible2(false)}
                                       message=<InputText value={value3} onChange={(e) => setValue3(e.target.value)}/>
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
                            <Button style={{marginLeft: "20px"}}
                                    icon="pi pi-trash"
                                    size="sm"
                                    rounded
                                    text
                                    aria-label="Filter"
                                    onClick={() => setVisible(true)}/>
                        </span>
                        }
                    </CardButtons>
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
                                 remaining={props.remaining}
                                 cardsChoice={props.cardsChoice}
                                 setCardsChoice={props.setCardsChoice}
                                 callRestrictionUpdate={callRestrictionUpdate}
                                 setCallRestrictionUpdate={setCallRestrictionUpdate}
                            />
                        )}
                    </RowStyle>
                </BoardStyle>
            )}
        </Draggable>
    )
}

export default Board;

