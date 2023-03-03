import React, {useState, useRef} from 'react'
import styled from "styled-components";
import {Draggable} from "react-beautiful-dnd";
import {ConfirmDialog} from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
const CardStyle = styled.div`
  //zmienic
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
`;
const Button = styled.button`
    background-color:transparent;
    border:none;
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
    const toast = useRef(null);

    const accept = () => {
        removeCard((props.backId));
    }

    const reject = () => {

    }
    const [visible, setVisible] = useState(false);
        return (

            <Draggable  key={props.backId} draggableId={props.dragId} index={props.indexDrag}>
                {(provided) => (
        <CardStyle{...provided.draggableProps}
                  {...provided.dragHandleProps}
                  ref={provided.innerRef}
                  onDoubleClick={console.log(props.dragId,props.indexDrag,props.backId)}
        >

            <div className = 'tasks-container'>
                {
                    isEditing ?
                        <form>
                            <input name={props.backId} type = 'text' onChange={handleInputChange} defaultValue = {props.description}/>
                        </form>
                        : <p onDoubleClick ={()=> setIsEditing(true)}>{props.description}</p>
                }
            </div>

            <Toast ref={toast} />
            <ConfirmDialog visible={visible} onHide={() => setVisible(false)} message="Czy na pewno chcesz usunąć zadanie?"
                header="Confirmation" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} />
             <div>
            <Button onClick={() => setVisible(true)} style={{ color: 'red' }}><i className="pi pi-times" style={{ fontSize: '1rem' }}></i></Button>
            </div>

        </CardStyle>
                )}
            </Draggable>
    )
}
export default Card
