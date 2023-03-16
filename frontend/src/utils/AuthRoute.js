import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthService from "../services/AuthService";

const AuthRoute = ({ children, ...rest }) => {
  let { user } = useContext(AuthService);
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default AuthRoute;