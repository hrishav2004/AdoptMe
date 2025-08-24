import React from "react";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const ProtectFromAuthenticatedUsers = ({ children }) =>{
    const [ isAuthenticated, setIsAuthenticated ] = useState(null)

    useEffect(() => {
        const checkLoggedIn = async () => {
            try{
                const res = await fetch('https://adoptme-bk01.onrender.com/api/users', {
                    method: 'GET'
                })
                if(res.ok){
                    setIsAuthenticated(true)
                }
                else{
                    setIsAuthenticated(false)
                }
            }
            catch (err){
                setIsAuthenticated(false)
            }
        }

        checkLoggedIn();
    }, [])

    if(isAuthenticated===null){
        return <div>Loading...</div>
    }

    if(isAuthenticated){
        return <Navigate to="/" replace />;
    }

    return children
}

export default ProtectFromAuthenticatedUsers;