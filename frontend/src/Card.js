import React, {useState} from 'react'
import styled from "styled-components";
import {Draggable} from "react-beautiful-dnd";
import ContentEditable from 'react-contenteditable';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';

const CardStyle = styled.div`
  //zmienic
  max-width: auto;
  min-width: inherit;
  border: 1px solid lightgrey;
  border-radius: 6px;
  padding: 4px;
  margin-bottom: 8px;
  display: flex;
  flex-direction:column;
  flex-wrap: wrap;
`;

const Description = styled.div`
  flex-direction: column;
  max-width: 300px;
  min-width: inherit;
  word-wrap: break-word;
  flex-wrap: wrap;
  padding-left: 15px;
  padding-right:15px;
`;

function Card(props)
{
    function editCard(boardId, id, description) {
        fetch(`http://localhost:8000/api/board/${boardId}/card/`,
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({"id": id, "description": description}),
            },)
            .then(() => props.fetchDb());
    }
    const [isEditing, setIsEditing] = useState(false)
    const handleInputChange = (e)=> {
        console.log("wykonuje sie", (props.backId));
        editCard(props.board, props.backId, e.target.innerHTML);
    }
    function removeCard(taskId) {
        console.log(JSON.stringify({pk: taskId}))

        fetch(`http://localhost:8000/api/card/${taskId}/`,
            {  method: 'DELETE'
                , body: JSON.stringify({pk: taskId}),
                    })
            .then(() => props.fetchDb());
    }
        return (
            <Draggable  key={props.backId} draggableId={props.dragId} index={props.indexDrag}>
                {(provided) => (
              <CardStyle{...provided.draggableProps}
                  {...provided.dragHandleProps}
                  ref={provided.innerRef}
                  onDoubleClick={console.log(props.dragId,props.indexDrag,props.backId)}>
                <Description className='tasks-container'><ContentEditable className="Description" html={props.description}
                                                              disabled={false} onBlur={handleInputChange}/></Description>
            {/*<div className = 'tasks-container'>
                {
                    isEditing ?
                        <form>
                            <input name={props.backId} type = 'text' onChange={handleInputChange} defaultValue = {props.description}/>
                        </form>
                        : <p onDoubleClick ={()=> setIsEditing(true)}>{props.description}</p>
                }
            </div>
           */}
               <Button style={{ marginLeft: "auto" }} onClick={() => removeCard((props.backId))} icon="pi pi-times" rounded text severity="danger" aria-label="Cancel"/>
             </CardStyle>
                )}
            </Draggable>
    )
}
export default Card
