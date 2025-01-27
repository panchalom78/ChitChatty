import React, { useEffect } from "react";
import axios from '../utils/axiosInstance';
import { Link } from "react-router-dom";
import styles from './App.module.css'
import { authenticateUser } from "../APIPath";

const App = () => {

  const checkUser = async () => {
    const verify = await axios.get(authenticateUser);
    if (verify.data.value) {
      window.location.href = '/home';
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.mainBox}>
        <h1>Welcome to <span className={styles.highlight}>ChitChatty</span>!</h1>
        <p className={styles.subtitle}>A place to connect, share, and explore with friends.</p>
        <div className={styles.ctaButtons}>
          <Link to="login" className={styles.login}>
            <p>Log in</p>
          </Link>
          <Link to="signup" className={styles.signup}>
            <p>Sign up</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default App;
