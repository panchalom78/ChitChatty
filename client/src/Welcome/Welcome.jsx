import React from 'react';
import MessageIcon from '@mui/icons-material/Message';
import './Welcome.css'
import 'animate.css';

const Welcome = () => {
  return (
    <div className='welcome'>
      <div className="messageDiv">
        <div className="msg-svg">
        <MessageIcon style={{fontSize:'7rem'}}/>
        </div>
        <h1>Welcome to ChitChatty</h1>
        <p>Contact your friends and start chatting</p>
      </div>
    </div>
  );
}


export default Welcome;
