import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import styled from 'styled-components';
import React, {useState, useEffect} from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Board from "./Board";
const NewBoardButton = styled.div`
  align-items: center;
  text-align: center;
`;
//Przerobić
const BoardOfBoards = styled.div`
  display: flex;
`;
function App() {

    const [boards, setBoards] = useState([]);

    function moveCard(pk, index, board) {
        console.log(JSON.stringify({"index":index}))
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
    function onDragStart(result) {
        console.log(result.draggableId)
    }
    function onDragUpdate(result) {
        const {destination, source, draggableId}=result
        //console.log("resuult",(((boards[parseInt(destination.droppableId)]).card_data)[destination.index]).index)
        //console.log("tutaj",parseInt(source.droppableId),(draggableId),parseInt(destination.droppableId)/*((boards[parseInt(destination.droppableId)]).card_data)[parseInt(destination.droppableIndex)]*/ );
        if (!destination) {return;}
        else if (destination.droppableId === source.droppableId && destination.index === source.index) {return;}
        else if ((boards[parseInt(destination.droppableId)].card_data.length - 1 < destination.index)){
            moveCard(parseInt(draggableId),(((boards[parseInt(destination.droppableId)]).card_data).length), (boards[parseInt(destination.droppableId)]).id)
        }
        else{
            moveCard(parseInt(draggableId),(((boards[parseInt(destination.droppableId)]).card_data)[destination.index]).index, (boards[parseInt(destination.droppableId)]).id)
            //moveCard(parseInt(draggableId),(((boards[parseInt(destination.droppableId)]).card_data)[destination.index]).index)
        }
    console.log(result);
        console.log(result.draggableId)

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
    <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
{/*
          <Droppable droppableId="all-columns" direction="horizontal" type="column">
*/}
        <NewBoardButton><button onClick={() => newBoard()} type="button">Add board</button></NewBoardButton>
        <BoardOfBoards>
        {boards.map(board => {
            console.log(board)
          //const tasks = column.taskIds.map(taskId => this.state.tasks[taskId]);

          return <Board backId={board.id} dragId={(boards.indexOf(board)).toString()} droppableId={boards.indexOf(board)} column={board} cards={board.card_data} name={board.name} limit={board.max_card} fetchDb={fetchDb} />;
        })}
        </BoardOfBoards>
      </DragDropContext>
  )
}

export default App;
