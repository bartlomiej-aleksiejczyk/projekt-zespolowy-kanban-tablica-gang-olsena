import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import styled, {createGlobalStyle} from 'styled-components';
import React, {useState, useEffect} from 'react';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import Board from "./Board";
import {Button} from 'primereact/button';
import 'primeflex/primeflex.css';

const GlobalStyle = createGlobalStyle`

  body {
    box-sizing: border-box;
    font-family: Lato;
    color: #232323;
    background-color: #e55326;
    scroll-margin-left: 0;
  }
`

const BoardOfBoards = styled.div`
  display: flex;
  margin-left:35px;
  justify-content: space-around;
  position: absolute;
`;
const Header = styled.h1`
  text-shadow: 4px 4px #944dce;
  margin-left:35px;
  margin-top: 25px;
  font-size: 350%;
  width: 100%;
  position: fixed;
  text-transform: uppercase;
  padding: 5px;
  color: #ffffff;
`;
const WholeWebpage = styled.div`
`;

function App() {

    const [boards, setBoards] = useState([]);

    function moveCard(pk, index, board) {
        fetch(`http://localhost:8000/api/card/${pk}/move/`,
            {
                method : 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body   : JSON.stringify({"index": index, "board": board}),
            },)
            .then(() => fetchDb());
    }

    function moveBoard(pk, index) {
        fetch(`http://localhost:8000/api/board/${pk}/move/`,
            {
                method : 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body   : JSON.stringify({"index": index}),
            },)
            .then(() => fetchDb());
    }

    function onDragEnd(result) {
        const {destination, source, draggableId} = result;
        const draggableIde=draggableId.slice(0, -1)
        if(!destination) return;
        if(destination.droppableId === source.droppableId && destination.index === source.index) return;

        if(result.type === "board") {
            let board = {...boards[source.index]};
            boards.splice(source.index, 1);
            boards.splice(destination.index, 0, board);
            moveBoard(draggableIde, destination.index);
        } else if(result.type === "card") {
            let board = boards[destination.droppableId];
            let cards = board.card_data;
            let source_card = {...boards[source.droppableId].card_data[source.index]};

            if(cards.length - 1 < destination.index) {
                moveCard(draggableIde, cards.length, board.id);
            } else {
                moveCard(draggableIde, cards[destination.index].index, board.id)
            }

            boards[source.droppableId].card_data.splice(source.index, 1);
            boards[destination.droppableId].card_data.splice(destination.index, 0, source_card);

        }
        setBoards(boards);
    }

    useEffect(() => {
        fetch('http://localhost:8000/api/board/', {
            method: 'GET'
        },)
            .then(response => response.json())
            .then(response_data => setBoards(response_data.data));
    }, []);

    function fetchDb() {
        fetch('http://localhost:8000/api/board/',
            {
                method: 'GET'
            },)
            .then(response => response.json())
            .then(response_data => setBoards(response_data.data));
    }

    function newBoard() {

        fetch(`http://localhost:8000/api/board/`,
            {
                method : 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body   : JSON.stringify({"name": "Your board name"}),
            },)
            .then(() => fetchDb());
    }

    return (

        <WholeWebpage>
            <Header>Kanban Board</Header>
            <Button style={{
                position : "fixed",
                zIndex   : "1",
                top      : "30px",
                right    : "30px",
                boxShadow: "0px 1px 7px rgba(0, 0, 0, 0.1), 0px 4px 5px -2px rgba(0, 0, 0, 0.12), 0px 10px 15px -5px rgba(0, 0, 0, 0.2)"
            }}
                    size="lg"
                    onClick={() => newBoard()}
                    label="New board"
                    icon="pi pi-plus"/>
            <GlobalStyle whiteColor/>
            <DragDropContext
                onDragEnd={onDragEnd}>
                <Droppable
                    key="unikalnyKlucz1"
                    droppableId="all-columns"
                    direction="horizontal"
                    type="board"
                >
                    {provided => (
                        <BoardOfBoards
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {boards.map((board, index) => {
                                return <Board key={board.id}
                                              backId={board.id}
                                              dragId={(board.id).toString()+"b"}
                                              droppableId={(boards.indexOf(board)).toString()}
                                              column={board}
                                              cards={board.card_data}
                                              name={board.name}
                                              limit={board.max_card}
                                              is_static={[0, boards.length - 1].indexOf(index) !== -1}
                                              fetchDb={fetchDb}
                                              index={index}/>
                            })}
                            {provided.placeholder}
                        </BoardOfBoards>
                    )}
                </Droppable>
            </DragDropContext>
        </WholeWebpage>
    )
}

export default App;
