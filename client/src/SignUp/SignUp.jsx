import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signPath } from "../../APIPath";
import { useAuth } from "../../utils/AuthProvider";
import styled from "styled-components";
import { Flip, ToastContainer, toast } from "react-toastify";
import { set } from "mongoose";

export const SignUp = () => {
  const [user, setUser1] = useState({});
  const navigate = useNavigate();
  var { signIn, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    theme: "dark",
    transition: Flip,
  };

  function updateChange(e) {
    const { name, value } = e.target;
    setUser1((currUser) => {
      return { ...currUser, [name]: value };
    });
  }

  async function validateUser(e) {
    try {
      setIsLoading(true);

      e.preventDefault();
      const data = { Email: user.Email, Password: user.Password };

      const checkUser = await axios.post(signPath, data);

      const isUser = checkUser.data;

      if (isUser.value) {
        signIn();
        setUser(isUser.user);
      }

      isUser.notUser
        ? toast.error("No user found", toastOptions)
        : isUser.value
        ? isUser.isInfoSet
          ? navigate("/home")
          : navigate("/profile")
        : toast.error("Wrong credentials", toastOptions);
    } catch (error) {
      toast.error(
        "An error occurred while validating. Please try again later.",
        toastOptions
      );
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      <StyledWrapper>
        <div className="form-container">
          <p className="title">Login</p>
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
            <div className="input-group" style={{ marginBottom: "1rem" }}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="Password"
                id="password"
                onChange={updateChange}
              />
              <div className="forgot">
                <Link to="/forgetpass">Forgot Password ?</Link>
              </div>
            </div>
            {/* <button className="sign">Sign in</button> */}
            <button
              type="submit"
              className={`sign ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              Log In
            </button>
          </form>
          {/* <div className="social-message">
          <div className="line" />
          <p className="message">Login with social accounts</p>
          <div className="line" />
        </div> */}
          {/* <div className="social-icons">
          <button aria-label="Log in with Google" className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current">
              <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z" />
            </svg>
          </button>
          <button aria-label="Log in with Twitter" className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current">
              <path d="M31.937 6.093c-1.177 0.516-2.437 0.871-3.765 1.032 1.355-0.813 2.391-2.099 2.885-3.631-1.271 0.74-2.677 1.276-4.172 1.579-1.192-1.276-2.896-2.079-4.787-2.079-3.625 0-6.563 2.937-6.563 6.557 0 0.521 0.063 1.021 0.172 1.495-5.453-0.255-10.287-2.875-13.52-6.833-0.568 0.964-0.891 2.084-0.891 3.303 0 2.281 1.161 4.281 2.916 5.457-1.073-0.031-2.083-0.328-2.968-0.817v0.079c0 3.181 2.26 5.833 5.26 6.437-0.547 0.145-1.131 0.229-1.724 0.229-0.421 0-0.823-0.041-1.224-0.115 0.844 2.604 3.26 4.5 6.14 4.557-2.239 1.755-5.077 2.801-8.135 2.801-0.521 0-1.041-0.025-1.563-0.088 2.917 1.86 6.36 2.948 10.079 2.948 12.067 0 18.661-9.995 18.661-18.651 0-0.276 0-0.557-0.021-0.839 1.287-0.917 2.401-2.079 3.281-3.396z" />
            </svg>
          </button>
          <button aria-label="Log in with GitHub" className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current">
              <path d="M16 0.396c-8.839 0-16 7.167-16 16 0 7.073 4.584 13.068 10.937 15.183 0.803 0.151 1.093-0.344 1.093-0.772 0-0.38-0.009-1.385-0.015-2.719-4.453 0.964-5.391-2.151-5.391-2.151-0.729-1.844-1.781-2.339-1.781-2.339-1.448-0.989 0.115-0.968 0.115-0.968 1.604 0.109 2.448 1.645 2.448 1.645 1.427 2.448 3.744 1.74 4.661 1.328 0.14-1.031 0.557-1.74 1.011-2.135-3.552-0.401-7.287-1.776-7.287-7.907 0-1.751 0.62-3.177 1.645-4.297-0.177-0.401-0.719-2.031 0.141-4.235 0 0 1.339-0.427 4.4 1.641 1.281-0.355 2.641-0.532 4-0.541 1.36 0.009 2.719 0.187 4 0.541 3.043-2.068 4.381-1.641 4.381-1.641 0.859 2.204 0.317 3.833 0.161 4.235 1.015 1.12 1.635 2.547 1.635 4.297 0 6.145-3.74 7.5-7.296 7.891 0.556 0.479 1.077 1.464 1.077 2.959 0 2.14-0.020 3.864-0.020 4.385 0 0.416 0.28 0.916 1.104 0.755 6.4-2.093 10.979-8.093 10.979-15.156 0-8.833-7.161-16-16-16z" />
            </svg>
          </button>
        </div> */}
          <p className="signup">
            Don't have an account?
            <Link to="/login">Sign up</Link>
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

  .sign {
    position: relative;
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
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
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
