import { useState } from "react"
import BACKEND_URL from "../../utils/backend"



export  const CreateClass=()=>{
    const [className, setClassName]=useState("")
    const[ classNumber,setClassNumber]=useState(0)

    const handleSubmit=async(e)=>{
        e.preventDefault()
        const data={
        className,
        classNumber
        }
      
        const url= `${BACKEND_URL}/api/classes/create_class`

        const option={
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        }
        try{
            const result= await fetch(url, option)
            if(result.ok){
                console.log("It worked");
            }
        }catch(e){
            console.log(e);
        }
    }



return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-white p-4">
    <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 space-y-6 border border-green-200">
      <h2 className="text-3xl font-bold text-center text-green-700">Add New Class</h2>
      <p className="text-center text-gray-600 text-sm">
        Enter the class name below and submit to save.
      </p>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Class Name</label>
          <input
            type="text"
            value={className}
            onChange={e => setClassName(e.target.value)}
            placeholder="e.g. Basic 1, JHS 2, SHS 3"
            className="w-full px-4 py-2 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>
           <select
                value={classNumber}
                onChange={e=>setClassNumber(e.target.value)}
                className="w-full px-4 py-2 border border-green-300 rounded-xl bg-white focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                <option value="">Class Number</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>

        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
);

}