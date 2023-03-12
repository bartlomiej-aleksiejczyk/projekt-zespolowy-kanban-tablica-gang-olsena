import React, {useState} from 'react'
import styled from "styled-components";
import {Draggable} from "react-beautiful-dnd";
import ContentEditable from 'react-contenteditable';
import 'primeicons/primeicons.css';
import {Button} from 'primereact/button';
import {ConfirmDialog} from 'primereact/confirmdialog';
import {InputText} from 'primereact/inputtext';
import ApiService from "../services/ApiService";
import CommonService from "../services/CommonService";

const CardStyle = styled.div`
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.03), 0px 0px 2px rgba(0, 0, 0, 0.06), 0px 2px 6px rgba(0, 0, 0, 0.12);
  max-width: 210px;
  min-width: 210px;
  border: 2px solid #b7b3ea;
  border-radius: 6px;
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
    const handleInputChange = (e) => {
        ApiService.updateCard(props.board, {
            "id"         : props.backId,
            "description": e.target.innerHTML
        }).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards)
        });
    }

    const accept = () => {
        ApiService.removeCard((props.backId)).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards)
        });
    }

    const reject = () => {
    }
    const acceptEditCard = () => {
        ApiService.updateCard(props.board, {
            "id"         : props.backId,
            "description": value
        }).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards);
        });
    }

    const rejectEditCard = () => {
        setValue('');
    }
    const [visi, setVisi] = useState(false);
    const [visible, setVisible] = useState(false);
    const [value, setValue] = useState('');
    return (
                <CardStyle>
                    <Description
                        className='tasks-container'>
                        <ContentEditable
                                         spellCheck="false"
                                         className="Description"
                                         html={props.description}
                                         disabled={false}
                                         onBlur={handleInputChange}/>
                    </Description>
                    <ConfirmDialog visible={visi}
                                   onHide={() => setVisi(false)}
                                   message=<InputText value={value} onChange={(e) => setValue(e.target.value)}/>
                    header="Potwierdzenie edycji"
                    icon="pi pi-pencil"
                    acceptLabel="Akceptuj"
                    rejectLabel="Odrzuć"
                    accept={acceptEditCard}
                    reject={rejectEditCard}/>
                    <Button style={{marginLeft: "120px", marginBottom: "-47px"}}
                            onClick={() => CommonService.onOpenDialog(setVisi, setValue, props.description)}
                            icon="pi pi-pencil"
                            rounded
                            text
                            aria-label="Cancel"/>
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
                            //size="small"
                            severity="danger"
                            aria-label="Cancel"/>
                </CardStyle>
    )
}

export default Card
