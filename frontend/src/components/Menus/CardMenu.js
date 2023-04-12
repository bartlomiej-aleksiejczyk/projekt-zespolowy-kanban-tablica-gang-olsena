import {useTranslation} from 'react-i18next';
import { useState, useEffect, useRef } from "react";
import { Menu } from 'primereact/menu';


function CardMenu(props){
    const {t, i18n} = useTranslation();
    const menu = useRef(null);
    const items = [
        {
            label: 'Options',
            items: [
                {
                    label: t("cardMenuButtonOptionEdit"),
                    icon: 'pi pi-refresh',
                    command: () => {
                    }
                },
                {
                    label: t("cardMenuButtonOptionEdit"),
                    icon: 'pi pi-times',
                    command: () => {
                    }
                },
                {
                    label: t("cardMenuButtonOptionLock"),
                    icon: 'pi pi-times',
                    command: () => {
                    }
                },
                {
                    label: t("cardMenuButtonOptionBug"),
                    icon: 'pi pi-times',
                    command: () => {
                    }
                }
            ]
        }
    ];
    return (
        <Menu model={items} popup ref={menu} />
    )
}

export default CardMenu;