
import { useEffect, useState } from "react";
import { ClassCard } from "../../components/classCard";
import FullScreenLoader from "../../components/loader";

export  const Classes=()=> {
    //localStorage.removeItem("token");
  const [classes, setClasses] = useState([]);
  const [loading,setLoading]=useState(false)

  useEffect(()=>{
    const getAllClasses=async()=>{
      setLoading(true)
      try{

        const result =await fetch("https://school-system-backend-78p1.onrender.com/api/classes/getallclasses")
  
        const data = await result.json()
        if(result.ok){
          setClasses(data.result)
        }
      }catch(e){
        console.log("Error :" ,e);
        
      }
      setLoading(false)
    }
    getAllClasses() 
  },[])


  if(loading) return <FullScreenLoader/>

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-6">
      <h1 className="text-4xl font-bold text-green-700 text-center mb-10">
        All Classes
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {classes.length > 0 ? (
          classes.map(item => <ClassCard key={item.id} item={item} />)
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No classes yet.
          </p>
        )}
      </div>
    </div>
  );
}
