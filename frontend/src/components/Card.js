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
import {MultiSelect} from 'primereact/multiselect'
import CardUsers from "./CardUsers";
import {v4 as uuidv4} from 'uuid';
import {Dialog} from 'primereact/dialog';

import board from "./Board";

const CardStyle = styled.div`
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.03), 0px 0px 2px rgba(0, 0, 0, 0.06), 0px 2px 6px rgba(0, 0, 0, 0.12);
  max-width: 228px;
  min-width: 228px;
  max-height:290px;
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
const ChildBar = styled.div`
  display: block;
  min-height: 30px;
  border-radius: 7px;
  padding: 2px;
  background-color: #b0fcea;
  border-width: 1px;
  margin-left: 3px;
  margin-right: 3px;
  margin-bottom: 3px;
  border-color: #77EECFFF;
  border-style: solid;
`;
const ParentBar = styled.div`
  display: block;
  min-height: 30px;
  border-radius: 7px;
  padding: 2px;
  background-color: #b0fcea;
  border-width: 1px;
  margin-left: 3px;
  margin-right: 3px;
  margin-bottom: 3px;
  border-color: #77EECFFF;
  border-style: solid;
`;
const RestrictedBoardsBar = styled.div`
  display: block;
  min-height: 25px;
  margin-bottom: 20px;
  margin-left: 3px;
  margin-right: 3px;

