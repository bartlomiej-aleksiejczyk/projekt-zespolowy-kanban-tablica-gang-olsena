import React, {useState} from 'react'
import styled from "styled-components";
import {Draggable} from "react-beautiful-dnd";

const CardStyle = styled.div`
  //zmienic
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: revert;
`

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
        editCard(props.board, props.backId, e.target.value);
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
            <Draggable draggableId={props.dragId} index={props.indexDrag}>
                {(provided) => (
        <CardStyle{...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
            <div className = 'tasks-container'>
                {
                    isEditing ?
                        <form>
                            <input name={props.backId} type = 'text' onChange={handleInputChange} defaultValue = {props.description}/>
                        </form>
                        : <p onDoubleClick ={()=> setIsEditing(true)}>{props.description}</p>
                }
            </div>
            <button onClick={() => removeCard((props.backId))} type="button">Usuń zadanie</button>

        </CardStyle>
                )}
            </Draggable>
    )
}
export default Card
