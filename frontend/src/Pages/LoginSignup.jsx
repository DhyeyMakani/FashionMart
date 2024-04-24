import React, { useState } from 'react'
import './CSS/LoginSignup.css'
import { useContextValue } from './../ContextProvider.jsx';

const BACKEND = process.env.REACT_APP_BACKEND;

const LoginSignup = () => {

    const [state, setState]= useState("Login");
    const [formData, setFormData]= useState({
      username:"",
      password:"",
      email:""
    })

    const {loggedInUserName, setLoggedInUserName} = useContextValue("loginInfo");

    const changeHandler = (e)=>{
      setFormData({...formData,[e.target.name]:e.target.value})
    }

    // add the api for login-signup page
    const login=async ()=>{
      // console.log("Login",formData);
      let responseData;
      await fetch(`${BACKEND}/login`, {
        method:'POST',
        headers:{
          Accept:'application/form-data',
          'Content-Type':'application/json',
        },
        body:JSON.stringify(formData),
      }).then((response)=>response.json()).then((data)=>responseData=data)

      if(responseData.success)
      {
        localStorage.setItem('auth-token',responseData.token);
        setLoggedInUserName(formData.username);

        alert("Welcome "+formData.username+"!")

        // after the successfull authentication we will logged in our webpage and send the user to home page
        window.location.replace("/");
      }
      else{
        alert(responseData.errors);
      }
    }

    const signup=async ()=>{
      // console.log("S Login",formData);
      let responseData;
      await fetch(`${BACKEND}/signup`, {
        method:'POST',
        headers:{
          Accept:'application/form-data',
          'Content-Type':'application/json',
        },
        body:JSON.stringify(formData),
      }).then((response)=>response.json()).then((data)=>responseData=data)

      if(responseData.success)
      {
        localStorage.setItem('auth-token',responseData.token);

        // after the successfull authentication we will logged in our webpage and send the user to home page
        window.location.replace("/");
      }
      else{
        alert(responseData.errors);
      }
    }


  return (
    <div className='loginsignup'>
      <div className='loginsignup-container'>
        <h1>{state}</h1>

        <div className="loginsignup-fields">
          {true?<input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder='Your Name'/>:<></>}
          <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder='Email Address'/>
          <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder='Password'/>
        </div>

        <button onClick={()=>{state==="Login"?login():signup()}}>Continue</button>

        {state==="Sign Up"?<p className="loginsignup-login">
          Already have an account? <span onClick={()=>{setState("Login")}}>Login here</span>
        </p>:<p className="loginsignup-login">
          Create an account? <span onClick={()=>{setState("Sign Up")}}>Click here</span>
        </p>}

        <div className="loginsignup-agree">
          <input type="checkbox" name='' id=''/>
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  )
}

export default LoginSignup
