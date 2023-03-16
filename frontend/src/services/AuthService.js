import {createContext, useState, useEffect} from "react";
import jwt_decode from "jwt-decode";
import ApiService from "./ApiService";
import CommonService from "./CommonService";
import {useUserService} from "../utils/UserServiceContext";
import {useNavigate} from "react-router-dom";


const AuthService = createContext();

export default AuthService;

export const AuthProvider = ({children}) => {
    const [authToken, setAuthToken] = useState(() => localStorage.getItem("authToken") ? JSON.parse(localStorage.getItem("authToken")) : null);
    const [user, setUser] = useState(() => localStorage.getItem("authToken") ? jwt_decode(localStorage.getItem("authToken")) : null);
    const [loading, setLoading] = useState(true);
    const userService = useUserService();
    const navigate = useNavigate();
    const apiService = useUserService();

    const loginUser = async (username, password) => {
        var response = await userService.loginUser(username, password);
        console.log(response)
        let response_data = await response.json();
        if(response.status === 200) {
            setAuthToken(response_data);
            setUser(jwt_decode(response_data.access).user_data);
            localStorage.setItem("authToken", JSON.stringify(response_data));
            navigate("/");
            window.PrimeToast.show({
                severity: 'success',
                summary: 'Sukces',
                detail: "Zalogowano pomyślnie",
                life: 3000
            });
        } else {
            window.PrimeToast.show({
                severity: 'warn',
                summary : 'Ostrzeżenie',
                detail  : "Nieprawidłowy login lub hasło",
                // detail  : response_data.detail,
                life    : 3000
            });
        }
    };

    const registerUser = async (username, password, password2) => {
        const response_data = await apiService.createUser(username, password);
        if(response_data.status === 200) {
            window.PrimeToast.show({
                severity: 'success',
                summary: 'Sukces',
                detail: "Udało się założyć konto",
                life: 3000
            });
            navigate("/");
        }
        if(response_data.status === 400) {
            window.PrimeToast.show({
                severity: 'error',
                summary: 'Błąd',
                detail: response_data.detail,
                life: 3000
            });
        }
    };

    const logoutUser = () => {
        setAuthToken(null);
        setUser(null);
        localStorage.removeItem("authToken");
    };

    const contextData = {
        user,
        setUser,
        authToken,
        setAuthToken,
        registerUser,
        loginUser,
        logoutUser
    };

    useEffect(() => {
        if(authToken) {
            setUser(jwt_decode(authToken.access).user_data);
        }
        setLoading(false);
    }, [authToken, loading]);

    return (
        <AuthService.Provider value={contextData}>
            {loading ? null : children}
        </AuthService.Provider>
    );
};