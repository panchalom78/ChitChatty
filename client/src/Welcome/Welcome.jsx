import React from 'react';
import './Welcome.css'
import 'animate.css';
import Lottie from 'lottie-react';
import Animation from '../../photos/Animation - 1738047107708.json'
const Welcome = () => {
  return (
    <div className='welcome'>
      <div className="messageDiv">
        <Lottie animationData={Animation} loop={true}/>
        <p>Add friends and start chatting</p>
      </div>
    </div>
  );
}


export default Welcome;
