import { CreateClass } from "./Pages/CreateClass"
import SignUp from "./Pages/SignUpPage"
import LoginForm from "./Pages/SingInPage"
import { Route,Routes } from "react-router-dom"
import { DashBoard } from "./Pages/DashBoard"
import { AddStudent } from "./Pages/addStudent"
import { Classes } from "./Pages/classesPage"
import ClassDetails from "./Pages/classDetailsPage"
import LandingPage from "./Pages/landingPage"




export default function App() {


  return (
    <div>
    <Routes>
      <Route path="/" element={  <LandingPage/>  } />
      <Route path="/signup" element={  <SignUp/>  } />
      <Route path="/classes/:id" element={  <ClassDetails/>  } />
      <Route path="/add_student" element={  <AddStudent/>  } />
      <Route path="/add_class" element={  <CreateClass/>  } />
      <Route path="/classes" element={  <Classes/>  } />
      <Route path="/signin" element={  <LoginForm/> } />
      <Route path="/dashboard" element={ <DashBoard/> }/>
    </Routes>
    </div>
  )
}
