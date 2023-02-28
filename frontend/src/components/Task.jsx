import React from "react";
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: white;
`;

function Task(props){

    return(
        <Container>
            {props.task.description}
        </Container>
    )

}
export default Task;