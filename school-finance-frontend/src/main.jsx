import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './context/authContext.jsx';
import { ClassProvider } from './context/classContext.jsx';



createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <StrictMode>
    <ClassProvider>
    < AuthProvider>
    <App />
    </AuthProvider>
    </ClassProvider>
  </StrictMode>l
  </BrowserRouter>
)
