import React, {useContext } from 'react'
import { Link } from "react-router-dom";
import 'primeicons/primeicons.css';
import AuthService from "../services/AuthService";
import styled, {createGlobalStyle} from 'styled-components';
import {InputText,Checkbox} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import { useTranslation } from 'react-i18next';
import LanguageChoose from "./LanguageChoose";


const RegisterHeader = styled.h1`
  text-shadow: 3px 3px #4f46e5;
  text-align: center;
  margin-top: 35px;
  font-size: 350%;
  text-transform: uppercase;
  justify-content: center;
  padding: 5px;
  color: #ffffff;
`;

const GlobalStyle = createGlobalStyle`
  body {
    box-sizing: border-box;
    font-family: Verdana;
    color: #232323;
    background-color: #aec5de;
    /*
    background-color: #a2c0e0;
    */
    font-size: 115% !important;
    scroll-margin-left: 0;
  }
`
const RegisterPage = styled.div`
  //display: flex;
  //justify-content: center;
  //align-items: center;
  //height: 200px;
  display: flex;
  flex-direction: column;
  word-wrap: break-word;
  justify-content: center;
  align-items: center;
  height: 90vh;
`;
const TitleRegister= styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  //height: 200px;

`;
const LanguageDropdown = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
`;

function Register(props) {
    const { t, i18n } = useTranslation();
    const { registerUser } = useContext(AuthService);
    const handleSubmit = e => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    const password2 = e.target[2].value;
    if (username.length <= 0){
        window.PrimeToast.show({
            severity: 'warn',
            summary: t("error"),
            detail: t("registerErrorUsernameNotEntered"),
            life: 3000
        });
    } else if (password!==password2){
        window.PrimeToast.show({
            severity: 'warn',
            summary: t("error"),
            detail: t("registerErrorNotMatchingPasswords"),
            life: 3000
        });
    }else{
        registerUser(username, password, password2);
    }
  };
  return (
      <RegisterPage>
          <GlobalStyle whiteColor/>
          <LanguageDropdown>
              <LanguageChoose/>
          </LanguageDropdown>
          <TitleRegister>
          <RegisterHeader>{t("registerHeader")}</RegisterHeader>
          </TitleRegister>
          <div className="surface-card p-6 shadow-5 border-round w-full lg:w-4">
              <div className="text-center mb-5">
                  <span className="text-700 font-large line-height-3">{t("registerDescription")}</span>
                  <Link to="/login" className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">{t("loginAccountCreationLink")} </Link>
              </div>
          <form onSubmit={handleSubmit}>
              <div>
                  <label htmlFor="username" className="block text-900 font-large mb-3">{t("loginUsername")}</label>
                  <InputText id="username" type="text" placeholder={t("loginUsernameInput")} className="w-full mb-3" />
                  <label htmlFor="password" className="block text-900 font-large mb-3">{t("loginPassoword")}</label>
                  <InputText  type="password" id="password" placeholder={t("loginPassowordInput")} className="w-full mb-3" />
                  <label htmlFor="password2" className="block text-900 font-large mb-3">{t("registerRepeatPassword")}</label>
                  <InputText  type="password" id="password2" placeholder={t("registerRepeatPasswordInput")} className="w-full mb-3" />
                  <Button type="submit" label={t("registerButton")} icon="pi pi-user" className="w-full" />
              </div>
          </form>
          </div>
      </RegisterPage>
  );
}

export default Register;