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
import Board from "./Board";


const RowStyle = styled.div`
  box-shadow: 0px 1px 7px rgba(0, 0, 0, 0.1), 0px 4px 5px -2px rgba(0, 0, 0, 0.12), 0px 10px 15px -5px rgba(0, 0, 0, 0.2);
  max-width: 230px;
  min-width: 230px;
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

`;
const CardsStyle = styled.div`
  margin-top: -8px;
  flex-grow: 2;
  min-height: 200px;
  max-height: 200px;
`;
const RowsStyle = styled.div`
  margin-top: -8px;
  flex-grow: 2;
  min-height: 134px;
`;
function Row(props) {
    return(
        <RowsStyle>

            <CardsStyle>
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
            </CardsStyle>
        </RowsStyle>
    )
}

export default Board;
