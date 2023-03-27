import React, {useState, useEffect} from 'react'
import styled from "styled-components";
import {Draggable, Droppable} from "react-beautiful-dnd";
import ContentEditable from 'react-contenteditable';
import 'primeicons/primeicons.css';
import {Button} from 'primereact/button';
import {ConfirmDialog} from 'primereact/confirmdialog';
import {InputText} from 'primereact/inputtext';
import {InputTextarea} from 'primereact/inputtextarea';
import ApiService from "../services/ApiService";
import {Avatar} from 'primereact/avatar';
import CommonService from "../services/CommonService";
import {useUserService} from "../utils/UserServiceContext";
import {Dropdown} from 'primereact/dropdown';
import {Tooltip} from 'primereact/tooltip';
import stc from 'string-to-color';
import {MultiStateCheckbox} from 'primereact/multistatecheckbox';
import {ToggleButton} from 'primereact/togglebutton';
import {Badge} from 'primereact/badge';
import {Checkbox} from 'primereact/checkbox';
import {ProgressBar} from 'primereact/progressbar';
import CardUsers from "./CardUsers";
import { v4 as uuidv4 } from 'uuid';

const CardStyle = styled.div`
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.03), 0px 0px 2px rgba(0, 0, 0, 0.06), 0px 2px 6px rgba(0, 0, 0, 0.12);
  max-width: 228px;
  min-width: 228px;
  max-height:200px;
  border: ${props => props.locked ? "2px solid #b7b3ea" : "2px solid #b7b3ea"};
  border-radius: 6px;
  padding: 4px;
  margin-top: 3px;
  margin-left: 5px;
  overflow: hidden;
  -webkit-filter: ${props => props.locked ? "grayscale(0.7)" : ""} ;
  //Ta metoda to druciarstwo o wiele lepiej jest tuaj https://stackoverflow.com/questions/61635321/props-conditional-rendering-using-styled-components
  background-color: ${props => props.color};
  background: repeating-linear-gradient(
          315deg,
        ${props => props.color},
        ${props => `${props.color} 10px`},
        ${props => props.locked ? "#D4D6D7 10px" : `${props.color} 10px`},
        ${props => props.locked ? "#D4D6D7 20px" : `${props.color} 20px`}
);
`;
const ButtonContainer = styled.div`
  display:flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin-bottom: -8px;
  margin-top: 17px;

`;
const Description = styled.div`
  flex-direction: column;
  max-width: 210px;
  min-width: 210px;
  word-wrap: break-word;
  flex-wrap: wrap;
  margin-top: 6px;
  padding-left: 8px;
  padding-right:8px;
`;
const UserChoiceBar = styled.div`
  margin-top: -15px;
  display: flex;
  flex-direction: row;
  word-wrap: break-word;
`;
const AvatarImage = styled.div`
  min-width: 40px;
  min-height: 40px;
  display: inline-block;
`;
const ProgressDiv = styled.div`
  min-width: 30px;
  display: inline-block;
`;
const InsideProgressDiv = styled.div`
  display: flex;
  width: 100%;
  flex-basis: 100%;
  margin-top: 9px;
`;
const Avatars = styled.div`
  height: 70px;
  width: 130px;
  margin-left: -24px;
  display: inline-flex;
  flex-direction: row;
  overflow: auto;
  margin-right: -10px;

`;
const ProgressAndButtons = styled.div`
    margin-top: auto;
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
  
`;
const EditMenu = styled.div`
    margin-top: auto;
    height: auto;
    width: 550px;
    display: flex;
    flex-direction: column;
    align-items: self-start;
    align-content: center;
    flex-wrap: nowrap;
  overflow:hidden;
`;
const EditMenuText = styled.div`
    display: block;
  
    flex-direction: column;
    align-items: self-start;
    align-content: center;
    flex-wrap: nowrap;
      overflow: scroll;


`;
const DroppableDiv = styled.div`
  height: 200px;
  width: inherit;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

function Card(props) {
    const [visible2, setVisible2] = useState(false);
    const [visible1, setVisible1] = useState(false);
    const [visible, setVisible] = useState(false);
    const [value, setValue] = useState('');
    const [value1, setValue1] = useState(props.color);
    const [lock, setLock] = useState(props.locked);
    const options = [
        {value: '#FFFFFF', style: {backgroundColor: `#FFFFFF`}},
        {value: '#86e95e', style: {backgroundColor: `#86e95e`}},
        {value: '#99B3E6', style: {backgroundColor: `#99B3E6`}},
        {value: '#FFE680', style: {backgroundColor: `#FFE680`}},
        {value: '#F2B580', style: {backgroundColor: `#F2B580`}},
    ];
    const options1 = [
        {value: false, icon: 'pi pi-lock-open'},
        {value: true, icon: 'pi pi-lock'},
    ];
    const [editSelectedUser, setEditSelectedUser] = useState(props.data?.user_data);
    const [cardItems, setCardItems] = useState(props.data?.item_data);
    const [users, setUsers] = useState('');
    const apiService = useUserService();
    const handleLock = (value) => {
        setLock(value)
        apiService.updateCard(props.board, {
            "id"       : props.backId,
            "is_locked": value
        }).then((response_data) => {
                CommonService.toastCallback(response_data, props.setBoards);
            },
            () => {setLock(props.locked)}
        );


    }
    const handleUnlock = (e) => {
        setLock(e.value)
        apiService.updateCard(props.board, {
            "id"       : props.backId,
            "is_locked": false
        }).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards)
        });
    }
    const handleInputChange = (e) => {
        apiService.updateCard(props.board, {
            "id"         : props.backId,
            "description": e.target.innerHTML
        }).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards)
        });
    }
    const accept = () => {
        apiService.removeCard((props.backId)).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards, props.setRemaining)
        });
    }

    const reject = () => {
    }
    const acceptEditCard = () => {
        var user_id = "";

        if(editSelectedUser != null) {
            user_id = editSelectedUser.id;
        }
        apiService.updateCard(props.board, {
            "id"         : props.backId,
            "description": value,
            "user"       : user_id,
            "color"      : value1,
            "items"      : cardItems
        }).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards);
        });
    }
