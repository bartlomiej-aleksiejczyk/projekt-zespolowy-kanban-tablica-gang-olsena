import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Column from "./Column";
const Container = styled.div`
  display: flex;
`;
function Board(props) {
    const [board, setBoard] = useState([]);
    useEffect(() => {
        fetchBoard().then(data => setBoard(data));
    }, []);

async function fetchBoard(){
    const response = await fetch('http://localhost:8000/api/board/');
    const data = await response.json();
    console.log(data);
    return data.data;
}

return(
    <Container>
    {
    board.map((data,id) =>{
        const column = data.name
        const tasks = data.card_data
        return <Column key={id} column={column} tasks={tasks}/>
        console.log(tasks)
    })
    }
    </Container>
)
}
export default Board;