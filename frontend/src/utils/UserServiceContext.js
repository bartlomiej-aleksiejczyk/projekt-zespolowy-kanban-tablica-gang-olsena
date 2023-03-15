import axios from "axios";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import {useContext} from "react";
import AuthService from "../services/AuthService";
import ApiService from "../services/ApiService";
import {createContext, useEffect} from 'react';


const baseURL = "http://127.0.0.1:8000/api";

// Local axios instance
const axiosInstance = axios.create({
    baseURL: baseURL, // set the base URL once here
});

const userServiceInstance = new ApiService(axiosInstance);

const UserServiceContext = createContext(userServiceInstance);

// Convenience hook
export const useUserService = () => useContext(UserServiceContext);

export const UserServiceProvider = (props) => {
    const {authToken, setUser, setAuthToken} = useContext(AuthService);

    axiosInstance.defaults.headers
        .common['Authorization'] = `Bearer ${authToken.access}`;

    useEffect(() => {
            axiosInstance.interceptors.request.use(async req => {
                const user = jwt_decode(authToken.access);
                const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

                if(!isExpired) return req;

                const response = await axios.post(`${baseURL}/token/refresh/`, {
                    refresh: authToken.refresh
                });

                localStorage.setItem("authToken", JSON.stringify(response.data));

                setAuthToken(response.data);
                setUser(jwt_decode(response.data.access));

                req.headers.Authorization = `Bearer ${response.data.access}`;
                return req;
            });
        }, [authToken, setUser, setAuthToken]
    );

    return (
        <UserServiceContext.Provider value={userServiceInstance} {...props} />
    );
}