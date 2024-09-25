import React, { useEffect, useState } from "react";
import {  Routes, Route ,useNavigate,useLocation } from "react-router-dom";
import "./index.css";
import Login from "./Pages/Login";
import Home from "./Components/Home/Home";
import WatchRoom from "./Components/WatchRoom/WatchRoom";
import { SnackbarProvider } from "./Components/SnackBar";
import axios from "axios";
import WatchRoomP from "./Pages/WatchRoom";



const auth= axios.create({
  baseURL:process.env.REACT_APP_BACKEND_URL,
  withCredentials: true
})
auth.interceptors.request.use((request)=>{
  console.log(request)
  // if(request.headers.cookie){
  //   redirect('/login')
  // }
  return request
},(error)=>{
  return Promise.reject(error)
})
function App() {
  const navigate = useNavigate()
  const location = useLocation();
  const [auth,setAuth]=useState(false)
  const validateToken= async ()=>{
    try{
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user`,{withCredentials:true}).then((resp)=>{
        if(resp.status===200){
          setAuth(true)
          if(localStorage){
            // localStorage.setItem('role',resp?.data.user.role)
            localStorage.setItem('id',resp?.data.user.userId)
            localStorage.setItem('email',resp?.data.user.email)
            // window.location.reload(true)
          }
          else{
            const redirectUrl = encodeURIComponent(location.pathname + location.search);
            navigate(`/login?redirect_url=${redirectUrl}`);
          }
        }
        
      }).catch(function (err){
        const redirectUrl = encodeURIComponent(location.pathname + location.search);
      navigate(`/login?redirect_url=${redirectUrl}`);
      console.log(err);
        // navigate('/login')
      })
    }
    catch(err){
      const redirectUrl = encodeURIComponent(location.pathname + location.search);
      navigate(`/login?redirect_url=${redirectUrl}`);
      // console.log(err);
      // navigate('/login')
      console.log(err)
    }
  }

  useEffect( ()=>{
      validateToken()
      // console.log(cookie)
      // if(cookie.includes('jwt')){
      //   setAuth(true)
      // }
      // else{
      //   navigate('/login')
      // }
  },[])
  return (
    <SnackbarProvider>
        <Routes>
          {/* {auth && <Route path="/" element={<Home />} />  } */}
          {/* {auth && (role==='systemAdministrator' || role==='assistantRegistrar' || role==='facultyMentor') &&  <Route path="/requests" element={<Request />} /> }
          {auth && role==='gsec' && role!=='guard'  && <Route path="/book" element={<BookLt />} /> }
          {auth &&  role==='gsec'&& role!=='guard' && <Route path="/reqLogs" element={<ReqLogs />} /> } */}
          <Route path="/login" element={<Login setAuth={setAuth}/>} />

          {auth && <Route path="/" element={<Home />} />}
          {auth && <Route path="/room/:roomId" element={<WatchRoomP />} />}

          {/* <Route path="/logout" element={<Logout/>} /> */}
         
          
        </Routes>
    </SnackbarProvider>
  )
}

export default App