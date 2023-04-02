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
import { useTranslation } from 'react-i18next';

const BoardStyle = styled.div`
  box-shadow: 0px 1px 7px rgba(0, 0, 0, 0.1), 0px 4px 5px -2px rgba(0, 0, 0, 0.12), 0px 10px 15px -5px rgba(0, 0, 0, 0.2);
  min-width: 250px;
  margin-right: 6px;
  margin-top: 180px;
  margin-bottom: 45px;
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
  display: flex;
  margin-left: 2px;
  gap: 8px;
  margin-bottom: 0px;
`
const LabelDummy = styled.label`
`

const Title = styled.h2`
  text-align: center;
  min-width: 205px;
  height: 35px;
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
  margin-top:0px;


`;

function Board(props) {
    const { t, i18n } = useTranslation();
    const [visible, setVisible] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [visi, setVisi] = useState(false);
    const [value, setValue] = useState('');
    const [value2, setValue2] = useState(props.limit);
    const [value3, setValue3] = useState(props.name);
    const [callRestrictionUpdate, setCallRestrictionUpdate] = useState(false);

    const apiService = useUserService();


    const handleInputChangeName = (e) => {
        apiService.updateBoard(props.backId, {"name": e.target.innerHTML}).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards)
        });
    }
    const handleInputChangeLimit = (e) => {
        setValue2(e.value);
        apiService.updateBoard(props.backId, {"max_card": e.value}).then((response_data) => {
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
            CommonService.toastCallback(response_data, props.setBoards,props.setRemaining,props.setCardsChoice,)
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
                    {false
                        //(props.is_static)
                        ? <Label>
                            Limit: <InputNumber inputId="minmax-buttons" value={value2}
                                                onValueChange={(e) => handleInputChangeLimit(e)}

                                                mode="decimal"
                                                showButtons min={1}
                                                max={100}
                                                size="1"
                                                style={{height: '2em', width: '100%'}}
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
                                size="lg"
                                rounded
                                text
                                aria-label="Filter"
                                onClick={() => CommonService.onOpenDialog(setVisible2, [{callback: setValue3, value: props.name}])}/>
                        <Button style={{}}
                                icon="pi pi-plus"
                                size="lg"
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
                                    size="lg"
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
                                 users={props.users}
                                 setBoards={props.setBoards}
                                 boards={props.boards}
                                 setRemaining={props.setRemaining}
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

