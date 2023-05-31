import React from "react";
import {Route, Navigate, Outlet} from 'react-router-dom';
import Login from "./login/Login";

const PrivateRoute = () => {
    let loggedIn = false;
    if(loggedIn){
        return <Outlet />
    }else{
        return <Navigate to={"/"}/>
    }
}

export default PrivateRoute; 