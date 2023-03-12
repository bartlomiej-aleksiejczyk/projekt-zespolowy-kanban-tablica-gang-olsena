import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import React, {useRef, useLayoutEffect} from 'react';
import Main from "./components/Main";
import 'primeflex/primeflex.css';
import {Toast} from 'primereact/toast';


function App() {
    const toast = useRef(null);

    useLayoutEffect(() => {
        window.PrimeToast = toast.current || {};
    }, []);


    return (
        <div>
            <Toast ref={toast} position="bottom-right"/>
            TEST
            <Main/>
        </div>
    )
}

export default App;
