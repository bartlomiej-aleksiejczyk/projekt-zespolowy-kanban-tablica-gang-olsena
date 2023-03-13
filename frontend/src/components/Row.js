import React from 'react'
import styled from 'styled-components';
import {Droppable} from 'react-beautiful-dnd';
import Card from "./Card";
import 'primeicons/primeicons.css';


const TitleRow = styled.h3`
  text-align: center;
  max-width: 200px;
  min-width: 200px;
  padding: 0px;
  margin-bottom: 20px;
  flex-direction: column;
  word-wrap: break-word;
  flex-wrap: wrap;
` ;
const RowsStyle = styled.div`
  box-shadow: 0px 1px 7px rgba(0, 0, 0, 0.1), 0px 4px 5px -2px rgba(0, 0, 0, 0.12), 0px 10px 15px -5px rgba(0, 0, 0, 0.2);
  max-width: 210px;
  min-width: 210px;
  zIndex : 1;
  margin-right: 6px;
  margin-top: 140px;
  margin-bottom: auto;
  border-radius: 6px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  transition: background-color 2s ease;
  background-color: ${props =>
    props.boardOverflow ? '#800000' : 'white'};
  color: ${props =>
    props.boardOverflow ? 'white' : 'inherit'};
` ;

const CardsStyle = styled.div`
  margin-top: -8px;
  flex-grow: 2;
  min-height: 200px;
  max-height: 200px;
` ;
function Row(props) {
    return(
        <RowsStyle>
            <TitleRow>
                {props.name}
            </TitleRow>
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
        </RowsStyle>
    )
}

export default Row;