`;
const RestrictedAndLabel = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 25px;
  max-height: 50px;

  background-color: #ff0090;
  border-radius: 7px;
  color: black;


`;
const ButtonContainer = styled.div`
  display:flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin-bottom: -25px;
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
  margin-right: -1px;

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
  height:290px ;
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
    const [parent, setParent] = useState(props.parentCard);
    const [cardItems, setCardItems] = useState(props.data?.item_data);
    const [users, setUsers] = useState('');
    const [restrictedBoards, setRestrictedBoards] = useState(props.restrictedBoardsData);

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
            CommonService.toastCallback(response_data, props.setBoards, props.setCardsChoice, props.setCardsChoice)
        });
    }
    const accept = () => {
        apiService.removeCard((props.backId)).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards, props.setRemaining, props.setCardsChoice)
        });
    }

    const reject = () => {
    }
    const acceptEditCard = () => {
        let parentAux = "";

        if(parent != null) {
            parentAux = parent;
        }
        apiService.updateCard(props.board, {
            "id"               : props.backId,
            "description"      : value,
            "color"            : value1,
            "items"            : cardItems,
            "parent_card"      : parentAux,
            "restricted_boards": restrictedBoards,
        }).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards, props.setRemaining, props.setCardsChoice, setRestrictedBoards);
            setVisible1(false);
        });
    }
//Ta funkcja też do poprawy, prymitywnie "naprawia" ona problem że można modyfikować checkpointy a potem odrzucić,
// jednak jakieś modyfikację zostają, ale problem polega
    //że nie jest async więć zbyt szybko aktualizuje się chya
    const rejectEditCard = () => {
        apiService.getBoards().then((response_data) => {
            props.setBoards(response_data.data);
            setCardItems(props.data.item_data)
        });
        setValue1(props.color);
        setLock(props.locked);
        setVisible1(false);
        setRestrictedBoards(props.restrictedBoardsData);
        setCardItems(props.data?.item_data);
        setParent(props.parentCard);
    }
    const acceptAssignEdit = () => {
        if(props.boards[0].id in restrictedBoards) {
            setRestrictedBoards([])
        }
        apiService.updateCard(props.board, {
            "id"  : props.backId,
            "user": "",
        }).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards, props.setRemaining, props.setCardsChoice);
        });
    }
    const rejectAssignEdit = () => {
        setVisible2(false);
    }

    //Generalnie tak się z tego co wiem nie powinno pisać, use effect jest do synchronizacji z zewnętrznymi rzeczami
    //Jest to zły wzorzec, ale nie mam lepszego pomysłu
    React.useEffect(() => {
        setRestrictedBoards(props.restrictedBoardsData);
    }, [props.restrictedBoardsData])
    React.useEffect(() => {
        props.setCardsChoice(props.cardsChoice);
    }, [props.cardsChoice])
    const footerContent = (
        <div>
            <Button label="Anuluj" icon="pi pi-times" onClick={rejectEditCard} className="p-button-text"/>
            <Button label="Akceptuj" icon="pi pi-check" onClick={acceptEditCard} autoFocus/>
        </div>
    );
    const editCardDialog = () => {
        //let usersCp=users.unshift(null)
        return (
            <EditMenu>
                <Dialog header="Okno edycji postaci"
                        visible={visible1}
                        style={{width: '50vw'}}
                        onHide={() => rejectEditCard}
                        closable={false}
                        footer={footerContent}
                        blockScroll="true"
                >
                    <div>

                    </div>
                    <EditMenuText>
                        <InputTextarea className="w-full" value={value} onChange={(e) => setValue(e.target.value)}
                                       rows={1}
                                       cols={30}/>
                    </EditMenuText>
                    <div className="flex">
                        <Button
                            onClick={() => setParent(null)}
                            icon="pi pi-times"
                            rounded
                            text
                            size="small"
                            severity="danger"
                            aria-label="Cancel"/>
                        <UserChoiceBar className="w-6">

                            <Dropdown className="mt-3 w-full" value={parent}
                                      onChange={(e) => setParent(e.value)} options={(props.cardsChoice)}
                                      optionLabel="description"
                                      optionValue="id"
                                      placeholder="Wybierz rodzica"
                            />
                        </UserChoiceBar>
                        <MultiSelect style={{backgroundColor: "#ff466e !important", color: "black !important"}}
                                     value={restrictedBoards} onChange={(e) => setRestrictedBoards(e.value)}
                                     options={props.boards} optionLabel="name" showSelectAll="false"
                                     placeholder="Wybierz tablicę do wykluczenia" optionValue="id"
                                     className="w-6 ml-3"/>
                    </div>
                    <div className="card flex flex-row align-items-center gap-3 pt-3 pb-3 pl-2">
                        <div className="w-6">
                            <MultiStateCheckbox value={value1} onChange={(e) => setValue1(e.value)} options={options}
                                                optionValue="value" empty={false}/>
                            <span className="pl-3">{value1}</span>
                        </div>
                        <ToggleButton className="w-6"
                                      onLabel="Blokada"
                                      offLabel="Brak blokady"
                                      onIcon="pi pi-lock"
                                      offIcon="pi pi-lock-open"
                                      checked={lock}
                                      onChange={(e) => handleLock(e.value)}
                        />
                        {/*(props.cardsChoice.find(o => o.id === props.backId).restricted_boards)*/}
                    </div>
                    <div className="mt-3 flex justify-content-between align-items-center flex-wrap">
                        <h3>Lista podzadań {props.data.subtask_done_percentage}% :</h3>
                        {props.childData.length === 0 &&
                        <Button
                            icon="pi pi-plus"
                            size="lg"
                            rounded
                            text
                            aria-label="Filter"
                            onClick={() => {
                                cardItems.push({key: uuidv4()});
                                //Poniższe dodano, zeby nie walił errorami
                                setCardItems([...cardItems]);
                            }}/>
                        }
                    </div>
                    {(cardItems.length > 0) && (props.childData.length === 0) ? (
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
                            {(props.childData.length === 0) &&
                            <div>Brak danych</div>
                            }
                        </div>
                    )}
                    {(props.childData.length > 0) &&
                    <div>
                        {props.childData.map((childCard, index) => {
                            return (
                                <div key={childCard.id} className="flex align-items-center mt-3">
                                    <Checkbox inputId={childCard.id} name="card_item"
                                              value={childCard.is_card_completed} disabled={childCard.has_items}
                                              onChange={(e) => {
                                                  // setCardItems([...cardItems]);
                                                  apiService.updateCard(childCard.board, {
                                                      "id"               : childCard.id,
                                                      "is_card_completed": !e.value,
                                                  }).then((response_data) => {
                                                      CommonService.toastCallback(response_data, props.setBoards);
                                                  });
                                              }}
                                              checked={childCard.is_card_completed}/>
                                    <span style={{marginLeft: "4px"}}>{childCard.description}</span>

                                </div>
                            );
                        })}
                    </div>
                    }
                </Dialog>
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
                    onDoubleClick={() => props.setCallRestrictionUpdate(true)}
                >
                    <Droppable
                        droppableId={props.dropId}
                        direction="horizontal"
                        type="avatar">
                        {(provided) => (
                            <DroppableDiv
                                {...provided.droppableId}
                                ref={provided.innerRef}>
                                {props.parentCard &&
                                <ChildBar>
                                    <i className="pi pi-circle-fill"></i>
                                    Ma rodzica: {(props.parentName ?
                                    (props.parentName[0].length > 9 ? props.parentName[0].substring(0, 9 - 3) + "..." :
                                        props.parentName[0]) : "")}
                                </ChildBar>}
                                {props.childData.length > 0 &&
                                <ParentBar>
                                    <i className="pi pi-sitemap"></i>
                                    Zadanie jest rodzicem
                                </ParentBar>}
                                {props.restrictedBoardsData.length > 0 &&
                                <RestrictedBoardsBar>
                                    <RestrictedAndLabel>
                                        {/*<i className="pi pi-ban"></i>*/}
                                        {/*Kolumny: */}
                                        <MultiSelect id="p-chips-token-label" dropdownIcon="pi pi-ban" filter="Kolumny"
                                                     value={restrictedBoards}
                                                     onChange={(e) => setRestrictedBoards(e.value)}
                                                     options={props.boards} optionLabel="name" showSelectAll="false"
                                                     disabled="false" placeholder="Wybierz tablicę do wykluczenia"
                                                     optionValue="id" className="w-full md:w-20rem"/>
                                    </RestrictedAndLabel>
                                </RestrictedBoardsBar>}
                                <Description
                                    className='tasks-container'>
                                    <ContentEditable
                                        spellCheck="false"
                                        className="Description"
                                        html={props.description}
                                        disabled={false}
                                        onBlur={handleInputChange}/>
                                </Description>
                                {(cardItems.length > 0) && (props.childData.length === 0) && (
                                    <div>
                                        {cardItems.map((card_item, index) => {
                                            return (
                                                <div key={card_item.id} className="flex align-items-center mt-3">
                                                    <Checkbox inputId={card_item.id} name="card_item"
                                                              value={card_item.is_done}
                                                              onChange={(e) => {
                                                                  cardItems[index].is_done = !e.value;
                                                                  // setCardItems([...cardItems]);
                                                                  apiService.updateCard(props.board, {
                                                                      "id"   : props.backId,
                                                                      "items": cardItems
                                                                  }).then((response_data) => {
                                                                      CommonService.toastCallback(response_data, props.setBoards);
                                                                  });
                                                              }}
                                                              checked={card_item.is_done}/>
                                                    <span style={{marginLeft: "4px"}}>{card_item.name}</span>

                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                                {(props.childData.length > 0) &&
                                <div>
                                    {props.childData.map((childCard, index) => {
                                        return (
                                            <div key={childCard.id} className="flex align-items-center mt-3">
                                                <Checkbox inputId={childCard.id} name="card_item"
                                                          value={childCard.is_card_completed}
                                                          disabled={childCard.has_items}
                                                          onChange={(e) => {
                                                              // setCardItems([...cardItems]);
                                                              apiService.updateCard(childCard.board, {
                                                                  "id"               : childCard.id,
                                                                  "is_card_completed": !e.value,
                                                              }).then((response_data) => {
                                                                  CommonService.toastCallback(response_data, props.setBoards);
                                                              });
                                                          }}
                                                          checked={childCard.is_card_completed}/>
                                                <span style={{marginLeft: "4px"}}>{childCard.description}</span>

                                            </div>
                                        );
                                    })}
                                </div>
                                }
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
                                                       reject={rejectEditCard}
                                        />
                                        <span className="p-buttonset"
                                              style={{scale: "0.7", whiteSpace: "nowrap", marginLeft: "-29px"}}>
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
                                        <ToggleButton style={{backgroundColor: '#4F46E5 !important'}}
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

                                        {(props.data.item_data.length > 0 && (props.childData.length === 0)) && (
                                            <InsideProgressDiv>
                                                {/*{}%*/}
                                                <ProgressBar value={props.data.subtask_done_percentage} style={{
                                                    height: '16px',
                                                    width : "100%",
                                                    color : "black"
                                                }}></ProgressBar>
                                            </InsideProgressDiv>
                                        )}
                                        {props.childData.length > 0 &&
                                        <InsideProgressDiv>
                                            {/*{}%*/}
                                            <ProgressBar value={props.data.subtask_done_percentage} style={{
                                                height: '16px',
                                                width : "100%",
                                                color : "black"
                                            }}></ProgressBar>
                                        </InsideProgressDiv>
                                        }
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
