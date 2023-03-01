import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import styled from 'styled-components';
import React, {useState, useEffect} from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Board from "./Board";

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
    function onDragEnd(result) {
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
  }


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

  return (
      <DragDropContext onDragEnd={onDragEnd}>
{/*
          <Droppable droppableId="all-columns" direction="horizontal" type="column">
*/}
       <BoardOfBoards>
        {boards.map(board => {
            console.log(board)
          //const tasks = column.taskIds.map(taskId => this.state.tasks[taskId]);

          return <Board backId={board.id} dragId={(boards.indexOf(board)).toString()} droppableId={boards.indexOf(board)} column={board} cards={board.card_data} name={board.name} limit={board.max_card} fetchDb={fetchDb} />;
        })}
        </BoardOfBoards>
          {/*</Droppable>*/}
      </DragDropContext>/*
      boards.map((board) => {
        console.log(boards);
        return (<div className="card xl:flex xl:justify-content-center">
          <OrderList value={boards}
                     onChange={(e) => setBoards(e.value)}
                     itemTemplate={itemTemplate}
                     dragdrop={true}
                     header={board.name}></OrderList>
        </div>)
        }
      )*/
  )
}

export default App;
