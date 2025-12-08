import { useState ,useEffect} from "react";


export const AddStudent=()=>{
    const [fullName,setFullName]=useState("")
    const[defaultFee,setDefaultFee]=useState(0)
    const [selectedClassId,setSelectedClass]=useState("")
    const [classes ,setClasses]=useState([])


    useEffect(()=>{
            const getStudentsClasses=async()=>{
                try{
                    const request= await fetch("https://school-system-backend-78p1.onrender.com/api/classes/getallclasses")
                    const data= await request.json()
                    if(request.ok){
                        setClasses(data.result) 
                    }
                }catch(e){
                    console.log(e);
                }
            }
            getStudentsClasses()
      },[])

    const handleSubmmit=async(e)=>{

        const data={
          selectedClassId,
          defaultFee,
          fullName
        }

        const url="https://school-system-backend-78p1.onrender.com/api/student/create_student"

        const options={
          method:"POST",
           headers:{
                "Content-Type":"application/json"
            },
          body:JSON.stringify(data)
        }
        try{
          const res=await fetch(url ,options)
          if(res.ok){
            alert("Yes")
          }
        }catch(e){
          console.log(e);
          
        }

        

    }

    
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
                Class
              </label>
              <select
                value={selectedClassId}
                onChange={e => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2 border border-green-300 rounded-xl bg-white focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                <option value="">Select class</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <button
            onClick={(e)=>handleSubmmit(e)}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200"
          >
            Add Student
          </button>
    
          </div>
    
        </div>
      </div>
    );
}


