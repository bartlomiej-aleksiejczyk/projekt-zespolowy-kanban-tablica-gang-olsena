import React from 'react';
import styled from 'styled-components';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Card from "./Card";
import ContentEditable from 'react-contenteditable';


const BoardStyle = styled.div`
  margin: 7px;
  border: 1px solid #868686;
  border-radius: 3px;
  width: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 10px;
  transition: background-color 2s ease;
  background-color: ${props =>
    props.boardOverflow ? 'red' : 'inherit'};
`;
const Limit = styled.p`
  padding: 4px;
`;
const Title = styled.h3`
  padding: 6px;
`;
const CardsStyle = styled.div`
  //zmienic
  padding: 7px;
  flex-grow: 2;
  min-height: 134px;
`;

function Board(props) {
    const handleInputChangeName = (e)=> {
        console.log("wykonuje sie", (props.backId));
        renameBoard(props.backId, e.target.innerHTML);
    }
    const handleInputChangeLimit = (e)=> {
        console.log("wykonuje sie", (props.backId));
        changeId(props.backId,parseInt( e.target.innerHTML));
    }
    function newCard(boardId, name, description) {

        fetch(`http://localhost:8000/api/board/${boardId}/card/`,
            {  method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({"name":name,"description":description }),
            },)
            .then(() => props.fetchDb());
    }
    function removeBoard(taskId) {
        fetch(`http://localhost:8000/api/board/${taskId}/`,
            {  method: 'DELETE'
                ,
            })
            .then(() => props.fetchDb());
    }
    function renameBoard(boardId,boardName) {
        fetch(`http://localhost:8000/api/board/`,
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({"id": boardId, "name": boardName}),
            },)
            .then(() => props.fetchDb());
    }
        function changeId(boardId,limit) {
            fetch(`http://localhost:8000/api/board/`,
                {  method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ "id":boardId,"max_card":limit}),
                },)
                .then(() => props.fetchDb());
}
    return (
        <Draggable key={props.backId} draggableId={props.dragId} index={props.index}>
            {provided => (
            <BoardStyle
                boardOverflow={(props.limit<(props.cards).length)&&(props.limit!=null)}
                {...provided.draggableProps}
                ref={provided.innerRef}
            >

                <Title  > {props.name} :<ContentEditable className="Title" html={(props.name)} disabled={false} onBlur={handleInputChangeName}/></Title>
                <Limit{...provided.dragHandleProps}>Limit:  <ContentEditable className="Limit" html={String(props.limit)} disabled={false} onBlur={handleInputChangeLimit}/></Limit>
                <button onClick={() => newCard(props.backId,"Temporary","Click on this text to edit")} type="button">Dodaj zadanie</button>
                <button onClick={() => removeBoard(props.backId)} type="button">Remove board</button>
                <Droppable droppableId={props.dragId}
                           type="card">
                    {(provided) => (
                        <CardsStyle
                            ref={provided.innerRef}
                            {...provided.droppableId}
                        >
                            {
                                (props.cards).map((card, indexDrag) =>
                                    <Card backId={card.id} dragId={(card.id).toString()}   description={card.description} fetchDb={props.fetchDb} indexDrag={indexDrag}  newCard={newCard} name={card.name} board={card.board}/>
                                )
                            }
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

