import React, { useState } from 'react'
import axios from 'axios';
import styled from 'styled-components';
import { resetPassword } from '../../APIPath';
export const ResetPass = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');

    const [resetPass,setResetPass] = useState({pass:"",cPass:""});

    const handleSubmit = async (e)=>{
        e.preventDefault()
        if(resetPass.pass !== resetPass.cPass){
            alert("pass not match")
        }
        const data =  await axios.post(resetPassword,{token,pass:resetPass.pass})
        if(data.data.value){
          alert("Password reset successful")
          window.location.href = "/login";
        }
    }

    const handleChange = (e)=>{
        const {name,value} = e.target;
        setResetPass((prev)=>{
            return {...prev,[name]:value}
        })
    }

    return (
        <>
          <StyledWrapper>
            <div className="form-container">
              <p className="title">Enter new password</p>
              <form className="form" method="POST" onSubmit={handleSubmit}>
                
                <div className="input-group">
                  <label htmlFor="pass">New Password</label>
                  <input type="password" name="pass" id="pass" value={resetPass.pass} onChange={handleChange}/>
                </div>
                <div className="input-group">
                  <label htmlFor="cPass">Confirm Password</label>
                  <input type="password" name="cPass" id="cPass" value={resetPass.cPass} onChange={handleChange}/>
                </div>
                <br />
                <input type="submit" value="Reset Password" className="sign" />
              </form>
            </div>
          </StyledWrapper>
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
        display: block;
        width: 100%;
        background-color: rgba(167, 139, 250, 1);
        padding: 0.75rem;
        text-align: center;
        color: rgba(17, 24, 39, 1);
        border: none;
        border-radius: 0.375rem;
        font-weight: 600;
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
    

