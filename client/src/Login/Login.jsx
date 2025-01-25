import React, { useState,useEffect } from "react";
import axios from "../../utils/axiosInstance";

import { useNavigate, Link } from "react-router-dom";
import { host, loginPath ,authenticateUser} from "../../APIPath";
import { Flip, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../utils/AuthProvider";
import styled from "styled-components";

export const Login = () => {

  const checkUser = async()=>{
    const verify = await axios.get(authenticateUser)
    if(verify.data.value){
      window.location.href = '/home'
    }
  }
  useEffect(()=>{
    checkUser();
  },[])


  const { signIn, setUser } = useAuth();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    theme: "dark",
    transition: Flip,
  };
  const [user, setUser1] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  function updateChange(event) {
    const { name, value } = event.target;
    setUser1((prev) => {
      return { ...prev, [name]: value };
    });
  }

  function validateEmailStrict(email) {
    const strictEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return strictEmailRegex.test(email);
  }

  async function validateUser(e) {
    e.preventDefault();
    const data = { Email: user.Email, Password: user.Password };

    const Confirm = user.Confirm;

    if (!user.Email || !user.Password) {
      toast.error("Please enter valid Email and Pass", toastOptions);
      return;
    }

    if (!validateEmailStrict(user.Email)) {
      toast.error("Please enter a valid email address", toastOptions);
      return;
    }

    if (user.Password !== Confirm) {
      toast.error("Passwords do not match!", toastOptions);
      return;
    }
    setIsLoading(true);

    try {
      const isUser = await axios.post(loginPath, data);
      const value = isUser.data.value;

      if (value) {
        toast.info("User already exists", toastOptions);
      } else {
        navigate("/profile");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.", toastOptions);
    } finally {
      setIsLoading(false);
    }
  }

  const login = () => {
    window.open(`${host}/auth/google/callback`, "_self");
  };

  return (
    <>
      <StyledWrapper>
        <div className="form-container">
          <p className="title">Signup</p>
          <form className="form" onSubmit={validateUser} method="POST">
            <div className="input-group">
              <label htmlFor="username">Email</label>
              <input
                type="email"
                name="Email"
                id="username"
                onChange={updateChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="Password"
                id="password"
                onChange={updateChange}
              />
            </div>
            <div className="input-group" style={{ marginBottom: "1rem" }}>
              <label htmlFor="password">Confirm Password</label>
              <input type="password" name="Confirm" onChange={updateChange} />
              {/* <div className="forgot">
                <a rel="noopener noreferrer" href="#">
                  Forgot Password ?
                </a>
              </div> */}
            </div>
            {/* <button className="sign">Sign in</button> */}
            {/* <input type="submit" value={isLoading ? "" : "Sign up"} className={`sign ${isLoading ? "loading" : ""}`} disabled={isLoading}/> */}
            <button type="submit" className={`sign ${isLoading ? "loading" : ""}`} disabled={isLoading}>Sign Up </button>
          </form>
          <div className="social-message">
            <div className="line" />
            <p className="message">Login with social accounts</p>
            <div className="line" />
          </div>
          <div className="social-icons">
            <button
              aria-label="Log in with Google"
              className="icon"
              onClick={login}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                className="w-5 h-5 fill-current"
              >
                <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z" />
              </svg>
            </button>
          </div>

          <p className="signup">
            Already have an account?
            <Link to="/signup">Log in</Link>
          </p>
        </div>
      </StyledWrapper>
      <ToastContainer />
    </>
  );
};

const StyledWrapper = styled.div`
  width: 30vw;
  .form-container {
    border-radius: 0.75rem;
    background-color: rgba(17, 24, 39, 1);
    padding: 2rem;
    color: rgba(243, 244, 246, 1);
  }

  .title {
    text-align: center;
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: 700;
  }

  .form {
    margin-top: 1.5rem;
  }

  .input-group {
    margin-top: 0.25rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  .input-group label {
    display: block;
    color: rgba(156, 163, 175, 1);
    margin-bottom: 4px;
  }

  .input-group input {
    width: 100%;
    border-radius: 0.375rem;
    border: 1px solid rgba(55, 65, 81, 1);
    outline: 0;
    background-color: rgba(17, 24, 39, 1);
    padding: 0.75rem 1rem;
    color: rgba(243, 244, 246, 1);
  }

  .input-group input:focus {
    border-color: rgba(167, 139, 250);
  }

  .forgot {
    display: flex;
    justify-content: flex-end;
    font-size: 0.75rem;
    line-height: 1rem;
    color: rgba(156, 163, 175, 1);
    margin: 8px 0 14px 0;
  }

  .forgot a,
  .signup a {
    color: rgba(243, 244, 246, 1);
    text-decoration: none;
    font-size: 14px;
  }

  .forgot a:hover,
  .signup a:hover {
    text-decoration: underline rgba(167, 139, 250, 1);
  }

  .load{
    background-color: rgba(255, 255, 255);
  }

  .sign {
  position:relative;
  width: 100%;
  background-color: rgba(167, 139, 250, 1);
  padding: 0.75rem;
  text-align: center;
  color: rgba(17, 24, 39, 1);
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease; /* Smooth hover transition */
  display: inline-block;
}

.sign.loading {
  background-color: #ccc; /* Gray out the button while loading */
  color: #ccc;
}

.loading:after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 30px;
  height: 30px;
  margin: -12px 0 0 -12px;
  border: 4px solid #fff;
  border-top: 4px solid rgba(17, 24, 39, 1);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  box-sizing: border-box;
  transform-origin: 50% 50%;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

  .social-message {
    display: flex;
    align-items: center;
    padding-top: 1rem;
  }

  .line {
    height: 1px;
    flex: 1 1 0%;
    background-color: rgba(55, 65, 81, 1);
  }

  .social-message .message {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: rgba(156, 163, 175, 1);
  }

  .social-icons {
    display: flex;
    justify-content: center;
  }

  .social-icons .icon {
    border-radius: 0.125rem;
    padding: 0.75rem;
    border: none;
    background-color: transparent;
    margin-left: 8px;
  }

  .social-icons .icon svg {
    height: 1.25rem;
    width: 1.25rem;
    fill: #fff;
  }

  .signup {
    text-align: center;
    font-size: 0.75rem;
    line-height: 1rem;
    color: rgba(156, 163, 175, 1);
  }

  @media (max-width: 768px) {
    width: 50vw;
    .form-container {
      padding: 1.5rem;
    }

    .title {
      font-size: 1.25rem;
    }

    .input-group input {
      padding: 0.5rem 0.75rem;
    }

    .sign {
      padding: 0.5rem;
      font-size: 0.875rem;
    }
  }

  @media (max-width: 480px) {
    width: 79vw;
    .form-container {
      padding: 1rem;
      width: 100%;
    }

    .title {
      font-size: 1rem;
    }

    .input-group input {
      padding: 0.5rem;
    }

    .sign {
      padding: 0.5rem;
      font-size: 0.75rem;
    }

    .forgot a,
    .signup a {
      font-size: 12px;
    }
  }
`;
