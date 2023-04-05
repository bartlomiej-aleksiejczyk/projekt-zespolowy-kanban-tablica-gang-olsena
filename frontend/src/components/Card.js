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
import { useTranslation } from 'react-i18next';
import LanguageChoose from "./LanguageChoose";
import board from "./Board";
import { Accordion, AccordionTab } from 'primereact/accordion';

const CardStyle = styled.div`
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.03), 0px 0px 2px rgba(0, 0, 0, 0.06), 0px 2px 6px rgba(0, 0, 0, 0.12);
  max-width: 250px;
  min-width: 250px;
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
const ScrollSpaceContainer = styled.div`
  margin-right: 4px;
  max-width: 225px;
  min-width: 225px;
  height: 290px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;

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
const TopButtonContainer = styled.div`
  display:flex;
  justify-content: space-between;
  
  flex-direction: row;
  flex-wrap: nowrap;
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
const ChildrenContainer = styled.div`
  display: block;
  border-radius: 7px;
  padding: 2px;
  width: 220px;
  background-color: #c7c7d7;
  border-width: 2px;
  border-color: #6866ce;
  border-style: solid;
`;
const EditCardChildren = styled.div`
  display: block;
  padding: 7px;
  margin-top: 10px;
  border-radius: 7px;
  background-color: #ffffff;
  border-width: 2px;
  border-color: #a2a2af;
  border-style: solid;
`;
const EditCardChild = styled.div`
  display: block;
  padding: 7px;
  border-radius: 7px;
  background-color: #c7c7d7;
  border-width: 2px;
  border-color: #6866ce;
  border-style: solid;
