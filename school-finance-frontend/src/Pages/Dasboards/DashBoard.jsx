import { useAuth } from "../../context/authContext"
import { useEffect,useState } from "react"

export const DashBoard=()=>{

    const {user}=useAuth()

    useEffect(()=>{

        const fetchTest=async()=>{
            const name="j0hn"

            const options={
                method:"POST",
                headers:{
                    "Content-Type":"applica"
                }
            }
        }

    },[])



    
    return( 
        <div>
            {user ? (<h1>Welcome , {user}</h1>) :
            (<p>User not logged in.</p>)}
        </div>
    )
    
}