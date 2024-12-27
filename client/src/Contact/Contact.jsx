import React from "react";
import { useEffect,useState } from "react";
import "./Contact.css";

export const Contact = ({ contact, setChat, chat, receive }) => {

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = contact.profile;
    img.onload = () => {
      setIsLoaded(true);
    };
    img.onerror = () => {
      console.error('Failed to load background image.');
    };
  }, []);


  return (
    <div
      className={`contact ${
        chat !== undefined ? (contact === chat ? "opacity" : "") : null
      }`}
      onClick={() => {
        contact.receive = false;
        setChat(contact);
      }}
    >
      <div
        className="user-image"
      >
        <div style={{
        backgroundImage: isLoaded ? `url(${contact.profile})` : 'none',
        transition: 'opacity 1s ease-in-out',
        opacity: isLoaded ? 1 : 0,
      }}></div>
      </div>
      <div className="user-name">
        <p>{contact.username}</p>
      </div>
      <div
        className="msg-receive"
        style={receive ? { visibility: "visible" } : {}}
      >
        <div></div>
      </div>
    </div>
  );
};
