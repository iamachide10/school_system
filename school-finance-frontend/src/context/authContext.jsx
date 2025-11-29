import { useContext, createContext, useEffect, useState } from "react"


const AuthContext=createContext()

export const AuthProvider=({children})=>{
     const [user,setUser]=useState("")
     const [token, setToken]=useState("")
     const [userId,setUserId]=useState("")


    const login=(userData)=>{
        console.log(userData.existingUser.id);
        localStorage.setItem("user_id" ,JSON.stringify(userData.existingUser.id))
        localStorage.setItem("user" ,JSON.stringify(userData.existingUser.name))
        localStorage.setItem("token" ,JSON.stringify(userData.existingUser.token))
    }

  
    const logOut = () => {
        setUser(null);   
        setToken(null)
        localStorage.removeItem("user_id"); 
        localStorage.removeItem("user"); 
        localStorage.removeItem("token")
        window.location.href="/"
    };


    useEffect(()=>{
        const storedUser=localStorage.getItem("user")
        const user_id=localStorage.getItem("user_id")
        const token=localStorage.getItem("token")
        if(storedUser && token ){
            setUser(JSON.parse(storedUser))
            setToken(JSON.parse(token))          
            setUserId(JSON.parse(user_id))          
        }
    },[])

    return(
        <AuthContext.Provider value={{user,token ,login ,logOut ,userId}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth=()=>{
    return useContext(AuthContext)

}