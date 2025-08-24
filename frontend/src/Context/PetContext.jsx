import React from "react";
import { createContext, useEffect, useState, useContext } from "react";
import { UserContext } from "./UserContext";

export const PetContext = createContext(null);

export const PetProvider = (props) => {
    const [ pets, setPets ] = useState([])  // stores only the ids of the pets under current user
    const [ petList, setPetList ] = useState([])    // stores entire details of the pets under current user, and is sent to Dashboard.jsx

    const { user } = useContext(UserContext)

    const isDuplicate = (curr_details) => {
        return petList.some(pet => pet._id === curr_details._id)    // function to ensure duplicate values are not added
    }

    // Get the id of the user logged in
    useEffect(() => {
        if(user && user._id){
            // clear any old data
            setPets([])
            setPetList([])
            const getPets = async (user_id) =>{
                const res = await fetch(`api/pets/${user_id}`,{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const result = await res.json()
                setPets(result.pets)
            }
            getPets(user._id)
        }
    }, [user])

    // Get the details of all the pets under the current user
    useEffect(() => {
        const getPetDetails = async (pet) => {
            const res = await fetch(`api/petdetails/${pet}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await res.json()
            if(!isDuplicate(data.details)){
                setPetList(petList => [...petList, data.details])
            }
        }
        if(pets.length>0){
            pets.map((pet) =>  {
                getPetDetails(pet)
            })
        }
    }, [pets])

    return (
        <PetContext.Provider value={{ petList, setPetList }}>
            {props.children}
        </PetContext.Provider>
    )
}