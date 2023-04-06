import React, { useState } from "react";
import { Dropdown } from 'primereact/dropdown';
import { useTranslation } from 'react-i18next';
import i18n from "i18next";
import Flag from 'react-world-flags'
import styled from 'styled-components';


function LanguageChoose () {

    const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
    const languages = [
        {value: "en", name: "English", img:"us"},
        {value: "pl", name: "Polski", img:"pl"},
    ]
    const selectedCountryTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <Flag code={ option.img } height="20" />
                    <div className="pl-3">{option.name}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const countryOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <Flag code={ option.img } height="20" />
                <div className="pl-3">{option.name}</div>
            </div>
        );
    };
    return (
        <div className="inline mr-3 text-center align-items-center">
            <Dropdown value={selectedLanguage}
                      onChange={(e) => {
                          i18n.changeLanguage(e.value).then(
                                  (e) => {setSelectedLanguage(i18n.language); // -> same as i18next.t
                                  },
                              )
                      }  }
                      options={languages}
                      optionLabel="name"
                      placeholder="Select a language"
                      valueTemplate={selectedCountryTemplate}
                      itemTemplate={countryOptionTemplate}
                      style={{height:"60px", backgroundColor:"#f9f7ff"}}
                      className="w-full md:w-14rem align-items-center" />
        </div>
    )
}

export default LanguageChoose;

// i18n.changeLanguage('en-US');