import React, {useState, useRef} from 'react'
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import Card from "./Card";
import ContentEditable from 'react-contenteditable';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import {ConfirmDialog} from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';


const BoardStyle = styled.div`
  margin: auto;
  margin-top: 70px;
  border: 2px solid #868686;
  border-radius: 12px;
  min-width: 230px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 10px;
  transition: background-color 2s ease;
  background-color: ${props =>
    props.boardOverflow ? '#800000' : 'inherit'};
  color: ${props =>
    props.boardOverflow ? 'white' : 'inherit'};
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
    const toast = useRef(null);
    const accept = () => {
        removeBoard((props.backId));
    }

    const reject = () => {

    }
    const [visible, setVisible] = useState(false);
    return (
    
      <BoardStyle boardOverflow={(props.limit<(props.cards).length)&&(props.limit!=null)} >
        <Title><ContentEditable className="Title" html={(props.name)} disabled={false} onBlur={handleInputChangeName}/></Title>
        <Limit>Limit: <ContentEditable className="Limit" html={String(props.limit)} disabled={false} onBlur={handleInputChangeLimit}/></Limit>
        <p>
          <Button style={{ marginRight: "30px" }} icon="pi pi-plus" rounded text aria-label="Filter" onClick={() => newCard(props.backId, "Temporary","Click on this text to edit")} /> 
          <Toast ref={toast} />
          <ConfirmDialog visible={visible} onHide={() => setVisible(false)} message="Czy na pewno chcesz usunąć kolumnę?"
              header="Confirmation" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} />
          <Button style={{ marginLeft: "30px" }} icon="pi pi-trash" rounded text aria-label="Filter" onClick={() => setVisible(true)}/>
        </p>
        <Droppable droppableId={props.dragId} type="column">
          {(provided) => (
           <CardsStyle ref={provided.innerRef} {...provided.droppableId}>
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
    
    )
}
export default Board;

