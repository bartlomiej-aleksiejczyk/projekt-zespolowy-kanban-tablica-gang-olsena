import React, {useState, useEffect} from 'react'
import styled from "styled-components";
import {Draggable} from "react-beautiful-dnd";
import ContentEditable from 'react-contenteditable';
import 'primeicons/primeicons.css';
import {Button} from 'primereact/button';
import {ConfirmDialog} from 'primereact/confirmdialog';
import {InputText} from 'primereact/inputtext';
import ApiService from "../services/ApiService";
import {Avatar} from 'primereact/avatar';
import CommonService from "../services/CommonService";
import {useUserService} from "../utils/UserServiceContext";
import {Dropdown} from 'primereact/dropdown';
import {Tooltip} from 'primereact/tooltip';
import stc from 'string-to-color';


const CardStyle = styled.div`
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.03), 0px 0px 2px rgba(0, 0, 0, 0.06), 0px 2px 6px rgba(0, 0, 0, 0.12);
  max-width: 228px;
  min-width: 228px;
  border: 2px solid #b7b3ea;
  border-radius: 6px;
  padding: 4px;
  margin-top: 3px;
  margin-left: 5px;
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
    const [visi, setVisi] = useState(false);
    const [visible, setVisible] = useState(false);
    const [value, setValue] = useState('');
    const [editSelectedUser, setEditSelectedUser] = useState(props.data?.user_data);
    const [users, setUsers] = useState('');


    const apiService = useUserService();

    const handleInputChange = (e) => {
        apiService.updateCard(props.board, {
            "id"         : props.backId,
            "description": e.target.innerHTML
        }).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards)
        });
    }

    useEffect(() => {
        apiService.getUsers().then(function(response_data) {
            setUsers(response_data.data);
        });
    }, []);

    const accept = () => {
        apiService.removeCard((props.backId)).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards)
        });
    }

    const reject = () => {
    }
    const acceptEditCard = () => {
        apiService.updateCard(props.board, {
            "id"         : props.backId,
            "description": value,
            "user"       : editSelectedUser.id
        }).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards);
        });
    }

    const rejectEditCard = () => {
        setValue('');
    }

    const editCardDialog = () => {
        return (<div>
                <div>
                    <InputText className="w-full" value={value} onChange={(e) => setValue(e.target.value)}/>
                </div>
                <Dropdown className="mt-3 w-full" value={editSelectedUser}
                          onChange={(e) => setEditSelectedUser(e.value)} options={users}
                          optionLabel="username"
                          placeholder="Wybierz użytkownika"/>
            </div>
        )
    }

    let userLabel = props.data.user_data?.username.charAt(0).toUpperCase() + props.data.user_data?.username.charAt(props.data.user_data?.username.length - 1).toUpperCase();
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
                        <ContentEditable
                            spellCheck="false"
                            className="Description"
                            html={props.description}
                            disabled={false}
                            onBlur={handleInputChange}/>
                    </Description>
                    <div className="flex flex-column md:flex-row justify-content-end align-content-center flex-wrap">
                        <ConfirmDialog visible={visi}
                                       onHide={() => setVisi(false)}
                                       message={editCardDialog}
                                       header="Potwierdzenie edycji"
                                       icon="pi pi-pencil"
                                       acceptLabel="Akceptuj"
                                       rejectLabel="Odrzuć"
                                       accept={acceptEditCard}
                                       reject={rejectEditCard}/>
                        <Button onClick={() => CommonService.onOpenDialog(setVisi, [{callback: setValue, value: props.description}, {callback: setEditSelectedUser, value: props.data?.user_data}])}
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
                        <Button onClick={() => setVisible(true)}
                                icon="pi pi-times"
                                rounded
                                text
                            //size="small"
                                severity="danger"
                                aria-label="Cancel"/>
                        {props.data.user_data &&
                        <div>
                            <Tooltip target=".user-avatar"/>
                            <Avatar className="mt-2 user-avatar"
                                    label={userLabel}
                                    data-pr-tooltip={props.data.user_data.username}
                                    style={{backgroundColor: stc(props.data.user_data.username), color: 'white'}}/>
                        </div>}
                    </div>
                </CardStyle>
            )}
        </Draggable>
    )
}

export default Card
