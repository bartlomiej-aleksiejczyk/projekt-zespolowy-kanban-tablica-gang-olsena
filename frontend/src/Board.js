import React from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import Card from "./Card";

const BoardStyle = styled.div`
  margin: 7px;
  border: 1px solid #868686;
  border-radius: 3px;
  width: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 10px;
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
  transition: background-color 2s ease;
  background-color: ${props =>
    props.boardOverflow ? 'red' : 'inherit'};
  flex-grow: 2;
  min-height: 134px;
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
                <Droppable droppableId={props.dragId}
                           type="column">
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
                            <button onClick={() => newCard(props.backId,"Temporary","Click on this text to edit")} type="button">Dodaj zadanie</button>
                            {provided.placeholder}
                        </CardsStyle>
                    )}
                </Droppable>
            </BoardStyle>
)
}
export default Board;

