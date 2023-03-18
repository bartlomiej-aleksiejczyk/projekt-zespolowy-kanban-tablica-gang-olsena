import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import styled, {createGlobalStyle} from 'styled-components';
import React, {useState, useEffect, useContext} from 'react';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import Board from "./Board";
import {Button} from 'primereact/button';
import 'primeflex/primeflex.css';
import {ConfirmDialog} from 'primereact/confirmdialog';
import {InputText} from 'primereact/inputtext';
import ApiService from "../services/ApiService";
import CommonService from "../services/CommonService";
import {UserServiceProvider, useUserService} from '../utils/UserServiceContext';
import AuthService from "../services/AuthService";


const GlobalStyle = createGlobalStyle`
  body {
    box-sizing: border-box;
    font-family: Verdana;
    color: #232323;
    background-color: #aec5de;
    scroll-margin-left: 0;
  }
`

const BoardOfBoards = styled.div`
  display: flex;
  margin-left:280px;
  margin-top: -160px;
  justify-content: space-around;
  position: absolute;
`;
const FreeUsersBoard = styled.div`
  display: flex;
  margin-left:280px;
  justify-content: space-around;
`;
const Header = styled.h1`
  text-shadow: 3px 3px #4f46e5;
  margin-left: 35px;
  margin-top: 35px;
  font-size: 350%;
  text-transform: uppercase;
  padding: 5px;
  color: #ffffff;
`;
const WholeWebpage = styled.div`
`;

