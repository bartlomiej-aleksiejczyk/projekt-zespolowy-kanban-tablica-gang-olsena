import React, {useState} from 'react'
import styled from 'styled-components';
import {Droppable, Draggable} from 'react-beautiful-dnd';
import Card from "./Card";
import ContentEditable from 'react-contenteditable';
import 'primeicons/primeicons.css';
import {Button} from 'primereact/button';
import {ConfirmDialog} from 'primereact/confirmdialog';
import {InputText} from 'primereact/inputtext';
import {InputNumber} from 'primereact/inputnumber';
import ApiService from "../services/ApiService";
import CommonService from "../services/CommonService";


const BoardStyle = styled.div`
  box-shadow: 0px 1px 7px rgba(0, 0, 0, 0.1), 0px 4px 5px -2px rgba(0, 0, 0, 0.12), 0px 10px 15px -5px rgba(0, 0, 0, 0.2);
  max-width: 230px;
  min-width: 230px;
  zIndex : 1;
  margin-right: 20px;
  margin-top: 140px;
  margin-bottom: auto;
  border: 4px solid #a09bf5;
  border-radius: 12px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
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
  margin-bottom: -5px;
`

const Title = styled.h2`
  text-align: center;
  max-width: 210px;
  min-width: 210px;
  padding: 0px;
  margin-bottom: 20px;
  flex-direction: column;
  word-wrap: break-word;
  flex-wrap: wrap;
`;

const CardsStyle = styled.div`
  margin-top: -8px;
  flex-grow: 2;
  min-height: 134px;
`;
const CardButtons = styled.div`
  margin-top: 22px;
  margin-bottom: 25px;


`;

function Board(props) {
    const handleInputChangeName = (e) => {
        ApiService.updateBoard(props.backId, {"name": e.target.innerHTML}).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards)
        });
    }
    const handleInputChangeLimit = (e) => {
        setValue2(e.value);
        ApiService.updateBoard(props.backId, {"max_card": e.value}).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards)
        });
    }

    const accept = () => {
        ApiService.removeBoard((props.backId)).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards)
        });
    }

    const acceptAddCard = () => {
        ApiService.newCard(props.backId, value).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards)
            setValue('');
        });
    }
    const rejectAddCard = () => {
        setValue('');
    }
    const acceptEditBoard = () => {
        ApiService.updateBoard(props.backId, {"name": value3}).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards)
        });

    }
    const rejectEditBoard = () => {
        setValue3(props.name);
    }
    const [visible, setVisible] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [visi, setVisi] = useState(false);
    const [value, setValue] = useState('');
    const [value2, setValue2] = useState(props.limit);
    const [value3, setValue3] = useState(props.name);
    return (
        <Draggable key={props.backId}
                   draggableId={props.dragId}
                   isDragDisabled={props.is_static}
                   index={props.index}>
            {provided => (
                <BoardStyle
                    {...provided.dragHandleProps}
                    boardOverflow={(props.limit < (props.cards).length) && (props.limit != null)}
                    {...provided.draggableProps}
                    ref={provided.innerRef}>
                    <Title>
                        <ContentEditable spellCheck="false"
                                         className="Title"
                                         html={props.name}
                                         disabled={true}
                                         onBlur={handleInputChangeName}/>
                    </Title>
                    {!props.is_static &&
                    <Label>
                        Limit: <InputNumber inputId="minmax-buttons" value={value2}
                                            onValueChange={(e) => handleInputChangeLimit(e)}

                                            mode="decimal"
                                            showButtons min={0}
                                            max={100}
                                            size="1"
                                            style={{height: '2em', width: '100%'}}
                    />
                    </Label>
                    }
                    <ConfirmDialog visible={visi} onHide={() => setVisi(false)}
                                   message=<InputText value={value} onChange={(e) => setValue(e.target.value)}/>
                    header="Wpisz zadanie:"
                    icon="pi pi-check-square"
                    acceptLabel="Akceptuj"
                    rejectLabel="Odrzuć"
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
                                onClick={() => CommonService.onOpenDialog(setVisible2,setValue3,props.name)}/>
                        <Button style={{}}
                                icon="pi pi-plus"
                                size="lg"
                                rounded
                                text
                                aria-label="Filter"
                                onClick={() => CommonService.onOpenDialog(setVisi, setValue, '')}/>
                        <ConfirmDialog visible={visible2} onHide={() => setVisible2(false)}
                                       message=<InputText value={value3} onChange={(e) => setValue3(e.target.value)} />
                        header="Edytuj kolumne:"
                        icon="pi pi-pencil"
                        acceptLabel="Akceptuj"
                        rejectLabel="Odrzuć"
                        accept={acceptEditBoard}
                        reject={rejectEditBoard}
                        />
                        {!props.is_static &&
                        <span>
                            <ConfirmDialog visible={visible}
                                           onHide={() => setVisible(false)}
                                           message="Czy na pewno chcesz usunąć kolumnę?"
                                           header="Potwierdzenie usunięcia"
                                           icon="pi pi-trash"
                                           acceptLabel="Tak"
                                           rejectLabel="Nie"
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
                </BoardStyle>
            )}
        </Draggable>
    )
}

export default Board;

