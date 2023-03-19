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
import { MultiStateCheckbox } from 'primereact/multistatecheckbox';

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

function UserAvatar(props) {

    return (
            <Draggable draggableId={props.dragId}
                       index={props.index}>
                {(provided) =>(
                <AvatarContainer{...provided.dragHandleProps}
                                {...provided.draggableProps}
                                ref={provided.innerRef}
                >
                    <AvatarImage src={props.img} />
                </AvatarContainer>
                )}
            </Draggable>
            )
}

export default UserAvatar
