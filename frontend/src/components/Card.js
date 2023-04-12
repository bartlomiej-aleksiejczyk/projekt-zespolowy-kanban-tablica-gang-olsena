import React, {useState, useEffect, useRef} from 'react'
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
import { Menu } from 'primereact/menu';
import CardUsers from "./CardUsers";
import {v4 as uuidv4} from 'uuid';
import {Dialog} from 'primereact/dialog';
import {useTranslation} from 'react-i18next';
import LanguageChoose from "./LanguageChoose";
import board from "./Board";
import {Accordion, AccordionTab} from 'primereact/accordion';
import {Tag} from 'primereact/tag';
import TimeAgo from 'timeago-react';
import moment from 'moment';
import CardMenu from "./Menus/CardMenu";

const CardStyle = styled.div`
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.03), 0px 0px 2px rgba(0, 0, 0, 0.06), 0px 2px 6px rgba(0, 0, 0, 0.12);
  font-size: 10px;
  max-width: 150px;
  min-width: 150px;
  max-height:174px;
  border: ${props => props.locked ? "2px solid #b7b3ea" : "2px solid #b7b3ea"};
  border-radius: 2px;
  padding: 2px;
  margin-top: 2px;
  margin-left: 3px;
  overflow: hidden;
  -webkit-filter: ${props => props.locked ? "grayscale(0.7)" : ""} ;
  //Ta metoda to druciarstwo o wiele lepiej jest tuaj https://stackoverflow.com/questions/61635321/props-conditional-rendering-using-styled-components
  background-color: ${props => props.color};
  background: repeating-linear-gradient(
          315deg,
        ${props => props.color},
        ${props => `${props.color} 6px`},
        ${props => props.locked ? "#D4D6D7 6px" : `${props.color} 6px`},
        ${props => props.locked ? "#D4D6D7 12px" : `${props.color} 12px`}
);
`;
const ScrollSpaceContainer = styled.div`
  margin-right: 2px;
  max-width: 135px;
  min-width: 135px;
  height: 174px;
  margin-bottom: 9px;
  padding-bottom: 2px;
  display: flex;
  flex-direction: column;

`;
const ChildBar = styled.div`
  display: block;
  min-height: 18px;
  border-radius: 4px;
  padding: 1px;
  background-color: #b0fcea;
  border-width: 1px;
  margin-left: 2px;
  margin-right: 2px;
  margin-bottom: 2px;
  border-color: #77EECFFF;
  border-style: solid;
`;
const ParentBar = styled.div`
  display: block;
  min-height: 18px;
  border-radius: 4px;
  padding: 1px;
  background-color: #b0fcea;
  border-width: 1px;
  margin-left: 2px;
  margin-right: 2px;
  margin-bottom: 2px;
  border-color: #77EECFFF;
  border-style: solid;
`;
const RestrictedBoardsBar = styled.div`
  display: block;
  min-height: 15px;
  margin-bottom: 12px;
  margin-left: 2px;
  margin-right: 2px;

`;
const RestrictedAndLabel = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 15px;
  max-height: 30px;
  background-color: #ff0090;
  border-radius: 4px;
  color: black;
`;
const ButtonContainer = styled.div`
  display:flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin-bottom: -15px;
  margin-top: 10px;

`;
const TopButtonContainer = styled.div`
  display:flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  flex-wrap: nowrap;
`;
const Description = styled.div`
  flex-direction: column;
  max-width: 126px;
  min-width: 126px;
  word-wrap: break-word;
  flex-wrap: wrap;
  margin-top: 4px;
  padding-left: 5px;
  padding-right:5px;
`;
const UserChoiceBar = styled.div`
  margin-top: -9px;
  display: flex;
  flex-direction: row;
  word-wrap: break-word;
`;
const AvatarImage = styled.div`
  min-width: 24px;
  min-height: 24px;
  display: inline-block;
`;
const ProgressDiv = styled.div`
  min-width: 18px;
  display: flex;
`;
const InsideProgressDiv = styled.div`
  display: flex;
  width: 100%;
  flex-basis: 100%;
  margin-top: 5px;
`;
const Avatars = styled.div`
  height: 42px;
  width: 78px;
  display: inline-flex;
  flex-direction: row;
  overflow: auto;
  margin-right: -1px;

`;
const ProgressAndButtons = styled.div`
    margin-top: auto;
    display: flex;
    flex-direction: column;
    margin-bottom: 6px;
  
