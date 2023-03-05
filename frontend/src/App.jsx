import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import styled, {createGlobalStyle} from 'styled-components';
import React, {useState, useEffect} from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Board from "./Board";
import { Button } from 'primereact/button';
import 'primeflex/primeflex.css';

const GlobalStyle = createGlobalStyle`

  body {
    box-sizing: border-box;
    font-family: Lato;
    color: #232323;
    background-color: #e55326;
    scroll-margin-left: 0;
    //background-color: #f1c743;
    //background-color: DodgerBlue;
    //background-color: #f8fcff;

    //display: flex ;

  }
`

const BoardOfBoards = styled.div`
  display: flex;
  //justify-content: space-around;
  //flex-grow: 1;
  //flex-flow: row nowrap;
  //justify-content: center;
  //align-items: center;
  //position: static;
`;
const Header = styled.h1`
  text-shadow: 4px 4px #944dce;
  margin-top: 30px;
  margin-bottom: -30px;
  font-size: 250%;
  text-align: center;
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
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({"index":index, "board":board}),
            },)
            .then(() => fetchDb());
    }
    function moveBoard(pk, index) {
        console.log(JSON.stringify({"index":index}),"test2",pk, index)
        fetch(`http://localhost:8000/api/board/${pk}/move/`,
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({"index":index}),
            },)
            .then(() => fetchDb());
    }
    function onDragUpdate(result) {
        if (result.type === "board") {
            const {destination, source, draggableId} = result;
            if (!destination) {
                return;
            } else if (destination.droppableId === source.droppableId && destination.index === source.index) {
                return;
            } else {
                console.log("TEST",draggableId,destination.index);
                moveBoard((parseInt(draggableId)),(destination.index));
            }
        }
        else if (result.type === "card") {
            const {destination, source, draggableId} = result
            console.log("resuult",boards)
            //console.log("tutaj",parseInt(source.droppableId),(draggableId),parseInt(destination.droppableId)/*((boards[parseInt(destination.droppableId)]).card_data)[parseInt(destination.droppableIndex)]*/ );
            if (!destination) {return;}
            else if (destination.droppableId === source.droppableId && destination.index === source.index) {return;}
            else if ((boards[parseInt(destination.droppableId)].card_data.length - 1 < destination.index)){
                moveCard(parseInt(draggableId),(((boards[parseInt(destination.droppableId)]).card_data).length), (boards[parseInt(destination.droppableId)]).id)
            }
            else{
                moveCard(parseInt(draggableId),(((boards[parseInt(destination.droppableId)]).card_data)[destination.index]).index, (boards[parseInt(destination.droppableId)]).id)
            }
        }
    }

    function onDragEnd(result) {}
    useEffect(() => {
    fetch('http://localhost:8000/api/board/', {method: 'GET'/*, headers: {"Content-Type": "application/json",},body: JSON.stringify(""),
    */},)
      .then(response => response.json())
      .then(response_data => setBoards(response_data.data));
  }, []);

    function fetchDb() {fetch('http://localhost:8000/api/board/',
        {method: 'GET'/*, headers: {"Content-Type": "application/json",},
        body: JSON.stringify(""),
    */},)
            .then(response => response.json())
            .then(response_data => setBoards(response_data.data));
    }
    function newBoard() {

        fetch(`http://localhost:8000/api/board/`,
            {  method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({"name":"Your board name"}),
            },)
            .then(() => fetchDb());
    }

  return (
      //Naprawiłem bug#1 w ten sposób że żądanie do API zamiast na końcu przenoszenia (onDragEnd) wysyłane są podczas działania (onDragUpdate)
      //jeśli problem będzie występował w przyszłości można wydłużyć animacje,
      //Jedyny efekt uboczny jest taki że biblioteka wysyła w konsoli wiadomości, że nie można usuwac i dodawać elenetów do list podczas przenoszenia
      //Ale zupełnie nie wplywa to na funkcjonowanie
      <WholeWebpage>
          <Header>Kanban Board</Header>
          <Button style={{ position: "fixed",top: "1rem",right:" 1.5rem",  boxShadow: "0px 1px 7px rgba(0, 0, 0, 0.1), 0px 4px 5px -2px rgba(0, 0, 0, 0.12), 0px 10px 15px -5px rgba(0, 0, 0, 0.2)"
          }} size="lg" onClick={() => newBoard()} label="New board" icon="pi pi-plus" />
          <GlobalStyle whiteColor />
          <DragDropContext onDragEnd={onDragUpdate} onDragUpdate={onDragUpdate}>
              {/*<Button style={{ position: 'absolute', left: '50%', transform: 'translate(-50%, -50%)', marginTop: "30px"}} onClick={() => newBoard()} label="Dodaj kartę" icon="pi pi-plus" />*/}
              <Droppable
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
          //const tasks = column.taskIds.map(taskId => this.state.tasks[taskId]);
          return <Board backId={board.id} dragId={(board.id).toString()} droppableId={(boards.indexOf(board)).toString()} column={board} cards={board.card_data} name={board.name} limit={board.max_card} fetchDb={fetchDb} index={index}/>
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
