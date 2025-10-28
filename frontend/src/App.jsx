import React, { useContext } from 'react'
import {Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/Signup'
import Login from './pages/Login'
import Customize from './pages/customize.jsx'
import Customize2 from './pages/customize2.jsx'
import { userDataContext } from './context/userData.jsx'
import Home from './pages/Home.jsx'


function App() {
  const {userData,setUserData}=useContext(userDataContext);
  return (
   <Routes>
    <Route path='/' element={(userData?.assistantImage && 
    userData?.assistantName)? <Home/>  : <Navigate to={"/customize"}/>}/>
    <Route path='/Signup' element={!userData?<SignUp/> : <Navigate to={"/"}/>}/>
    <Route path='/login' element={!userData?<Login/> : <Navigate to={"/"}/>}/>
    <Route path='/customize' element={userData?<Customize/> : <Navigate to={"/login"}/>}/>  
    <Route path='/customize2' element={userData?<Customize2/> : <Navigate to={"/login"}/>}/>  
   </Routes>
  )
}

export default App
