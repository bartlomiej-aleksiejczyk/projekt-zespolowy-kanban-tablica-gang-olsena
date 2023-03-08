import React, {useState, useRef} from 'react'
import styled from "styled-components";
import {Draggable} from "react-beautiful-dnd";
import ContentEditable from 'react-contenteditable';
import 'primeicons/primeicons.css';
import {Button} from 'primereact/button';
import {ConfirmDialog} from 'primereact/confirmdialog';
import {Toast} from 'primereact/toast';


const CardStyle = styled.div`
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.03), 0px 0px 2px rgba(0, 0, 0, 0.06), 0px 2px 6px rgba(0, 0, 0, 0.12);
  max-width: 210px;
  min-width: 210px;
  border: 3px solid #b7b3ea;
  border-radius: 12px;
  padding: 4px;
  margin-top: -5px;
  margin-outside: 1px;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  background-color: inherit;
`;

const Description = styled.div`
  flex-direction: column;
  max-width: 192px;
  min-width: 192px;
  word-wrap: break-word;
  flex-wrap: wrap;
  padding-left: 5px;
  padding-right:5px;
`;

function Card(props) {
    function editCard(boardId, id, description) {
        fetch(`http://localhost:8000/api/board/${boardId}/card/`,
            {
                method : 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body   : JSON.stringify({"id": id, "description": description}),
            },)
            .then(() => props.fetchDb());
    }

    const handleInputChange = (e) => {
        editCard(props.board, props.backId, e.target.innerHTML);
    }

    function removeCard(taskId) {
        fetch(`http://localhost:8000/api/card/${taskId}/`, {
            method: 'DELETE',
            body  : JSON.stringify({pk: taskId}),
        }).then(() => props.fetchDb());
    }

    const toast = useRef(null);
    const accept = () => {
        removeCard((props.backId));
    }

    const reject = () => {}
    const [visible, setVisible] = useState(false);
    return (

        <Draggable
            key={props.backId}
            draggableId={props.dragId}
            index={props.indexDrag}>
            {(provided) => (
                <CardStyle{...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}>
                    <Description
                        className='tasks-container'>
                        <ContentEditable spellcheck="false"
                                         className="Description"
                                         html={props.description}
                                         disabled={false}
                                         onBlur={handleInputChange}/>
                    </Description>
                    <Toast ref={toast}/>
                    <ConfirmDialog visible={visible}
                                   onHide={() => setVisible(false)}
                                   message="Czy na pewno chcesz usunąć zadanie?"
                                   header="Potwierdzenie usunięcia"
                                   icon="pi pi-trash"
                                   acceptLabel="Tak"
                                   rejectLabel="Nie"
                                   accept={accept}
                                   reject={reject}/>
                    <Button style={{marginLeft: "154px", marginBottom: "-7px"}}
                            onClick={() => setVisible(true)}
                            icon="pi pi-times"
                            rounded
                            text
                            severity="danger"
                            aria-label="Cancel"/>
                </CardStyle>
            )}
        </Draggable>
    )
}

export default Card
