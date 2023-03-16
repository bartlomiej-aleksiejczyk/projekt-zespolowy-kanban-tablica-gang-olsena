import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import React, {useRef, useLayoutEffect} from 'react';
import Main from "./components/Main";
import 'primeflex/primeflex.css';
import {Toast} from 'primereact/toast';
import {AuthProvider} from "./services/AuthService";
import {BrowserRouter as Router } from "react-router-dom";


function App() {
    const toast = useRef(null);

    useLayoutEffect(() => {
        window.PrimeToast = toast.current || {};
    }, []);


    return (
        <Router>
            <Toast ref={toast} position="bottom-right"/>
            <AuthProvider>
                <Main/>
            </AuthProvider>
        </Router>
    )
}

export default App;
