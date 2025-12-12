import { useContext, createContext, useEffect, useState } from "react"


const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
const [user, setUser] = useState("")
const [token, setToken] = useState("")
const [userId, setUserId] = useState("")
const [role,setRole]=useState("")

const login = (userData) => {
console.log(userData.existingUser.id)
localStorage.setItem("user_id", String(userData.existingUser.id))
localStorage.setItem("role",userData.existingUser.role)
localStorage.setItem("user", userData.existingUser.name)
localStorage.setItem("token", userData.existingUser.token)  
if(userData.existingUser.role==="teacher"){
  window.location.href="/classes"// FIXED
}else if(userData.existingUser.role==="accountant"){
    window.location.href="/accountant-dashboard"
  }else {
  window.location.href="/head-dashboard"
  
}

}

const logOut = () => {
setUser(null)
setToken(null)
localStorage.removeItem("user_id")
localStorage.removeItem("user")
localStorage.removeItem("token")
window.location.href = "/"
}

useEffect(() => {
const storedUser = localStorage.getItem("user")
const storedId = localStorage.getItem("user_id")
const storedToken = localStorage.getItem("token")
const storedRole = localStorage.getItem("role")


if (storedUser && storedToken) {
  setUser(storedUser)
  setToken(storedToken)
  setUserId(storedId)
  setRole(storedRole)
}

}, [])

return (
<AuthContext.Provider value={{ user, token, login, logOut, userId,role }}>
{children}
</AuthContext.Provider>
)
}

export const useAuth = () => useContext(AuthContext)


export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};
