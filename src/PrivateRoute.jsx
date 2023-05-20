import React from "react";
import {Route, Navigate} from 'react-router-dom';

const PrivateRoute = ({ element:Element, ...rest}) => {
    const isAuthenticated = false;
    return(
        <Route {...rest} render={(props)=>
        isAuthenticated?
        <element {...props} />:
        <Navigate to={'/login'}/>} /> 
    )
}

export default PrivateRoute; 