import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import React from 'react';
import 'primeflex/primeflex.css';
import {Route, Routes} from "react-router-dom";
import AuthRoute from "../utils/AuthRoute";
import Login from "./Login";
import {UserServiceProvider} from "../utils/UserServiceContext";
import Kanban from "./Kanban";
import Register from "./Register";

function Main() {
    return (

            <Routes>
                        <Route exact path='/' element={<AuthRoute/>}>
                            <Route exact path='/' element={<Kanban/>}/>
                        </Route>
                        <Route element={<Login/>} path="/login"/>
                        <Route element={<Register/>} path="/register" />
            </Routes>
    )
}

export default Main