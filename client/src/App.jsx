import React from "react";

import { Link } from "react-router-dom";
import "./App.css";
import { GoogleLogin } from "@react-oauth/google";

const App = () => {
  return (
    <div className="main">
      <div className="main-box">
        <h1>Welcome to Chat App</h1>
        <div>
          <Link to="login" className="login">
            <p>Login</p>
          </Link>
          <Link to="signup" className="login">
            <p>SignUp</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default App;