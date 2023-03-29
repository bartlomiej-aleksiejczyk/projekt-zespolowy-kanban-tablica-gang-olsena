import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import styled, {createGlobalStyle} from 'styled-components';
import React, {useState, useEffect, useContext, useRef } from 'react';
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
import { Avatar } from 'primereact/avatar';
import { Dialog } from 'primereact/dialog';
import {InputNumber} from 'primereact/inputnumber';
import Card from "./Card";
import UserAvatar from "./UserAvatar";
import { FileUpload } from 'primereact/fileupload';


const GlobalStyle = createGlobalStyle`
  body {
    box-sizing: border-box;
    font-family: Verdana;
    color: #232323;
    background-color: #aec5de;
    scroll-margin-left: 0;
  }
`
const AssignmentLimitText = styled.h3`
  text-align: center;
  padding: 15px;
  margin-top: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: center;
`;
const UserAssignArea = styled.div`
  display: flex;
  padding: 10px;
  justify-content: center;
  flex-wrap: wrap;
`;
const BoardOfBoards = styled.div`
  display: flex;
  margin-left:481px;
  margin-top: -160px;
  justify-content: space-around;
  position: absolute;
`;
const FreeUsersBoard = styled.div`
  position: relative;
  margin-top: 170px;
  margin-left: 25px;
  width:200px;
  top: 100%;
  box-sizing: border-box;
  background-color: white;
  border-radius: 6px;

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
const AvatarMenu = styled.div`
  display: flex;
  text-align: center;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;
const EditUserMenu = styled.div`
  display: block;
  text-align: center;
`;
const EditUserText = styled.h3`
  text-align: center;
  margin-bottom: 40px;
`;
const UploadContainer = styled.h3`
  text-align: center;
  margin-top: 40px;
`;

const WholeWebpage = styled.div`
`;
const emptyTemplate = () => {
    return (
        <div className="flex align-items-center flex-column">
            <i className="pi pi-image mt-3 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
            <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
                    Przeciągnij plik tutaj
                </span>
        </div>
    );
};

