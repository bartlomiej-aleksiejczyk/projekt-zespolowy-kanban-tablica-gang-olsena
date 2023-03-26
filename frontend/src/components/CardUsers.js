import React, {useState, useEffect} from 'react'
import styled from "styled-components";
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
import {Badge} from 'primereact/badge';


const AvatarContainer = styled.div`
  flex-direction: column;
  word-wrap: break-word;
  flex-wrap: wrap;
  padding-left: 8px;
  padding-right:8px;
`;
const AvatarImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;
//To już jest hiper druciarstwo
function UserAvatar(props) {
    const [visible2, setVisible2] = useState(false);
    const apiService = useUserService();
    const rejectAssignEdit = () => {
        setVisible2(false);
    }
    const acceptAssignEdit = () => {
        let data=props.allUsers
        data.splice(data.indexOf(props.id),1)
        apiService.updateCard(props.board, {
            "id"  : props.cardId,
            "users": data,
        }).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards, props.setRemaining);
        });
    }
    return (

                <AvatarContainer>
                    <ConfirmDialog visible={visible2}
                                   onHide={() => setVisible2(false)}
                                   message="Czy na pewno chcesz przypisanie użytkownika?"
                                   header="Potwierdzenie usunięcia"
                                   icon="pi pi-trash"
                                   acceptLabel="Tak"
                                   rejectLabel="Nie"
                                   accept={acceptAssignEdit}
                                   reject={rejectAssignEdit}/>
                    <Avatar className="p-overlay-badge user-avatar"
                            label={props.username}
                            image={props.img}
                            size="xlarge" shape="circle" style={{width: "40px", height: "40px"}}>
                        <Badge value="X" style={{scale: "0.9", textAlign: "center"}}
                               onClick={() => (setVisible2(true))}/>
                    </Avatar>
                </AvatarContainer>
    )
}

export default UserAvatar