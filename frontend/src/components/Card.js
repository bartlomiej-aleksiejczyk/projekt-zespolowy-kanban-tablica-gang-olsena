import React, {useState, useEffect} from 'react'
import styled from "styled-components";
import {Draggable, Droppable} from "react-beautiful-dnd";
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
import { MultiStateCheckbox } from 'primereact/multistatecheckbox';


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
  background-color: ${props => props.color};
`;

const Description = styled.div`
  flex-direction: column;
  max-width: 220px;
  min-width: 220px;
  word-wrap: break-word;
  flex-wrap: wrap;
  padding-left: 8px;
  padding-right:8px;
`;
const UserChoiceBar = styled.div`
  display: flex;
  flex-direction: row;
  word-wrap: break-word;
`;
const AvatarImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;
const DroppableDiv=styled.div`
`;
function Card(props) {
    const [visible1, setVisible1] = useState(false);
    const [visible, setVisible] = useState(false);
    const [value, setValue] = useState('');
    const [value1, setValue1] = useState(props.color);
    const options = [
        { value: '#FFFFFF', style: {backgroundColor:`#FFFFFF`} },
        { value: '#B2F199', style: {backgroundColor:`#B2F199`}},
        { value: '#99B3E6', style: {backgroundColor:`#99B3E6`}},
        { value: '#FFE680', style: {backgroundColor:`#FFE680`}},
        { value: '#F2B580', style: {backgroundColor:`#F2B580`}},
    ];
    const [editSelectedUser, setEditSelectedUser] = useState(props.data?.user_data);
    const apiService = useUserService();
    const handleInputChange = (e) => {
        apiService.updateCard(props.board, {
            "id"         : props.backId,
            "description": e.target.innerHTML
        }).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards)
        });
    }
    const accept = () => {
        apiService.removeCard((props.backId)).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards, props.setRemaining)
        });
    }

    const reject = () => {
    }
    const acceptEditCard = () => {
        if (editSelectedUser==null){
            console.log("test")
            apiService.updateCard(props.board, {
                "id"         : props.backId,
                "description": value,
                "user"       : "",
                "color"      : value1
            }).then((response_data) => {
                CommonService.toastCallback(response_data, props.setBoards);
            });
        }else{
            apiService.updateCard(props.board, {
                "id"         : props.backId,
                "description": value,
                "user"       : editSelectedUser.id,
                "color"      : value1
            }).then((response_data) => {
                CommonService.toastCallback(response_data, props.setBoards,props.setRemaining);
            });
        }

    }

    const rejectEditCard = () => {
        setValue('');
    }

    const editCardDialog = () => {
        //let usersCp=users.unshift(null)
        return (
            <div>
                <div>
                    <InputText className="w-full" value={value} onChange={(e) => setValue(e.target.value)}/>
                </div>
                <div className="card flex flex-row align-items-center gap-3 pt-3 pb-3 pl-2">
                    <MultiStateCheckbox value={value1} onChange={(e) => setValue1(e.value)} options={options} optionValue="value" empty={false} />
                    <span>{value1}</span>
                </div>
                <UserChoiceBar>
                <Button
                    style={{ marginRight:"3px"}}
                    onClick={() => setEditSelectedUser(null)}
                    icon="pi pi-times"
                    rounded
                    text
                    size="small"
                    severity="danger"
                    aria-label="Cancel"/>
                    <Dropdown className=" w-full" value={(editSelectedUser)}
                              onChange={(e) => setEditSelectedUser(e.value)} options={(props.users)}
                              optionLabel="username"
                              placeholder="Wybierz użytkownika"
                    />
                </UserChoiceBar>
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
                          ref={provided.innerRef}

                            color={props.color}
                            onDoubleClick={()=> console.log(props.data.user_data)}>
                    <Droppable
                        droppableId={props.dropId}
                        direction="horizontal"
                        type="avatar">
                        {(provided) => (
                            <DroppableDiv
                                {...provided.droppableId}
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
                    <div className="flex flex-column md:flex-row justify-content-end align-content-center flex-wrap px-2">
                        <ConfirmDialog visible={visible1}
                                       onHide={() => setVisible1(false)}
                                       message={editCardDialog}
                                       header="Potwierdzenie edycji"
                                       // icon="pi pi-pencil"
                                       acceptLabel="Akceptuj"
                                       rejectLabel="Odrzuć"
                                       accept={acceptEditCard}
                                       reject={rejectEditCard}/>
                        <Button onClick={() => CommonService.onOpenDialog(setVisible1, [{callback: setValue, value: props.description}, {callback: setEditSelectedUser, value: props.data?.user_data}])}
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
                        <Button onClick={() => (setVisible(true))}
                                icon="pi pi-times"
                                rounded
                                text
                            //size="small"
                                severity="danger"
                                aria-label="Cancel"/>

                        {props.data.user_data &&

                        // <div>
                        //     <Tooltip target=".user-avatar"/>
                        //     <Avatar className="mt-2 user-avatar"
                        //             label={userLabel}
                        //             data-pr-tooltip={props.data.user_data.username}
                        //             style={{backgroundColor: stc(props.data.user_data.username), color: 'white'}}/>
                        // </div>
                            <AvatarImage src={props.data.user_data.avatar}/>
                            }
                    </div>
                                {provided.placeholder}
                            </DroppableDiv>
                        )}
                    </Droppable>
                </CardStyle>
                )}
        </Draggable>

    )
}

export default Card
