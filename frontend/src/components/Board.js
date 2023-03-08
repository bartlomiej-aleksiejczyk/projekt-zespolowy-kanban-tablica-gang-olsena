import React, {useState, useRef} from 'react'
import styled from 'styled-components';
import {Droppable, Draggable} from 'react-beautiful-dnd';
import Card from "./Card";
import ContentEditable from 'react-contenteditable';
import 'primeicons/primeicons.css';
import {Button} from 'primereact/button';
import {ConfirmDialog} from 'primereact/confirmdialog';
import {Toast} from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';


const BoardStyle = styled.div`
  box-shadow: 0px 1px 7px rgba(0, 0, 0, 0.1), 0px 4px 5px -2px rgba(0, 0, 0, 0.12), 0px 10px 15px -5px rgba(0, 0, 0, 0.2);
  max-width: 230px;
  min-width: 230px;
  zIndex : 1;
  margin-right: 20px;
  margin-top: 125px;
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
  gap: 8px;
  margin-bottom: -10px;
`

const Title = styled.h2`
  text-align: center;
  max-width: 210px;
  min-width: 210px;
  padding: 0px;
  margin-bottom: 10px;
  flex-direction: column;
  max-width: 192px;
  min-width: 192px;
  word-wrap: break-word;
  flex-wrap: wrap;
`;

const CardsStyle = styled.div`
  //zmienic
  margin-top: -8px;
  flex-grow: 2;
  min-height: 134px;
`;

function Board(props) {
    const handleInputChangeName = (e) => {
        renameBoard(props.backId, e.target.innerHTML);
    }
    const handleInputChangeLimit = (e) => {
        setValue2(e.value);
        changeId(props.backId, e.value);
    }

    function newCard(boardId, description) {
        fetch(`http://localhost:8000/api/board/${boardId}/card/`,
            {
                method : 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body   : JSON.stringify({"description": description}),
            },)
            .then(() => props.fetchDb());
    }

    function removeBoard(taskId) {
        fetch(`http://localhost:8000/api/board/${taskId}/`,
            {
                method: 'DELETE'
                ,
            })
            .then(() => props.fetchDb());
    }

    function renameBoard(boardId, boardName) {
        fetch(`http://localhost:8000/api/board/`,
            {
                method : 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body   : JSON.stringify({"id": boardId, "name": boardName}),
            },)
            .then(() => props.fetchDb());
    }

    function changeId(boardId, limit) {
        fetch(`http://localhost:8000/api/board/`,
            {
                method : 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body   : JSON.stringify({"id": boardId, "max_card": limit}),
            },)
            .then(() => props.fetchDb());
    }

    const toast = useRef(null);
    const accept = () => {
        removeBoard((props.backId));
    }

    const reject = () => {

    }
    const acceptAddCard = () => {
        newCard(props.backId, value);
        setValue('');
    }
    const rejectAddCard = () => {
        setValue('');
    }
    const acceptEditBoard = () => {
        renameBoard(props.backId, value3);
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
    const onOpen = (callback,setCallback,setValue) => {
        callback(true);
        setCallback(setValue);
    }
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
                        <ContentEditable spellcheck="false"
                                         className="Title"
                                         html={props.name}
                                         disabled={false}
                                         onBlur={handleInputChangeName}/>
                    </Title>
                    {!props.is_static &&
                    <Label for="Limit">
                        Limit: <InputNumber inputId="minmax-buttons" value={value2} onValueChange={(e) => handleInputChangeLimit(e)}

                         mode="decimal"
                          showButtons min={0}
                           max={100}
                           size="1"
                           style={{height:'2em',width:'100%'}}
                            />
                    </Label>
                    }
                    <p>
                    <ConfirmDialog visible={visi} onHide={() => setVisi(false)}
                     message=<InputText value={value} onChange={(e) => setValue(e.target.value) } />
                     header="Wpisz zadanie:"
                     icon="pi pi-check-square"
                     acceptLabel="Akceptuj"
                     rejectLabel="Odrzuć"
                     accept={acceptAddCard}
                     reject={rejectAddCard}
                     />
                        <Button style={{}}
                                icon="pi pi-plus"
                                size="lg"
                                rounded
                                text
                                aria-label="Filter"
                                onClick={() => onOpen(setVisi,setValue,'')}/>
                        <ConfirmDialog visible={visible2} onHide={() => setVisible2(false)}
                         message=<InputText value={value3} onChange={(e) => setValue3(e.target.value)} />
                         header="Edytuj kolumne:"
                         icon="pi pi-pencil"
                         acceptLabel="Akceptuj"
                         rejectLabel="Odrzuć"
                         accept={acceptEditBoard}
                         reject={rejectEditBoard}
                         />
                        <Button style={{}}
                                icon="pi pi-pencil"
                                size="lg"
                                rounded
                                text
                                aria-label="Filter"
                                onClick={() => onOpen(setVisible2,setValue3,props.name)}/>
                        {!props.is_static &&
                        <span>
                            <Toast ref={toast}/>
                            <ConfirmDialog visible={visible}
                                           onHide={() => setVisible(false)}
                                           message="Czy na pewno chcesz usunąć kolumnę?"
                                           header="Potwierdzenie usunięcia"
                                           icon="pi pi-exclamation-triangle"
                                           acceptLabel="Tak"
                                           rejectLabel="Nie"
                                           accept={accept}
                                           reject={reject}/>
                            <Button style={{}}
                                    icon="pi pi-trash"
                                    size="lg"
                                    rounded
                                    text
                                    aria-label="Filter"
                                    onClick={() => setVisible(true)}/>
                        </span>
                        }
                    </p>
                    <Droppable droppableId={props.droppableId}
                               type="card">
                        {(provided) => (
                            <CardsStyle
                                ref={provided.innerRef}
                                {...provided.droppableId}>
                                {(props.cards).map((card, indexDrag) =>
                                    <Card backId={card.id}
                                          dragId={(card.id).toString()}
                                          description={card.description}
                                          fetchDb={props.fetchDb}
                                          indexDrag={indexDrag}
                                          newCard={newCard}
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

                       /*<ContentEditable
                            className="Limit"
                            spellcheck="false"
                            html={String(props.limit)}
                            disabled={false}
                            onBlur={handleInputChangeLimit}/>*/