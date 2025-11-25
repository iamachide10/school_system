import { useContext, createContext, useEffect, useState } from "react"


const AuthContext=createContext()

export const AuthProvider=({children})=>{
     const [user,setUser]=useState("")

    const login=(userData)=>{
        console.log(userData.existingUser.name);
        localStorage.setItem("user" ,JSON.stringify(userData.existingUser.name))
    }

  
    const logOut = () => {
        setUser(null);                 
        localStorage.removeItem("user"); // Remove stored info
        window.location.href="/signin"// Redirect to login
    };


    useEffect(()=>{
        const storedUser=localStorage.getItem("user")
        if(storedUser){
            setUser(JSON.parse(storedUser))
            console.log(JSON.parse(storedUser));            
        }
    },[])

    return(
        <AuthContext.Provider value={{user ,login ,logOut}}>
            {children}
        </AuthContext.Provider>
    )


}

export const useAuth=()=>{
    return useContext(AuthContext)

}