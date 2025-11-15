import SignUp from "./Pages/SignUpPage"
import LoginForm from "./Pages/SingInPage"
import { Route,Routes } from "react-router-dom"


export default function App() {


  return (
    <Routes>
      <Route path="/signup" element={  <SignUp/>  } />
      <Route path="/signin" element={  <LoginForm/> } />
    </Routes>

  )
}
