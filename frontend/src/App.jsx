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
        //Naprawiłem bug#1 w ten sposób że żądanie do API zamiast na końcu przenoszenia (onDragEnd) wysyłane są podczas
        // działania (onDragUpdate) jeśli problem będzie występował w przyszłości można wydłużyć animacje, Jedyny efekt
        // uboczny jest taki że biblioteka wysyła w konsoli wiadomości, że nie można usuwac i dodawać elenetów do list
        // podczas przenoszenia Ale zupełnie nie wplywa to na funkcjonowanie
        <div>
            <Toast ref={toast} position="bottom-right"/>
            <Main/>
        </div>
    )
}

export default App;
