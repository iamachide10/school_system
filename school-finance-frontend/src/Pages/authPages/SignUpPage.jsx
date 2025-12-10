import { useState ,useEffect} from "react"
import FullScreenLoader from "../../components/loader"

const SignUp=()=>{
    const [name,setName]=useState("")
    const [email, setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [role,setRole]=useState("")
    const [selectedClassId ,setSelectedClass]=useState(0)
    const [isTeacher,setIsTeacher]=useState(false)
    const [classes,setClasses]=useState([])
    const [loading,setLoading]=useState(false)

    useEffect(()=>{
        const getStudentsClasses=async()=>{
            setLoading(true)
            try{
                const request= await fetch("https://school-system-backend-78p1.onrender.com/api/classes/getallclasses")
                const data= await request.json()
                if(request.ok){
                    console.log("Data",data.result);
                    setClasses(data.result) 
                }
            }catch(e){
                console.log(e);
            }
            setLoading(false)
        }
        getStudentsClasses()
    },[])

    useEffect(()=>{
        if(role==="teacher"){
            setIsTeacher(true)
        }else{
            setIsTeacher(false)
        }
    },[role])
    

    const onSubmit =async(e)=>{
        e.preventDefault()
        if(!name || !email || !password || !role) return alert("Fill all options")
        const data={
            name,
            email,
            password,
            role,
            ...(isTeacher && {selectedClassId})
        } 
        const url= "https://school-system-backend-78p1.onrender.com/api/users/register"
        const options={
            method:"POST",
            headers:{
                "Content-Type":"application/json"
                
            },
            credentials:"include",
            body: JSON.stringify(data)
        }
        setLoading(true)
        try{
            const result = await fetch(url,options)
            if(result.ok){
                alert("It was ok.")
            }
        }catch(e){
            alert(e)
        }
        setLoading(false)
    }

    if(loading) return <FullScreenLoader/>

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
                    <option value="other">Role</option>
                    <option value="teacher">Teacher</option>
                    <option value="other">Other</option>
                    <option value="accountant">Accountant</option>
                    <option value="headmaster">Headmaster</option>
                    </select>
                </div>

                { isTeacher &&
                <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Select Class</label>
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
                }


                <button type="submit"
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold 
                rounded-xl shadow-lg transition-all duration-200">
                    Sign Up
                </button>
            </form>
        <p className="text-center text-sm text-gray-600">
            Already have an account?{'  '}
            <a href="/signin" className="text-green-700 font-semibold hover:underline">
            Log In
            </a>
        </p>
        </div>

    </div> 
    )
}

export default SignUp