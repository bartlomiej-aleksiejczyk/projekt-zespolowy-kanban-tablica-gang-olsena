import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import React, {useState, useEffect} from 'react';
import { OrderList } from 'primereact/orderlist';
import "./assets/App.css";

function App() {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/board/', {method: 'GET'})
      .then(response => response.json())
      .then(response_data => setBoards(response_data.data));
  }, []);

  const itemTemplate = (item) => {
    return (
      <div className="flex flex-wrap p-2 align-items-center gap-3">
        <div className="flex-1 flex flex-column gap-2 xl:mr-8">
          <span className="font-bold">{item.name}</span>
        </div>
      </div>
    );
  };

  return (
      boards.map((board) => {
        return (<div className="card xl:flex xl:justify-content-center">
          <OrderList value={boards}
                     onChange={(e) => setBoards(e.value)}
                     itemTemplate={itemTemplate}
                     dragdrop={true}
                     header={board.name}></OrderList>
        </div>)
      })
  )
}

export default App;
