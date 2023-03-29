import React from 'react'
import styled from "styled-components";
import {Draggable} from "react-beautiful-dnd";
import 'primeicons/primeicons.css';
import {Tooltip} from 'primereact/tooltip';


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
    function getStyle(style, snapshot) {
        if (!snapshot.isDropAnimating) {
            return style;
        }
        const { moveTo, curve, duration } = snapshot.dropAnimation;
        // const translate = `translate(${moveTo.x+162.5}px, ${moveTo.y+20}px)`;
        const translate = `translate(${moveTo.x+90}px, ${moveTo.y+17}px)`;
        const rotate = 'rotate(0.5turn)';
        return {
            ...style,
            transform: `${translate}`,
            transition: `all ${curve} ${duration}s`,
        };
    }
    return (
            <Draggable draggableId={props.dragId}
                       index={props.index}>
                {(provided,snapshot) =>(
                <AvatarContainer{...provided.dragHandleProps}
                                {...provided.draggableProps}
                                ref={provided.innerRef}
                                style={getStyle(provided.draggableProps.style, snapshot)}
                >{props.username}
                    <Tooltip target=".user-avatar"/>
                    <AvatarImage className="user-avatar" src={props.img} data-pr-tooltip={props.username} />
                <div>


                </div>
                </AvatarContainer>
                )}
            </Draggable>
            )
}

export default UserAvatar
