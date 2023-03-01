import React from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import Card from "./Card";

//wziete z w3school

//wziete z w3 school
const BoardStyle = styled.div`
  //zmienic
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 10px;
`;
const Limit = styled.p`
  padding: 6px;
`;
const Title = styled.h3`
  padding: 8px;
`;
const CardsStyle = styled.div`
  //zmienic
  padding: 8px;
  transition: background-color 1s ease;
  background-color: ${props =>
    props.boardOverflow ? 'red' : 'inherit'};
  flex-grow: 1;
  min-height: 100px;
`;


function Board(props) {
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
    return (
            <BoardStyle>
                <Title> {props.name} : {props.frontId}</Title>
                <Limit>Limit: {props.limit}</Limit>
                <Droppable droppableId={props.dragId}>
                    {(provided) => (
                        <CardsStyle
                            ref={provided.innerRef}
                            {...provided.droppableId}
                            boardOverflow={(props.limit<(props.cards).length)&&(props.limit!=null)}
                        >
                            {
                                (props.cards).map((card, indexDrag) =>
                                    <Card backId={card.id} dragId={(card.id).toString()}   description={card.description} fetchDb={props.fetchDb} indexDrag={indexDrag}  newCard={newCard} name={card.name} board={card.board}/>
                                )
                            }
                            <button onClick={() => newCard(props.backId,"Temporary","Teporary description")} type="button">Dodaj zadanie</button>
                            {provided.placeholder}
                        </CardsStyle>
                    )}
                </Droppable>
            </BoardStyle>
)
}
export default Board;

