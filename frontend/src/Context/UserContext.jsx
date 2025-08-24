import React from "react";
import { createContext, useContext, useState, useEffect } from "react";

export const UserContext = createContext(null)

export const UserProvider = (props) => {
    const [ user, setUser ] = useState(null)

    const getUser = async () => {
        try {
            const res = await fetch('/api/users', { method: 'GET' });
            const data = await res.json();
            if (res.ok) setUser(data.user);
            else setUser(null);
        } catch (err) {
            console.error("Error fetching user:", err);
            setUser(null);
        }
    };

    useEffect(() => {
        getUser()
    }, [])

    return (
        <UserContext.Provider value={{ user, setUser, getUser }}>
            {props.children}
        </UserContext.Provider>
    )
}