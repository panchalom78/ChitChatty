import React from "react";

import { Link } from "react-router-dom";
import "./App.css";

const App = () => {
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