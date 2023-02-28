import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import React, {useState, useEffect} from 'react';
import { OrderList } from 'primereact/orderlist';
import "./assets/App.css";
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import initialData from './initial-data';
import Board from './components/Board';
function App() {
    return(
        <div>
        <Board/>
        </div>
    )
}

export default App;
