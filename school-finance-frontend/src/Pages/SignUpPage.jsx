import { useState } from "react"

const SignUp=()=>{
    const [name,setName]=useState("")
    const [email, setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [role,setRole]=useState("teacher")

    const onSubmit =async(e)=>{
        e.preventDefault()
        const data={
            name,
            email,
            password,
            role
        } 

        if(!name || !email || !password || !role) return alert("Fill all options")
        
        const url= "http://localhost:5000/api/users/register"
        const options={
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(data)
        }
        try{
            const result = await fetch(url,options)
            if(result.ok){
                alert("It was ok.")
            }
        }catch(e){
            alert(e)
        }
    }


    return(
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-whit
    p-4">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 space-y-6 border border-green-200">
            <h2 className="text-3xl font-bold text-center text-green-700">Create Account</h2>
            <p className="text-center text-gray-600 text-sm"> Join our school portal in seconds.
            </p>

            <form className="space-y-5" onSubmit={e=>onSubmit(e)}>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                    <input type="text" placeholder="Enter your full name" 
                    className="w-full px-4 py-2 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 
                    focus:outline-none"
                    onChange={e=>setName(e.target.value)} value={name}/>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email </label>
                    <input type="email" placeholder="Enter your full name" 
                    className="w-full px-4 py-2 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 
                    focus:outline-none" 
                    onChange={e=>setEmail(e.target.value)} value={email}/>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                    <input type="password" placeholder="Enter your full name" 
                    className="w-full px-4 py-2 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 
                    focus:outline-none" 
                    onChange={e=>setPassword(e.target.value)} value={password}/>
                </div>


                <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Select Role</label>
                    <select className="w-full px-4 py-2 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none" 
                      onChange={e=>setRole(e.target.value)}>
                    <option value="teacher">Teacher</option>
                    <option value="other">Other</option>
                    <option value="accountant">Accountant</option>
                    <option value="headmaster">Headmaster</option>
                    </select>
                </div>
                <button type="submit"
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold 
                rounded-xl shadow-lg transition-all duration-200">
                    Sign Up
                </button>
            </form>
        <p className="text-center text-sm text-gray-600">
            Already have an account?{'  '}
            <a href="#" className="text-green-700 font-semibold hover:underline">
            Log In
            </a>
        </p>
        </div>

    </div> 
    )
}

export default SignUp