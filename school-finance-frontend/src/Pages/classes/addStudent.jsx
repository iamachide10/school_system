import { useState ,useEffect} from "react";
import FullScreenLoader from "../../components/loader";
import { useParams } from "react-router-dom";

export const AddStudent=()=>{
    const [fullName,setFullName]=useState("")
    const[defaultFee,setDefaultFee]=useState(0)
    const [loading,setLoading]=useState(false)
    const [success,setSuccess]=useState("")
    const {class_id ,class_name}=useParams()

    const handleSubmmit=async(e)=>{

        const data={
          selectedClassId:class_id,
          defaultFee,
          fullName
        }

        console.log(data);

        const url="https://school-system-backend-78p1.onrender.com/api/student/create_student"

        const options={
          method:"POST",
           headers:{
                "Content-Type":"application/json"
            },
          body:JSON.stringify(data)
        }
        setLoading(true)
        try{
          const res=await fetch(url ,options)
          if(res.ok){
            setLoading(false)
            setSuccess("Student added successfully")
          }
        }catch(e){
          console.log(e);
        }
        setLoading(false)
    }


    if(loading) return <FullScreenLoader/>
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-white p-4">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 space-y-6 border border-green-200">
    
          <h2 className="text-3xl font-bold text-center text-green-700">
            Add New Student
          </h2>
    
          <p className="text-center text-gray-600 text-sm">
            Fill in the details below to add a student to the system.
          </p>
    
          <div className="space-y-5">
    
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Ama Serwaa"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-4 py-2 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
    
            {/* Default Fees */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Default Fees
              </label>
              <select
                value={defaultFee}
                onChange={e => setDefaultFee(e.target.value)}
                className="w-full px-4 py-2 border border-green-300 rounded-xl bg-white focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                <option value="">Select default fee</option>
                <option value="11">₵11</option>
                <option value="5">₵5</option>
              </select>
            </div>
    
            {/* Class Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Class: {class_name}
              </label>

            </div>

            <button
            onClick={(e)=>handleSubmmit(e)}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200"
          >
            Add Student
          </button>

            {success && (
            <p className="text-green-600 text-sm mt-2 bg-green-100 p-2 rounded">
              {success}
            </p>
            )}
    
          </div>
    
        </div>
      </div>
    );
}