`;
const EditMenu = styled.div`
    margin-top: auto;
    height: auto;
    width: 330px;
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
  height:167px ;
  width: inherit;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;
const ChildrenContainer = styled.div`
  display: block;
  border-radius: 4px;
  padding: 1px;
  width: 132px;
  background-color: #c7c7d7;
  border-width: 1px;
  border-color: #6866ce;
  border-style: solid;
`;
const EditCardChildren = styled.div`
  display: block;
  padding: 4px;
  margin-top: 6px;
  border-radius: 4px;
  background-color: #ffffff;
  border-width: 1px;
  border-color: #a2a2af;
  border-style: solid;
`;
const EditCardChild = styled.div`
  display: block;
  padding: 4px;
  border-radius: 4px;
  background-color: #c7c7d7;
  border-width: 1px;
  border-color: #6866ce;
  border-style: solid;
`;
const TagContainer = styled.div`
    display: flex;
  flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: stretch;
    
`;
function Card(props) {
    const {t, i18n} = useTranslation();
    const [visible2, setVisible2] = useState(false);
    const [visible1, setVisible1] = useState(false);
    const [visible, setVisible] = useState(false);
    const [value, setValue] = useState(props.description);
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
    const [users, setUsers] = useState(props.users);
    const [restrictedBoards, setRestrictedBoards] = useState(props.restrictedBoardsData);
    const [bug, setBug] = useState(props.hasBug);
    const [itemCollapse, setItemCollapse] = useState(props.areCarditemsCollapsed)
    const [childrenCollapse, setChildrenCollapse] = useState(props.areChildrenCollapsed)
    const [uneditedBoards, setUneditedBoards] = useState(props.boards)
    const [cardItems, setCardItems] = useState(props.data?.item_data);
    const editMenu = useRef(null);
    React.useEffect(() => {
        const items = props.itemDataNew;
        if(items) {
            setCardItems(items);
        }
        console.log("useeff")

    }, [props.itemDataNew]);
    const apiService = useUserService();
    const handleItemCollapse = () => {
        apiService.updateSingleCard(props.backId, {
            "are_carditems_collapsed": !(itemCollapse)
        }).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards);
            if(response_data.success) {
                setItemCollapse(!itemCollapse)
            }
        });    }
    const handleChildrenCollapse = () => {
        apiService.updateSingleCard(props.backId, {
            "are_children_collapsed": !(childrenCollapse)
        }).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards);
            if(response_data.success) {
                setChildrenCollapse(!childrenCollapse)
            }
        });
    }
    const handleLock = () => {
        const value = !lock
        setLock(value)
        apiService.updateSingleCard(props.backId, {
            "is_locked": value
        }).then((response_data) => {
                CommonService.toastCallback(response_data, props.setBoards);
            },
            () => {setLock(props.locked)}
        );
    }
    const handleBugCheck = () => {
        apiService.updateSingleCard(props.backId, {
            "has_bug": !(bug)
        }).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards);
            if(response_data.success) {
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
            "users"            : users,
            "restricted_boards": restrictedBoards,
            "has_bug"          : bug
        }).then((response_data) => {
            CommonService.toastCallback(response_data, props.setBoards, props.setRemaining, props.setCardsChoice, setRestrictedBoards);
            setVisible1(false);
        });
    }
    const items = [
        {
            label: 'Options',
            items: [
                {
                    label: t("cardMenuButtonOptionEdit"),
                    icon: 'pi pi-pencil',
                    command: () => {setVisible1(true)
                    }
                },
                {
                    label: t("cardMenuButtonOptionDelete"),
                    icon: 'pi pi-times',
                    command: () => {setVisible(true)
                    }
                },
                {
                    label: t("cardMenuButtonOptionLock"),
                    icon: 'pi pi-unlock',
                    command:
                        (e) => {
                            handleLock()
                        }
                },
                {
                    label: t("cardMenuButtonOptionBug"),
                    icon: 'pi pi-wrench',
                    command: () => {
                        handleBugCheck()}
                }
            ]
        }
    ];

    async function rejectEditCard() {
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



    let moveDiffDays = moment.duration(moment().diff(moment(props.updatedAt))).asDays();

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
                          onDoubleClick={() => setVisible1(true)}
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
                                    <TopButtonContainer>

                                        {/*<Button*/}
                                        {/*    icon="pi pi-bars"*/}
                                        {/*    round*/}
                                        {/*    text*/}
                                        {/*    onClick={(e) => editMenu.current.toggle(e)}*/}
                                        {/*    rounded*/}
                                        {/*/>*/}
                                        <Menu model={items} popup ref={editMenu} />
                                    </TopButtonContainer>
                                    <TagContainer>
                                        {props.isCardDone > 0 &&
                                            <Tag
                                                value={t("cardFinished")}
                                                 icon="pi pi-check"
                                                 severity="success"
                                                 style={{scale:"80%", fontSize:12,whiteSpace: "nowrap", height:"22px", marginRight:"-10px",marginLeft:"0px" }}
                                            />
                                        }
                                        <Tag
                                            severity={(moveDiffDays >= 5 && !props.isCardDone) ? 'danger' : 'success'}
                                             style={{scale:"80%", fontSize:12,whiteSpace: "nowrap", height:"22px", marginRight:"-10px",marginLeft:"0px" }}
                                        >
                                            <TimeAgo
                                                datetime={props.updatedAt}
                                                locale={t("cardTimeLocale")}
                                            /></Tag>
                                        {(props.data.item_data.length > 0 && (
                                            <Tag
                                                severity={(props.isCardCompleted) ? 'success' : 'primary'}
                                                style={{scale:"80%", fontSize:12,whiteSpace: "nowrap", height:"22px", marginRight:"-10px",marginLeft:"0px" }}
                                                icon="pi pi-check-square">
                                                {`${(props.data.item_data.filter(obj => obj.is_done === true)).length}/${props.data.item_data.length}`}
                                            </Tag>))}
                                        {props.parentCard &&
                                            <Tag
                                                 style={{scale:"80%", fontSize:12,whiteSpace: "nowrap", height:"22px", marginRight:"-10px",marginLeft:"0px" }}
                                                 value={`${t("cardHasAParent") }${(props.parentName ?
                                        (props.parentName[0].length > 9 ? props.parentName[0].substring(0, 9 - 3) + "..." :
                                            props.parentName[0]) : "")}`}

                                            />
                                            }
                                        {props.childData.length > 0 &&
                                            <Tag
                                                value={t("cardIsParent")}
                                                 style={{scale:"80%", fontSize:12,whiteSpace: "nowrap", height:"22px", marginRight:"-10px",marginLeft:"0px" }}
                                            />
                                        }
                                    </TagContainer>
                                    <Description
                                        className='tasks-container'>
                                        <ContentEditable
                                            spellCheck="false"
                                            className="Description"
                                            html={props.description}
                                            disabled={false}
                                            onBlur={handleInputChange}/>
                                    </Description>
                                    {(cardItems.length > 0) && (
                                        <div>
                                            <ToggleButton
                                                style={{width: "132px", marginTop: "6px", height: "12px", fontSize: 12 }}
                                                          onLabel={t("cardCarditems")} offLabel={t("cardCarditems")}
                                                          onIcon="pi pi-minus" offIcon="pi pi-plus"
                                                          checked={itemCollapse}
                                                          onChange={() => handleItemCollapse()}/>
                                            {(itemCollapse === true) && (
                                                <div>
                                                    {cardItems.map((card_item, index) => {
                                                        return (
                                                            <div key={card_item.id}
                                                                 className="flex align-items-center ">
                                                                <Checkbox inputId={card_item.id} name="card_item"
                                                                          value={card_item.is_done}
                                                                          onChange={(e) => {
                                                                              cardItems[index].is_done = !e.value;
                                                                              // setCardItems([...cardItems]);
                                                                              apiService.updateCard(props.board, {
                                                                                  "id":props.backId,
                                                                                  "items": cardItems
                                                                              }).then((response_data) => {
                                                                                  CommonService.toastCallback(response_data, props.setBoards);
                                                                              });
                                                                          }}
                                                                          style={{scale: "0.6"}}
                                                                          checked={card_item.is_done}
                                                                />
                                                                <span style={{marginLeft: "2px"}}>
                                                                    {card_item.name}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {(props.childData.length > 0) &&
                                    <div>
                                        <ToggleButton
                                            style={{width: "132px", marginTop: "6px", height: "12px", fontSize: 12 }}
                                                      onLabel={t("cardChildren")} offLabel={t("cardChildren")}
                                                      onIcon="pi pi-minus" offIcon="pi pi-plus"
                                                      checked={childrenCollapse}
                                                      onChange={() => handleChildrenCollapse()}/>
                                        {(childrenCollapse === true) &&
                                        <ChildrenContainer>
                                            {props.childData.map((childCard, index) => {
                                                return (
                                                    <div key={childCard.id}
                                                         className="flex align-items-center mt-2">
                                                        <Checkbox inputId={childCard.id} name="card_item"
                                                                  value={childCard.is_card_completed}
                                                                  disabled={true}
                                                                  style={{scale: "0.6"}}
                                                                  checked={childCard.is_card_finished}/>
                                                        <span
                                                            style={{marginLeft: "2px"}}>{childCard.description.length > 19 ? childCard.description.substring(0, 19 - 3) + "..." : childCard.description}</span>
                                                    </div>
                                                );
                                            })}
                                            <InsideProgressDiv>
                                                {/*{}%*/}
                                                <ProgressBar value={props.data.children_done_percentage} style={{
                                                    height: '10px',
                                                    width : "100%",
                                                    color : "black"
                                                }}
                                                             color="green"></ProgressBar>
                                            </InsideProgressDiv>
                                        </ChildrenContainer>

                                        }
                                    </div>
                                    }
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
                                                size="sm"
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
                                                         options={_.uniqWith(props.remaining, _.isEqual)}
                                                         optionLabel="username"
                                                         showSelectAll="false"
                                                         placeholder={t("cardRestrictColumnDialog")}
                                                         optionValue="id"
                                                         className="w-6 ml-3"/>
                                        </div>
                                        <div className="card flex flex-row align-items-center gap-3 pt-3 pb-3 pl-2">
                                            <div className="w-6">
                                                <MultiStateCheckbox value={value1} onChange={(e) => setValue1(e.value)} options={options}
                                                                    optionValue="value" empty={false}

                                                />
                                                <span className="pl-3">{value1}</span>
                                            </div>
                                            <ToggleButton
                                                className="w-6"
                                                onLabel={t("cardLocked")}
                                                offLabel={t("cardUnlocked")}
                                                onIcon="pi pi-lock"
                                                offIcon="pi pi-lock-open"
                                                checked={lock}
                                                onChange={(e) => handleLock(e.value)}
                                            />
                                            <Button icon="pi pi-trash"
                                                    style={{width:"70px"}}
                                                    onClick={() => setVisible(true)}/>
                                            <ToggleButton
                                                onLabel="Bug"
                                                offLabel=" "
                                                value={props.hasBug}
                                                onChange={(e) => {handleBugCheck()}}
                                                checked={props.hasBug}
                                                onIcon="pi pi-wrench"
                                                offIcon="pi pi-wrench"
                                                disabled={props.isCardDone}
                                                style={{width:"120px"}}

                                            />
                                            {/*(props.cardsChoice.find(o => o.id === props.backId).restricted_boards)*/}
                                        </div>
                                        <div className="mt-3 flex justify-content-between align-items-center flex-wrap">
                                            <h3>{t("cardItemChecklist")} {props.data.subtask_done_percentage}% :</h3>
                                            <Button
                                                icon="pi pi-plus"
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
                                                                      checked={card_item.is_done}
                                                            />
                                                            <InputText className="ml-3" value={card_item.name} onChange={(e) => {
                                                                cardItems[index].name = e.target.value;
                                                                setCardItems([...cardItems]);
                                                            }}/>
                                                            <Button className="ml-3"
                                                                    icon="pi pi-trash"
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
                                                                          checked={childCard.is_card_finished}
                                                                          style={{scale: "0.6"}}
                                                                />
                                                                <span style={{marginLeft: "3px"}}>{childCard.description}</span>
                                                            </EditCardChild>
                                                        );
                                                    })}
                                                </div>
                                            </EditCardChildren>
                                        }
                                    </Dialog>
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
                                            <ConfirmDialog visible={visible}
                                                           onHide={() => setVisible(false)}
                                                           message={t("cardRemoveDialogMessage")}
                                                           header={t("cardRemoveHeader")}
                                                           icon="pi pi-trash"
                                                           acceptLabel={t("yes")}
                                                           rejectLabel={t("no")}
                                                           style={{scale: "0.6"}}

                                                           accept={accept}
                                                           reject={reject}/>
                                            <ConfirmDialog visible={visible2}
                                                           onHide={() => setVisible2(false)}
                                                           message={t("cardRemoveUserAssignmentDialog")}
                                                           header={t("cardRemoveHeader")}
                                                           icon="pi pi-trash"
                                                           style={{scale: "0.6"}}
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
