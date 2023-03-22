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
import {ToggleButton} from 'primereact/togglebutton';
import { Badge } from 'primereact/badge';
import { Checkbox } from 'primereact/checkbox';

const CardStyle = styled.div`
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.03), 0px 0px 2px rgba(0, 0, 0, 0.06), 0px 2px 6px rgba(0, 0, 0, 0.12);
  max-width: 228px;
  min-width: 228px;
  border: ${props => props.locked ? "2px solid #b7b3ea":"2px solid #b7b3ea"};
  border-radius: 6px;
  padding: 4px;
  margin-top: 3px;
  margin-left: 5px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  -webkit-filter: ${props => props.locked ? "grayscale(0.7)":""} ;
  //Ta metoda to druciarstwo o wiele lepiej jest tuaj https://stackoverflow.com/questions/61635321/props-conditional-rendering-using-styled-components
  background-color: ${props => props.color};
  background: repeating-linear-gradient(
          315deg,
        ${props =>props.color},
        ${props =>`${props.color} 10px`},
        ${props =>props.locked? "#D4D6D7 10px": `${props.color} 10px`},
        ${props =>props.locked? "#D4D6D7 20px":`${props.color} 20px`}
);
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
    const [visible2, setVisible2] = useState(false);
    const [visible1, setVisible1] = useState(false);
    const [visible, setVisible] = useState(false);
    const [value, setValue] = useState('');
    const [value1, setValue1] = useState(props.color);
    const [lock, setLock] = useState(props.locked);
    const options = [
        { value: '#FFFFFF', style: {backgroundColor:`#FFFFFF`} },
        { value: '#86e95e', style: {backgroundColor:`#86e95e`}},
        { value: '#99B3E6', style: {backgroundColor:`#99B3E6`}},
        { value: '#FFE680', style: {backgroundColor:`#FFE680`}},
        { value: '#F2B580', style: {backgroundColor:`#F2B580`}},
    ];
    const options1 = [
        { value: false, icon: 'pi pi-lock-open' },
        { value: true, icon: 'pi pi-lock' },
    ];
    const [editSelectedUser, setEditSelectedUser] = useState(props.data?.user_data);
    const apiService = useUserService();
    const handleLock = (value) => {
        setLock(value)
        apiService.updateCard(props.board, {
            "id"         : props.backId,
            "is_locked": value
        }).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards);
        },
        () =>{setLock(props.locked)}
    );


    }
    const handleUnlock = (e) => {
        setLock(e.value)
        apiService.updateCard(props.board, {
            "id"         : props.backId,
            "is_locked": false
        }).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards)
        });
    }
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
            apiService.updateCard(props.board, {
                "id"         : props.backId,
                "description": value,
                "user"       : "",
                "color"      : value1
            }).then((response_data) => {
                CommonService.toastCallback(response_data, props.setBoards,props.setRemaining);
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
    const acceptAssignEdit = () => {
            apiService.updateCard(props.board, {
                "id"         : props.backId,
                "user"       : "",
            }).then((response_data) => {
                CommonService.toastCallback(response_data, props.setBoards,props.setRemaining);
            });
    }
    const rejectAssignEdit = () => {
        setVisible2(false);
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
                    <ToggleButton onLabel="Blokada"
                                  offLabel="Brak blokady"
                                  onIcon="pi pi-lock"
                                  offIcon="pi pi-lock-open"
                                  checked={lock}
                                  onChange= {(e) => handleLock(e.value)}
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
            isDragDisabled={props.locked}
            index={props.indexDrag}>
            {(provided) => (
                <CardStyle{...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          color={props.color}
                          locked={props.locked}
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

                        <MultiStateCheckbox
                            icon="pi pi-lock"
                                  value={lock}
                                  empty={false}
                                  options={options1}
                                  onChange= {e => handleLock(e.value)}
                                  optionValue="value"
                        />
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
                        <ConfirmDialog visible={visible2}
                                       onHide={() => setVisible2(false)}
                                       message="Czy na pewno chcesz przypisanie użytkownika?"
                                       header="Potwierdzenie usunięcia"
                                       icon="pi pi-trash"
                                       acceptLabel="Tak"
                                       rejectLabel="Nie"
                                       accept={acceptAssignEdit}
                                       reject={rejectAssignEdit}/>
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
                        //     <AvatarImage src={props.data.user_data.avatar}/>
                            <Avatar className="p-overlay-badge" image={props.data.user_data.avatar} size="xlarge" shape="circle" style = {{width: "40px", height: "40px"}}>
                                <Badge value="X"  style = {{scale:"0.9", textAlign:"center"}} onClick={() => (setVisible2(true))} />
                            </Avatar>
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
