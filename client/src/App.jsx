import React, { useEffect } from "react";
import axios from '../utils/axiosInstance';

import { Link } from "react-router-dom";
import "./App.css";
import { authenticateUser } from "../APIPath";

const App = () => {

  const checkUser = async()=>{
    const verify = await axios.get(authenticateUser)
    if(verify.data.value){
      window.location.href = '/home'
    }
  }
  useEffect(()=>{
    checkUser();
  },[])

  return (
    <div className="main">
      <div className="main-box">
        <h1>Welcome to ChitChatty</h1>
        <div>
          <Link to="login" className="login">
            <p>Sign up</p>
          </Link>
          <Link to="signup" className="login">
            <p>Log in</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default App;