function Kanban() {
    const [boards, setBoards] = useState([]);
    const apiService = useUserService();
    let {user, logoutUser} = useContext(AuthService);
    const [userLogged, setUserLogged] = useState('');
    const [visible, setVisible] = useState(false);
    const [value, setValue] = useState('');
    const [visible1, setVisible1] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [visible3, setVisible3] = useState(false);
    const [visible4, setVisible4] = useState(false);
    const [value1, setValue1] = useState('');
    const [value2, setValue2] = useState('');
    const [value3, setValue3] = useState('');
    const [value4, setValue4] = useState('');
    const [users, setUsers] = useState('');
    const [remaining, setRemaining] = useState([]);
    const [cardsChoice, setCardsChoice] = useState([]);

    // const renderFooter = (visible4) => {
    //     return (
    //         <div>
    //             <Button label="Odrzuć" icon="pi pi-times" onClick={() =>rejectUserEdit()} autoFocus />
    //             <Button label="Zatwierdź" icon="pi pi-check" onClick={() =>acceptUserEdit()} autoFocus />
    //         </div>
    //     );
    // }
    const footerContent = (
        <div>
            <Button label="Odrzuć" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
            <Button label="Akceptuj" icon="pi pi-check" onClick={() => setVisible(false)} autoFocus />
        </div>
    );
    const handleInputChangeLimit = (e) => {
        if(e.value!==null){
            setValue4(e.value);
            console.log(e.value)
            apiService.updateParameter( 1,{"value": e.value}).then((response_data) => {
                CommonService.toastCallback(response_data, setValue4(response_data.data.value),setRemaining)
            });
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
    const acceptUserEdit = () => {
        apiService.updateUser(user.id, {"avatar":value3}).then((response_data) => {
            CommonService.toastCallback(response_data, setBoards,setUsers,setUserLogged, setRemaining)
            setValue('');
        });
        setVisible3(false)
    }
    const rejectUserEdit = () => {
        setVisible3(false);
        setValue('');
    }

    useEffect(() => {
        apiService.getUser(user.id).then(function(response_data) {
            setUserLogged(response_data.data);
        });
    }, []);
    useEffect(() => {
        apiService.getParameter(1).then(function(response_data) {
            setValue4(response_data.data.value);
        });
    }, []);
    useEffect(() => {
        apiService.getBoards().then((response_data) => {
            setBoards(response_data.data)
            setCardsChoice(response_data.data1)

        });
    }, [apiService]);
    useEffect(() => {
        apiService.getUsers().then(function(response_data) {
            setUsers(response_data.data);
        });
    }, []);
    useEffect(() => {
        apiService.getRemaining().then(function(response_data) {
            setRemaining(response_data.data);
        });
    }, []);

    function onUpload() {
        apiService.getBoards().then((response_data) => {
            CommonService.toastCallback(response_data, setBoards);
        });
        apiService.getUsers().then((response_data) => {
            CommonService.toastCallback(response_data, setUsers);
        });
        apiService.getUser(userLogged.id).then((response_data) => {
            CommonService.toastCallback(response_data, setUserLogged);
        });
        apiService.getRemaining().then((response_data) => {
            CommonService.toastCallback(response_data, setRemaining);
        });
        {
            window.PrimeToast.show({
                severity: 'success',
                summary : 'Powodzenie',
                detail  : 'Awatar pomyślnie zmieniony',
                life    : 3000
            });
        }

    }

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
        }else if(result.type === "avatar") {
            if (destination.droppableId === "wholeofthese") {
                return
            }
            else {
                let cardAvatarid = parseInt(((destination.droppableId)).slice(0, -2) );
                let userId= (remaining[(source.index)]).id;
                remaining.splice((source.index),1);

                setRemaining(remaining);
                apiService.appendUserCard(cardAvatarid, {
                    "users"       : userId
                }).then((response_data) => {
                    CommonService.toastCallback(response_data, setBoards, setRemaining);
                });

        }}
    }
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
                                   header="Potwierdzenie wylogowania"
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
                    <Dialog header="Edycja danych użytkownika" visible={visible3}  /*footer={renderFooter('displayBasic')}*/ onHide={() => setVisible3(false)}>
                        <EditUserMenu>
                            <EditUserText>
                                Awatar użytkownika:
                            </EditUserText>
                            <AvatarMenu>
                                <Avatar  image={userLogged.avatar} size="xlarge" shape="circle" className="flex justify-content-center"/>
                            </AvatarMenu>
                            <UploadContainer>
                            <FileUpload name="avatar"
                                        url={`http://localhost:8000/api/user/${user.id}/image/`}
                                        maxFileSize={1000000}
                                        accept={"image/*"}
                                        key={Date.now()}
                                        onUpload={onUpload}
                                        cancelLabel={"Anuluj"}
                                        uploadLabel={"Prześlij plik"}
                                        chooseLabel={"Wybierz plik"}
                                        emptyTemplate={emptyTemplate}
                                        invalidFileSizeMessageDetail={"Maksymalny rozmiar pliku wynosi 1MB"}
                                        invalidFileSizeMessageSummary={"Nieprawidłowy rozmiar pliku. "}
                                        mode={"advanced"}
                            />
                            </UploadContainer>
                            {/*<InputText style={{marginTop:"10px"}} id="awatar" type="text" placeholder="Wprowadź link do obrazka" onChange={(e) => setValue3(e.target.value)} className="w-full mb-3" />*/}
                        </EditUserMenu>
                    </Dialog>
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
                    <div className="inline mr-3">

                        <Button style={{
                            boxShadow: "0px 1px 7px rgba(0, 0, 0, 0.1), 0px 4px 5px -2px rgba(0, 0, 0, 0.12), 0px 10px 15px -5px rgba(0, 0, 0, 0.2)",}}
                                size="lg"
                                onClick={() => CommonService.onOpenDialog(setVisible3, [{callback: setValue3, value: ''}])}
                                aria-haspopup
                                aria-controls="overlay_panel"
                            // onClick={() => CommonService.onOpenDialog(setVisible3, [{callback: setValue3, value: ''}])}
                            //label={`${user.username} | Wyloguj się`}
                                label={`Zmień dane użytkownika`}
                                icon="pi pi pi-user"/>
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
                                                  setRemaining={setRemaining}
                                                  index={index}
                                                  users={users}
                                                  cardsChoice={cardsChoice}
                                                  setCardsChoice={setCardsChoice}
                                                   />
                                })}
                                {provided.placeholder}
                            </BoardOfBoards>
                        )}
                    </Droppable>
                    <FreeUsersBoard>
                        <AssignmentLimitText>
                            Limit przypisań:
                        </AssignmentLimitText>

                        <InputContainer
                        >
                            <InputNumber inputId="minmax-buttons" value={value4}
                                                onValueChange={(e) => handleInputChangeLimit(e)}
                                                mode="decimal"
                                                showButtons min={1}
                                                max={100}
                                                size="1"
                                                buttonLayout={"horizontal"}
                                                incrementButtonIcon="pi pi-plus"
                                                decrementButtonIcon="pi pi-minus"
                                                allowEmpty={false}
                                                inputStyle={{textAlign:"center"}}
                            />
                        </InputContainer>
                        <Droppable
                            key="unikalnyKlucz2"
                            droppableId="wholeofthese"
                            direction="vertical"
                            type="avatar"
                            disabledDroppable={true}
                        >
                            {provided => (
                        <UserAssignArea
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                >
                            {remaining.map((avatar, indexDrag) =>
                                <UserAvatar index={indexDrag}
                                            key={indexDrag}
                                            id={avatar.id}
                                            dragId={(indexDrag).toString() + "a"}
                                            username={avatar.username}
                                            img={avatar.avatar} />
                            )}
                            {provided.placeholder}

                        </UserAssignArea>
                                )}
                        </Droppable>
                    </FreeUsersBoard>
                </DragDropContext>
            </WholeWebpage>
        </UserServiceProvider>
    )
}

export default Kanban