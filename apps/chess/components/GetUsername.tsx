"use client"
import axios from 'axios'
import { fetchData } from 'next-auth/client/_utils'
import { useState, useEffect } from 'react'

export function GetUserName(){
    

    const [username, setUsername] = useState("")


    useEffect(()=>{

        const fetchData = async () => {
            try {
                const response = await axios.get('/api/user');
                setUsername(response.data.username)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData()
    },[])
    
    return(
        <div className="mt-2 text-white text-xl">
            
               {username}
               
        </div>
    )
}