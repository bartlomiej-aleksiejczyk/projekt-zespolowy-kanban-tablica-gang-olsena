import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import React, {useRef, useLayoutEffect,useEffect, Suspense} from 'react';
import Main from "./components/Main";
import 'primeflex/primeflex.css';
import {Toast} from 'primereact/toast';
import {AuthProvider} from "./services/AuthService";
import {BrowserRouter as Router } from "react-router-dom";
import Loading from "./components/Loading";
import * as timeago from 'timeago.js';
import pl from 'timeago.js/lib/lang/pl';

// register it.
timeago.register('pl', pl);

function App() {
    const toast = useRef(null);
    const ref2 = useRef(null);

    useEffect(() => {
        window.PrimeToast = toast.current;
    }, []);


    return (
        <Router>
            <Toast ref={toast} position="bottom-right" />

            <AuthProvider>
                <Main/>
            </AuthProvider>
        </Router>
    )
}

export default App;
