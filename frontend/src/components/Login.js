import React, {useContext } from 'react'
import { Link } from "react-router-dom";
import 'primeicons/primeicons.css';
import AuthService from "../services/AuthService";
import styled, {createGlobalStyle} from 'styled-components';
import {InputText,Checkbox} from 'primereact/inputtext';
import {Button} from 'primereact/button';


const LoginHeader = styled.h1`
  text-align: center;
  text-shadow: 3px 3px #4f46e5;
  margin-top: 35px;
  font-size: 350%;
  text-transform: uppercase;
  //justify-content: center;
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
const LoginPage = styled.div`
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
const TitleLogin = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  //height: 200px;

`;


function Login(props) {
  const { loginUser } = useContext(AuthService);
  const handleSubmit = e => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    if (username.length <= 0){
          window.PrimeToast.show({
              severity: 'warn',
              summary: 'Błąd',
              detail: "Nie wprowadzono nazwy użytkownika",
              life: 3000
          });
    }else{
          loginUser(username, password);
      }
  };

  return (
      <LoginPage>
          <GlobalStyle whiteColor/>
          <TitleLogin>
          <LoginHeader>Logowanie</LoginHeader>
          </TitleLogin>
          <div className="surface-card p-6 shadow-5 border-round w-full lg:w-4">
              <div className="text-center mb-5">
                  <div className="text-700 text-3xl font-medium mb-3">Witaj, wpisz dane użytkownika:</div>
                  <span className="text-500 font-large line-height-3">By założyć konto kliknij</span>
                  <Link to="/register" className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">tutaj </Link>
              </div>
          <form onSubmit={handleSubmit}>
              <div>
                  <label htmlFor="username" className="block text-900 font-large mb-3">Nazwa użytkownika:</label>
                  <InputText id="username" type="text" placeholder="Wpisz nazwę" className="w-full mb-3" />
                  <label htmlFor="password" className="block text-900 font-large mb-3">Hasło użytkownika:</label>
                  <InputText  type="password" id="password" placeholder="wpisz hasło" className="w-full mb-5" />
                  <Button type="submit" label="Zaloguj" icon="pi pi-user" className="w-full" />
              </div>
          </form>
          </div>
      </LoginPage>
  );
}

export default Login;