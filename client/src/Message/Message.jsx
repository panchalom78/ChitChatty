import React,{useState,useEffect} from 'react'
import './Message.css'
export const Message = ({msg,isSender,isImage}) => {

  

  if(isImage) {

    const [isLoaded, setIsLoaded] = useState(false);
    
      useEffect(() => {
        const img = new Image();
        img.src = msg;
        img.onload = () => {
          setIsLoaded(true);
        };
        img.onerror = () => {
          console.error('Failed to load background image.');
        };
      }, []);

    return (
      <div className={`message ${isSender ? "right" : "left"}`}>
        {/* <img src={msg} alt="Image"/> */}
        {isLoaded && <img src={msg} alt="Image" style={{ display: "block" }} />}
      </div>
    )
  }
  else{
    return(
      <div className={`message ${isSender ? "right" : "left"}`}>
        <p>{msg}</p>
    </div>
    )
  }
}
