import React from 'react'
import LoginSection from '../Components/Login/LoginSection'


function Login({setAuth}) {
    return (
        <>
        <LoginSection setAuth={setAuth}/>
        </>
    )
}

export default Login