`;
function Card(props) {
    const { t, i18n } = useTranslation();
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
    const [users, setUsers] = useState('');
    const [restrictedBoards, setRestrictedBoards] = useState(props.restrictedBoardsData);
    const [bug, setBug] = useState(props.hasBug);
    const [itemCollapse, setItemCollapse] = useState(false)
    const [childrenCollapse, setChildrenCollapse] = useState(false)
    const [uneditedBoards, setUneditedBoards] = useState(props.boards)
    const [cardItems, setCardItems] = useState(props.data?.item_data);
    React.useEffect(() => {
        const items = props.itemDataNew;
        if (items) {
            setCardItems(items);
        }
        console.log("useeff")

    }, [props.itemDataNew]);
    const apiService = useUserService();
    const handleItemCollapse = () => {
        setItemCollapse(!itemCollapse)
    }
    const handleChildrenCollapse = () => {
        setChildrenCollapse(!childrenCollapse)
    }
    const handleLock = (value) => {
        setLock(value)
        apiService.updateSingleCard(props.backId, {
            "is_locked": value
        }).then((response_data) => {
                CommonService.toastCallback(response_data, props.setBoards);
            },
            () => {setLock(props.locked)}
        );
    }
    const handleBugCheck  = () => {
        apiService.updateSingleCard(props.backId, {
            "has_bug": !(bug)
        }).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards);
            if (response_data.success){
                setBug(!bug)
            }
        });
    }
    const handleUnlock = (e) => {
        setLock(e.value)
        apiService.updateSingleCard(props.backId, {
            "is_locked": false
        }).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards)
        });
    }
    const handleInputChange = (e) => {
        apiService.updateSingleCard(props.backId, {
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
            "has_bug" : bug
        }).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards, props.setRemaining, props.setCardsChoice, setRestrictedBoards);
            setVisible1(false);
        });
    }
    async function rejectEditCard(){
        apiService.getBoards().then((response_data) => {props.setBoards(response_data.data)});
            setValue1(props.color);
            setLock(props.locked);
            setVisible1(false);
            setRestrictedBoards(props.restrictedBoardsData);
            setParent(props.parentCard);
        }

    const acceptAssignEdit = () => {
        if(props.boards[0].id in restrictedBoards) {
            setRestrictedBoards([])
        }
        apiService.updateSingleCard(props.backId, {
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
    }, [props.restrictedBoardsData]);
    React.useEffect(() => {
        props.setCardsChoice(props.cardsChoice);
    }, [props.cardsChoice])
    const footerContent = (
        <div>
            <Button label={t("reject")} icon="pi pi-times" onClick={rejectEditCard} className="p-button-text"/>
            <Button label={t("accept")} icon="pi pi-check" onClick={acceptEditCard} autoFocus/>
        </div>
    );
    const editCardDialog = () => {
        //let usersCp=users.unshift(null)
        return (
            <EditMenu>
                <Dialog header={t("cardEditDialog")}
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
                                      placeholder={t("cardEditDialogChooseParent")}
                            />
                        </UserChoiceBar>
                        <MultiSelect style={{backgroundColor: "#ff466e !important", color: "black !important"}}
                                     value={restrictedBoards}
                                     onChange={(e) => setRestrictedBoards(e.value)}
                                     options={props.boards}
                                     optionLabel="name"
                                     showSelectAll="false"
                                     placeholder={t("cardRestrictColumnDialog")}
                                     optionValue="id"
                                     className="w-6 ml-3"/>
                    </div>
                    <div className="card flex flex-row align-items-center gap-3 pt-3 pb-3 pl-2">
                        <div className="w-6">
                            <MultiStateCheckbox value={value1} onChange={(e) => setValue1(e.value)} options={options}
                                                optionValue="value" empty={false}/>
                            <span className="pl-3">{value1}</span>
                        </div>
                        <ToggleButton className="w-6"
                                      onLabel={t("cardLocked")}
                                      offLabel={t("cardUnlocked")}
                                      onIcon="pi pi-lock"
                                      offIcon="pi pi-lock-open"
                                      checked={lock}
                                      onChange={(e) => handleLock(e.value)}
                        />
                        <ToggleButton
                            style={{scale:"0.9"}}
                            onLabel="Bug"
                            offLabel=" "
                            value={props.hasBug}
                            onChange={(e) => {handleBugCheck()}}
                            checked={props.hasBug}
                            onIcon="pi pi-wrench"
                            offIcon="pi pi-wrench"
                            disabled={props.isCardDone}
                        />
                        {/*(props.cardsChoice.find(o => o.id === props.backId).restricted_boards)*/}
                    </div>
                    <div className="mt-3 flex justify-content-between align-items-center flex-wrap">
                        <h3>{t("cardItemChecklist")} {props.data.subtask_done_percentage}% :</h3>
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
                    </div>
                    {(cardItems.length > 0) ? (
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
                            <div>{t("cardNoData")}</div>
                        </div>
                    )}
                    {(props.childData.length > 0) &&
                        <EditCardChildren>
                        <h3>{t("cardChildrenChecklist")} </h3>
                                <div>
                                {props.childData.map((childCard, index) => {
                                    return (
                                        <EditCardChild key={childCard.id} className="flex align-items-center mt-3">
                                            <Checkbox inputId={childCard.id} name="card_item"
                                                      value={childCard.is_card_finished}
                                                      disabled={true}
                                                      checked={childCard.is_card_finished}/>
                                            <span style={{marginLeft: "4px"}}>{childCard.description}</span>

                                        </EditCardChild>
                                    );
                                })}
                            </div>
                        </EditCardChildren>
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
                    // onDoubleClick={() => props.setCallRestrictionUpdate(true)}
                >
                    <Droppable
                        droppableId={props.dropId}
                        direction="horizontal"
                        type="avatar">
                        {(provided) => (
                            <DroppableDiv
                                {...provided.droppableId}
                                ref={provided.innerRef}>
                                <ScrollSpaceContainer>
                                {props.parentCard &&
                                    <ChildBar>
                                    <i className="pi pi-circle-fill"></i>
                                    {t("cardHasAParent")} {(props.parentName ?
                                    (props.parentName[0].length > 9 ? props.parentName[0].substring(0, 9 - 3) + "..." :
                                        props.parentName[0]) : "")}
                                </ChildBar>}
                                {props.childData.length > 0 &&
                                <ParentBar>
                                    <i className="pi pi-sitemap"></i>
                                    {t("cardIsParent")}
                                </ParentBar>}
                                {props.restrictedBoardsData.length > 0 &&
                                <RestrictedBoardsBar>
                                    <RestrictedAndLabel>
                                        {/*<i className="pi pi-ban"></i>*/}
                                        {/*Kolumny: */}
                                        <MultiSelect id="p-chips-token-label" dropdownIcon="pi pi-ban" filter="Kolumny"
                                                     value={restrictedBoards}
                                                     onChange={(e) => setRestrictedBoards(e.value)}
                                                     options={props.boards}
                                                     optionLabel="name"
                                                     showSelectAll="false"
                                                     disabled="false"
                                                     placeholder={t("cardRestrictBoard")}
                                                     optionValue="id"
                                                     className="w-full md:w-20rem"/>
                                    </RestrictedAndLabel>
                                </RestrictedBoardsBar>}
                                <TopButtonContainer>
                                        {props.isCardDone ?
                                            <Button style={{scale:"0.9"}} label={t("cardFinished")} icon="pi pi-check" severity="success" />
                                            : <Button style={{scale:"0.9"}} label={t("cardNotFinished")} icon="pi pi-empty" disabled="false"/>
                                        }
                                    <ToggleButton
                                        style={{scale:"0.9"}}
                                        onLabel="Bug"
                                        offLabel=" "
                                        value={props.hasBug}
                                        onChange={(e) => {handleBugCheck()}}
                                        checked={props.hasBug}
                                        onIcon="pi pi-wrench"
                                        offIcon="pi pi-wrench"
                                        disabled={props.isCardDone}
                                        />
                                </TopButtonContainer>
                                <Description
                                    className='tasks-container'>
                                    <ContentEditable
                                        spellCheck="false"
                                        className="Description"
                                        html={props.description}
                                        disabled={false}
                                        onBlur={handleInputChange}/>
                                </Description>

                                    {(cardItems.length > 0)&& (
                                        <div>
                                        <ToggleButton style={{width: "220px", marginTop: "10px", height: "20px"}}
                                                      onLabel={t("cardCarditems")} offLabel={t("cardCarditems")} onIcon="pi pi-minus" offIcon="pi pi-plus"
                                                      checked={itemCollapse}
                                                      onChange={() => handleItemCollapse()}/>
                                    {(itemCollapse===true)&&(
                                            <div>
                                                {cardItems.map((card_item, index) => {
                                                    return (
                                                        <div key={card_item.id} className="flex align-items-center mt-3">
                                                            <Checkbox inputId={card_item.id} name="card_item"
                                                                      value={card_item.is_done}
                                                                      onChange={(e) => {
                                                                          cardItems[index].is_done = !e.value;
                                                                          // setCardItems([...cardItems]);
                                                                          apiService.updateSingleCard(props.backId, {
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
                                        </div>
                                    )}
                                {(props.childData.length > 0) &&
                                    <div>
                                        <ToggleButton style={{width: "220px", marginTop: "10px", height: "20px"}}
                                              onLabel={t("cardChildren")} offLabel={t("cardChildren")} onIcon="pi pi-minus" offIcon="pi pi-plus"
                                              checked={childrenCollapse}
                                              onChange={() => handleChildrenCollapse()}/>
                                        {(childrenCollapse === true) &&
                                            <ChildrenContainer>
                                                {props.childData.map((childCard, index) => {
                                                    return (
                                                        <div key={childCard.id}
                                                             className="flex align-items-center mt-3">
                                                            <Checkbox inputId={childCard.id} name="card_item"
                                                                      value={childCard.is_card_completed}
                                                                      disabled={true}
                                                                      checked={childCard.is_card_finished}/>
                                                            <span
                                                                style={{marginLeft: "4px"}}>{childCard.description.length > 19 ? childCard.description.substring(0, 19 - 3) + "..." : childCard.description}</span>
                                                        </div>
                                                    );
                                                })}
                                                <InsideProgressDiv>
                                                    {/*{}%*/}
                                                    <ProgressBar value={props.data.children_done_percentage} style={{
                                                        height: '16px',
                                                        width : "100%",
                                                        color : "black"
                                                    }}
                                                    color="green"></ProgressBar>
                                                </InsideProgressDiv>
                                            </ChildrenContainer>

                                        }
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
                                                       header={t("cardEditDialog")}
                                            // icon="pi pi-pencil"
                                                       acceptLabel={t("accept")}
                                                       rejectLabel={t("reject")}
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
                                            aria-label="Cancel"
                                            disabled={props.isCardDone}/>
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
                                                       message={t("cardRemoveDialogMessage")}
                                                       header={t("cardRemoveHeader")}
                                                       icon="pi pi-trash"
                                                       acceptLabel={t("yes")}
                                                       rejectLabel={t("no")}
                                                       accept={accept}
                                                       reject={reject}/>
                                        <ConfirmDialog visible={visible2}
                                                       onHide={() => setVisible2(false)}
                                                       message={t("cardRemoveUserAssignmentDialog")}
                                                       header={t("cardRemoveHeader")}
                                                       icon="pi pi-trash"
                                                       acceptLabel={t("yes")}
                                                       rejectLabel={t("no")}
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
                                        {(props.data.item_data.length > 0  && (
                                            <InsideProgressDiv>
                                                {/*{}%*/}
                                                <ProgressBar value={props.data.subtask_done_percentage} style={{
                                                    height: '16px',
                                                    width : "100%",
                                                    color : "black"
                                                }}></ProgressBar>
                                            </InsideProgressDiv>
                                        ))}
                                    </ProgressDiv>
                                </ProgressAndButtons>
                                {/*</div>*/}
                                </ScrollSpaceContainer>
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
