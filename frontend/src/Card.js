import React, {useState} from 'react'
import styled from "styled-components";
import {Draggable} from "react-beautiful-dnd";
import ContentEditable from 'react-contenteditable';

const CardStyle = styled.div`
  //zmienic
  max-width: inherit;
  min-width: inherit;
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  display: flex;
  flex-direction:column;
  flex-wrap: wrap;
`;
const Description = styled.div`
  flex-direction: column;
  max-width: 120px;
  min-width: 120px;
  word-wrap: break-word;
  flex-wrap: wrap;
  padding-left: 15px;
  padding-right:15px;
`;





function Card(props)
{
    function editCard(boardId, id, description) {
/*
        setEditSet(!editSet)
*/
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
/*
    const [editSet, setEditSet] = useState(true)
*/
    const handleInputChange = (e)=> {
        editCard(props.board, props.backId, e.target.innerHTML);
    }

/*    async function edytujOpisPomoc (){
        setEditSet(!editSet)
    };*/
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
                  ref={provided.innerRef}>
            <Description className='tasks-container'><ContentEditable className="Description" html={props.description} onFocus={console.log("fokus")}
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
{/*
            <button onClick={() => edytujOpisPomoc()} type="button">edytuj</button>
*/}
            <button onClick={() => removeCard((props.backId))} type="button">Usuń zadanie</button>
        </CardStyle>
                )}
            </Draggable>
    )
}
export default Card