function Kanban() {
    const [boards, setBoards] = useState([]);
    const apiService = useUserService();
    let {user, logoutUser} = useContext(AuthService);
    useEffect(() => {
        apiService.getBoards().then((response_data) => {
            setBoards(response_data.data)
        });
    }, [apiService]);

    async function onDragEnd(result) {
        const {destination, source, draggableId} = result;
        const draggableIde = draggableId.slice(0, -1)
        if(!destination) return;
        if(destination.droppableId === source.droppableId && destination.index === source.index) return;
        if(result.type === "board") {
            let board = {...boards[(source.index)]};
            boards.splice(source.index, 1);
            boards.splice(destination.index, 0, board);
            setBoards(boards);
            await apiService.moveBoard(draggableIde, destination.index).then((response_data) => {
                CommonService.toastCallback(response_data, setBoards)
            });
            ;
        } else if(result.type === "card") {
            let boardIndex = parseInt(((destination.droppableId)).slice(-1));
            let rowIndex = parseInt((destination.droppableId).slice(0, -1))
            let board = boards[boardIndex];
            let row = (board.row_data)[rowIndex];
            let cards = row.card_data;
            let boardIndexSource = parseInt(((source.droppableId)).slice(-1));
            let rowIndexSource = parseInt((source.droppableId).slice(0, -1))
            let source_card = {...boards[boardIndexSource].row_data[rowIndexSource].card_data[source.index]};
            let destination_card = {...boards[boardIndex]};
            boards[boardIndexSource].row_data[rowIndexSource].card_data.splice(source.index, 1);
            boards[boardIndex].row_data[rowIndex].card_data.splice(destination.index, 0, source_card);
            boards[boardIndex].row_data[rowIndex].card_data[destination.index].board = destination_card.id;
            setBoards(boards);


            if(cards.length - 1 < destination.index) {
                await apiService.moveCard(draggableIde, cards.length, board.id, row.id).then((response_data) => {
                    CommonService.toastCallback(response_data, setBoards)
                });
            } else {
                await apiService.moveCard(draggableIde, destination.index, board.id, row.id).then((response_data) => {
                    CommonService.toastCallback(response_data, setBoards)
                });
            }
        }
    }

    const acceptAddBoard = () => {
        apiService.newBoard(value).then((response_data) => {
            CommonService.toastCallback(response_data, setBoards);
            setValue('');
        });
    }
    const acceptLogout = () => {
        logoutUser();
            setValue('');
        }
    const rejectAddBoard = () => {
        setValue('');
    }
    const acceptAddRow = () => {
        apiService.newRow(value1).then((response_data) => {
            CommonService.toastCallback(response_data, setBoards);
            setValue('');
        });
    }
    const rejectAddRow = () => {
        setValue('');
    }
    const [visible, setVisible] = useState(false);
    const [value, setValue] = useState('');
    const [visible1, setVisible1] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [value1, setValue1] = useState('');
    const [value2, setValue2] = useState('');
    return (
        <UserServiceProvider>
            <WholeWebpage>
                <Header>Kanban Board</Header>
                <div style={{
                    position: "absolute",
                    top     : "40px",
                    right   : "0",
                    zIndex  : "1"
                }}>
                    <ConfirmDialog visible={visible2}
                                   onHide={() => setVisible2(false)}
                                   message={`Czy na pewno chcesz wylogować się z konta: ${user.username}?`}
                                   header="Potwierdzenie usunięcia"
                                   icon="pi pi-sign-out"
                                   acceptLabel="Tak"
                                   rejectLabel="Nie"
                                   accept={acceptLogout}
                                   reject={() => {}}/>
                    <ConfirmDialog
                        visible={visible}
                        onHide={() => setVisible(false)}
                        message={<InputText value={value} onChange={(e) => setValue(e.target.value)}/>}
                        header="Wpisz nazwe kolumny:"
                        icon="pi pi-table"
                        acceptLabel="Akceptuj"
                        rejectLabel="Odrzuć"
                        accept={acceptAddBoard}
                        reject={rejectAddBoard}
                    />
                    <ConfirmDialog
                        visible={visible1}
                        onHide={() => setVisible1(false)}
                        message={<InputText value1={value} onChange={(e) => setValue1(e.target.value)}/>}
                        header="Wpisz nazwe rzędu:"
                        icon="pi pi-table"
                        acceptLabel="Akceptuj"
                        rejectLabel="Odrzuć"
                        accept={acceptAddRow}
                        reject={rejectAddRow}
                    />
                    <div className="inline mr-3">
                        <Button style={{
                            boxShadow: "0px 1px 7px rgba(0, 0, 0, 0.1), 0px 4px 5px -2px rgba(0, 0, 0, 0.12), 0px 10px 15px -5px rgba(0, 0, 0, 0.2)"
                        }}
                                size="lg"
                                onClick={() => CommonService.onOpenDialog(setVisible1, [{callback: setValue1, value: ''}])}
                                label="Nowy rząd"
                                icon="pi pi-plus"/>
                    </div>
                    <div className="inline mr-3">
                        <Button style={{
                            boxShadow: "0px 1px 7px rgba(0, 0, 0, 0.1), 0px 4px 5px -2px rgba(0, 0, 0, 0.12), 0px 10px 15px -5px rgba(0, 0, 0, 0.2)"
                        }}
                                size="lg"
                                onClick={() => CommonService.onOpenDialog(setVisible, [{callback: setValue, value: ''}])}
                                label="Nowa kolumna"
                                icon="pi pi-plus"/>
                    </div>
                    <div className="inline mr-3">

                        <Button style={{
                            boxShadow: "0px 1px 7px rgba(0, 0, 0, 0.1), 0px 4px 5px -2px rgba(0, 0, 0, 0.12), 0px 10px 15px -5px rgba(0, 0, 0, 0.2)",}}
                                size="lg"
                                onClick={() => CommonService.onOpenDialog(setVisible2, [{callback: setValue2, value: ''}])}
                                //label={`${user.username} | Wyloguj się`}
                                label={`Wyloguj się`}
                                icon="pi pi-sign-out"/>
                    </div>


                </div>
                <GlobalStyle whiteColor/>
                <DragDropContext
                    onDragEnd={onDragEnd}>
                    <Droppable
                        key="unikalnyKlucz1"
                        droppableId="all-columns"
                        direction="horizontal"
                        type="board"
                        disabledDroppable={true}
                    >
                        {provided => (
                            <BoardOfBoards
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {boards.map((board, index) => {
                                    return <Board key={board.id}
                                                  backId={board.id}
                                                  dragId={(board.id).toString() + "b"}
                                                  column={board}
                                                  rows={board.row_data}
                                                  boards={boards}
                                                  board={board}
                                                  name={board.name}
                                                  limit={board.max_card}
                                                  is_static={board.is_static}
                                                  setBoards={setBoards}
                                                  index={index}/>
                                })}
                                {provided.placeholder}
                            </BoardOfBoards>
                        )}
                    </Droppable>
                    <FreeUsersBoard>
                        test
                    </FreeUsersBoard>
                </DragDropContext>
            </WholeWebpage>
        </UserServiceProvider>
    )
}

export default Kanban