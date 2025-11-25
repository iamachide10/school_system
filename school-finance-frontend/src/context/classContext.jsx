


import { createContext,useContext, useEffect, useState } from "react";


const ClassContext=createContext()

export const  ClassProvider=({children})=>{
    const [classes,setClasses] =useState([])


    const storeClasses=(classes)=>{
        setClasses(classes)
         const stringfyList=JSON.stringify(classes)
         localStorage.setItem("classes" , stringfyList)
    }

    
    useEffect(()=>{
        const getAllClasses=()=>{
            const retrivedList=JSON.parse(localStorage.getItem("classes"))
            if(retrivedList) setClasses(retrivedList);
                
    }
        getAllClasses()
    },[])

    return( <ClassContext.Provider  value={{storeClasses,classes}}>
        {children}
    </ClassContext.Provider>)
}


export const useCLassContext=()=>{
    return useContext(ClassContext)
}