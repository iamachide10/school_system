import { CreateClass } from "./Pages/classes/CreateClass"
import SignUp from "./Pages/authPages/SignUpPage"
import LoginForm from "./Pages/authPages/SingInPage"
import { Route,Routes } from "react-router-dom"
import AccountDashboard from "./Pages/Dasboards/AccountantDashBoard"
import { AddStudent } from "./Pages/classes/addStudent"
import { Classes } from "./Pages/classes/classesPage"
import ClassDetails from "./Pages/classes/classDetailsPage"
import LandingPage from "./Pages/landingPage"
import { useState ,useEffect} from "react"
import Navbar from "./components/navBar"
import { useAuth } from "./context/authContext"
import StudentsList from "./Pages/classes/studentsList"
import { SessionPage } from "./Pages/sessionPages/sessionPage"
import StudentProfile from "./Pages/classes/studentDetails"
import EmailVerification from "./Pages/authPages/verificationPage"
import ForgotPassword from "./Pages/authPages/requestRestPasswordPage"
import ResetPassword from "./Pages/authPages/changePasswordPage"
import SessionDetails from "./Pages/sessionPages/SessionDetails"
import HeadmistressDashboard from "./Pages/Dasboards/headDashboard"


export default function App() {
      const [onLog, setOnLog]=useState(false)

    const {user}=useAuth()

    useEffect(()=>{
      if(user){
        setOnLog(true)
      }else{
        setOnLog(false)
      }
    },[user])
 


  return (
    <div>
    <Navbar isLoggedIn={onLog} />
    <Routes>
      <Route path="/reset_password/:token" element={  <ResetPassword/>  } />
      <Route path="/" element={  <LandingPage/>  } />
      <Route path="/students/profile/:student_id" element={  <StudentProfile />  } />
      <Route path="/signup" element={  <SignUp/>  } />
      <Route path="/verify_email/:token" element={  <EmailVerification/>  } />
      <Route path="/classes/:id/:class_name" element={  <ClassDetails/>  } />
      {/* <Route path="/test-loader" element={  <FullScreenLoader/>  } /> */}

      <Route path="/session/:session_id" element={  <SessionDetails/>  } />
      <Route path="/classes/students/:id" element={  <StudentsList/>  } />
      <Route path="/classes/sessions/:class_id/:teacher_id" element={  <SessionPage/>  } />
      <Route path="/classes/add_student/:class_id/:class_name" element={  <AddStudent/>  } />
      <Route path="/add_class" element={  <CreateClass/>  } />
      <Route path="/forgot-password" element={  <ForgotPassword/>  } />
      <Route path="/classes" element={  <Classes/>  } />
      <Route path="/head-dashboard" element={ <HeadmistressDashboard/> }/>
      <Route path="/signin" element={  <LoginForm/> } />
      <Route path="/accountant-dashboard" element={ <AccountDashboard/> }/>
    </Routes>
    </div>
  )
}