//Ta funkcja też do poprawy, prymitywnie "naprawia" ona problem że można modyfikować checkpointy a potem odrzucić, jednak jakieś modyfikację zostają
    const rejectEditCard = () => {
        setValue('');
        apiService.getBoards().then((response_data) => {props.setBoards(response_data.data)});
    }
    const acceptAssignEdit = () => {
        apiService.updateCard(props.board, {
            "id"  : props.backId,
            "user": "",
        }).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards, props.setRemaining);
        });
    }
    const rejectAssignEdit = () => {
        setVisible2(false);
    }
    const editCardDialog = () => {
        //let usersCp=users.unshift(null)
        return (
            <EditMenu>
                <div>

                </div>
                <EditMenuText>
                    <InputTextarea className="w-full" value={value} onChange={(e) => setValue(e.target.value)} rows={1}
                                   cols={30}/>
                </EditMenuText>
                <div className="card flex flex-row align-items-center gap-5 pt-3 pb-3 pl-2">
                    <MultiStateCheckbox value={value1} onChange={(e) => setValue1(e.value)} options={options}
                                        optionValue="value" empty={false}/>
                    <span>{value1}</span>
                    <ToggleButton onLabel="Blokada"
                                  offLabel="Brak blokady"
                                  onIcon="pi pi-lock"
                                  offIcon="pi pi-lock-open"
                                  checked={lock}
                                  onChange={(e) => handleLock(e.value)}
                    />
                    <UserChoiceBar>
                        <h3>Przypisany użytkownik: {props.data.user_data?.username}</h3>
                        {/*<Button*/}
                        {/*    style={{marginTop: "15px", marginRight: "3px"}}*/}
                        {/*    onClick={() => setEditSelectedUser(null)}*/}
                        {/*    icon="pi pi-times"*/}
                        {/*    rounded*/}
                        {/*    text*/}
                        {/*    size="small"*/}
                        {/*    severity="danger"*/}
                        {/*    aria-label="Cancel"/>*/}
                        {/*<Dropdown className="mt-3 w-full" value={(editSelectedUser)}*/}
                        {/*          onChange={(e) => setEditSelectedUser(e.value)} options={(props.users)}*/}
                        {/*          optionLabel="username"*/}
                        {/*          placeholder="Wybierz użytkownika"*/}
                        {/*/>*/}
                    </UserChoiceBar>
                </div>
                <div className="mt-3 flex justify-content-between align-items-center flex-wrap">
                    <h3>Lista podzadań
                        ({Math.round((cardItems.filter((x) => x.is_done).length / cardItems.length) * 100) || 0}%):</h3>
                    <Button
                        icon="pi pi-plus"
                        size="lg"
                        rounded
                        text
                        aria-label="Filter"
                        onClick={() => {
                            cardItems.push({});
                            //Poniższe dodano, zeby nie walił errorami
                            if (cardItems.length-1===1){
                                cardItems[0].key=uuidv4()
                            }
                            else cardItems[cardItems.length-1].key=uuidv4()
                            setCardItems([...cardItems]);
                        }}/>
                </div>
                {cardItems.length > 0 ? (
                    <div>
                        {cardItems.map((card_item, index) => {
                            return (
                                <div key={card_item.id} className="flex align-items-center mt-3">
                                    <Checkbox inputId={card_item.id} name="card_item" value={card_item.is_done}
                                              onChange={(e) => {
                                                  cardItems[index].is_done = !e.value;

                                                  setCardItems([...cardItems]);

                                              }}
                                              checked={card_item.is_done}/>
                                    <InputText className="ml-3" value={card_item.name} onChange={(e) => {
                                        cardItems[index].name = e.target.value;
                                        setCardItems([...cardItems]);
                                    }}/>
                                    <Button className="ml-3"
                                            icon="pi pi-trash"
                                            size="lg"
                                            rounded
                                            text
                                            aria-label="Filter"
                                            onClick={() => {
                                                cardItems.splice(index, 1);
                                                setCardItems([...cardItems]);
                                            }}/>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center">
                        Brak danych
                    </div>
                )}
            </EditMenu>
        )
    }

    let userLabel = props.data.user_data?.username.charAt(0).toUpperCase() + props.data.user_data?.username.charAt(props.data.user_data?.username.length - 1).toUpperCase();
    return (

        <Draggable
            key={props.backId}
            draggableId={props.dragId}
            isDragDisabled={props.locked}
            index={props.indexDrag}>
            {(provided) => (
                <CardStyle{...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          color={props.color}
                          locked={props.locked}
                          onDoubleClick={() => console.log(props.data.user_data)}>
                    <Droppable
                        droppableId={props.dropId}
                        direction="horizontal"
                        type="avatar">
                        {(provided) => (
                            <DroppableDiv
                                {...provided.droppableId}
                                ref={provided.innerRef}>
                                <Description
                                    className='tasks-container'>
                                    <ContentEditable
                                        spellCheck="false"
                                        className="Description"
                                        html={props.description}
                                        disabled={false}
                                        onBlur={handleInputChange}/>
                                </Description>
                                {cardItems.length > 0 ? (
                                    <div>
                                        {cardItems.map((card_item, index) => {
                                            return (
                                                <div key={card_item.id} className="flex align-items-center mt-3">
                                                    <Checkbox inputId={card_item.id} name="card_item" value={card_item.is_done}
                                                              onChange={(e) => {
                                                                  cardItems[index].is_done = !e.value;
                                                                  // setCardItems([...cardItems]);
                                                                  apiService.updateCard(props.board, {
                                                                      "id"         : props.backId,
                                                                      "items"      : cardItems
                                                                  }).then((response_data) => {
                                                                      CommonService.toastCallback(response_data, props.setBoards);
                                                                  });
                                                              }}
                                                              checked={card_item.is_done}/>
                                                    <span style={{marginLeft:"4px"}}>{card_item.name}</span>

                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <h5 style={{marginTop:"50px"}}> Brak podzadań</h5>
                                    </div>
                                )}
                                <ProgressAndButtons>

                                <ButtonContainer>
                                    {/*<MultiStateCheckbox*/}
                                    {/*    icon="pi pi-lock"*/}
                                    {/*    value={lock}*/}
                                    {/*    empty={false}*/}
                                    {/*    options={options1}*/}
                                    {/*    onChange={e => handleLock(e.value)}*/}
                                    {/*    optionValue="value"*/}
                                    {/*/>*/}

                                    <ConfirmDialog closeOnEscape={false}
                                                   closable={false}
                                                   visible={visible1}
                                                   onHide={() => setVisible1(false)}
                                                   message={editCardDialog}
                                                   header="Potwierdzenie edycji"
                                        // icon="pi pi-pencil"
                                                   acceptLabel="Akceptuj"
                                                   rejectLabel="Odrzuć"
                                                   accept={acceptEditCard}
                                                   reject={rejectEditCard}/>
                                    <span className="p-buttonset" style={{scale:"0.7",whiteSpace:"nowrap",marginLeft:"-29px"}}>
                                    <Button className="ml-2" onClick={() => CommonService.onOpenDialog(setVisible1, [{
                                        callback: setValue,
                                        value   : props.description
                                    }, {
                                        callback: setEditSelectedUser,
                                        value   : props.data?.user_data
                                    }, {callback: setCardItems, value: props.data?.item_data}])}
                                            icon="pi pi-pencil"
                                            size="small"
                                            aria-label="Cancel"/>
                                        <ToggleButton style={{backgroundColor:'#4F46E5 !important'}}
                                                      onLabel=""
                                                      offLabel=""
                                                      onIcon="pi pi-lock-open"
                                                      offIcon="pi pi-lock"
                                                      size="small"
                                                      checked={!lock}
                                                      onChange={(e) => handleLock(!(e.value))}
                                        />
                                        <Button onClick={() => (setVisible(true))}
                                                icon="pi pi-times"
                                                size="small"
                                                aria-label="Cancel"/>
                                    </span>
                                    <ConfirmDialog visible={visible}
                                                   onHide={() => setVisible(false)}
                                                   message="Czy na pewno chcesz usunąć zadanie?"
                                                   header="Potwierdzenie usunięcia"
                                                   icon="pi pi-trash"
                                                   acceptLabel="Tak"
                                                   rejectLabel="Nie"
                                                   accept={accept}
                                                   reject={reject}/>
                                    <ConfirmDialog visible={visible2}
                                                   onHide={() => setVisible2(false)}
                                                   message="Czy na pewno chcesz przypisanie użytkownika?"
                                                   header="Potwierdzenie usunięcia"
                                                   icon="pi pi-trash"
                                                   acceptLabel="Tak"
                                                   rejectLabel="Nie"
                                                   accept={acceptAssignEdit}
                                                   reject={rejectAssignEdit}/>


                                    {/*{props.data.user_data ?*/}
                                    {/*// <div>*/}
                                    {/*//     <Tooltip target=".user-avatar"/>*/}
                                    {/*//     <Avatar className="mt-2 user-avatar"*/}
                                    {/*//             label={userLabel}*/}
                                    {/*//             data-pr-tooltip={props.data.user_data.username}*/}
                                    {/*//             style={{backgroundColor: stc(props.data.user_data.username), color:*/}
                                    {/*// 'white'}}/> </div> <AvatarImage src={props.data.user_data.avatar}/>AvatarImage*/}
                                    {/*//     <AvatarImage>*/}
                                    {/*//         <Tooltip target=".p-overlay-badge user-avatar"/>*/}
                                    {/*//         <Avatar className="p-overlay-badge user-avatar"*/}
                                    {/*//             label={props.data.user_data.username}*/}
                                    {/*//             image={props.data.user_data.avatar}*/}
                                    {/*//         size="xlarge" shape="circle" style={{width: "40px", height: "40px"}}>*/}
                                    {/*//     <Badge value="X" style={{scale: "0.9", textAlign: "center"}}*/}
                                    {/*//            onClick={() => (setVisible2(true))}/>*/}
                                    {/*//     </Avatar>*/}
                                    {/*//     </AvatarImage>*/}
                                    {/*//     :*/}
                                    {/*//     <AvatarImage>*/}
                                    {/*//     </AvatarImage>*/}
                                    {/*// }*/}
                                    <Avatars>
                                        {(props.data.users_data).map((cardUser) =>
                                            <CardUsers
                                                setBoards={props.setBoards}
                                                setRemaining={props.setRemaining}
                                                board={props.board}
                                                allUsers={props.data.users}
                                                cardId={props.backId}
                                                key={cardUser.id}
                                                id={cardUser.id}
                                                username={cardUser.username}
                                                img={cardUser.avatar}
                                            />
                                        )}
                                    </Avatars>
                                </ButtonContainer>
                                    <ProgressDiv>

                                    {props.data.item_data.length > 0 && (
                                        <InsideProgressDiv>
                                            {/*{}%*/}
                                            <ProgressBar value={props.data.subtask_done_percentage}  style={{ height: '16px', width: "100%", color:"black" }} ></ProgressBar>
                                        </InsideProgressDiv>
                                    )}
                                    </ProgressDiv>
                                </ProgressAndButtons>
                                {/*</div>*/}
                                {provided.placeholder}
                            </DroppableDiv>
                        )}
                    </Droppable>
                </CardStyle>
            )}
        </Draggable>

    )
}

export default Card
