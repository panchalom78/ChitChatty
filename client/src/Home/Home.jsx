import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "./Home.css";
import { Contact } from "../Contact/Contact";
import { Chat } from "../Chat/Chat";
import Welcome from "../Welcome/Welcome";
import { host, getUsers, getReq, getUser } from "../../utils/APIPath";
import axios from "axios";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { AddFriend } from "../AddFriend/AddFriend";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../../utils/AuthProvider";
import UpdateIcon from "@mui/icons-material/Update";

export const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
const [showChatSection, setShowChatSection] = useState(false);

  const socket = useRef();

  useEffect(() => {
    socket.current = io(host);
    socket.current.emit("addUser", { id: user.id });

    async function getR() {
      const data = await axios.post(getReq, { id: user.id });
      console.log(data.data);
      setRequests(data.data);
    }
    getR();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setShowChatSection(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  

  useEffect(() => {
    const handleAddReq = async ({ sender }) => {
      const data = await axios.get(`${getUser}/${sender}`);
      console.log(data);

      setRequests((prev) => {
        const arr = [...prev];
        arr.push({ username: data.data.Username, id: data.data._id });
        return arr;
      });
    };
    socket.current.on("addReq", handleAddReq);
    return () => {
      socket.current.off("addReq", handleAddReq);
    };
  }, []);

  useEffect(() => {
    const handleContact = ({ id, name, profile, aboutme }) => {
      setContacts((prev) => {
        const arr = [...prev, { id, username:name, profile, aboutme }];
        console.log(arr);

        return arr;
      });
      console.log(contacts);
    };
    socket.current.on("addContact", handleContact);
    return () => {
      socket.current.off("addContact", handleContact);
    };
  }, []);

  useEffect(() => {
    async function getData() {
      const data = await axios.get(`${getUsers}/${user.id}`);
      setContacts(data.data);
    }
    getData();
  }, []);

  function setChat(c) {
    setCurrentChat(c);
    if (isMobileView) {
      setShowChatSection(true);
    }
  }

  function goToContactList() {
    setShowChatSection(false);
  }
  

  function handleClick() {
    setIsOpen((curr) => {
      return !curr;
    });
  }

  const logOut = () => {
    socket.current.disconnect();
    navigate("/");
  };

  const handleSendReq = (rId) => {
    socket.current.emit("sendReq", { sender: user.id, receiver: rId });
  };

  const handleMsg = (msg, senderId) => {
    console.log("OM");

    setContacts((prev) => {
      const index = prev.findIndex((c) => c.id === senderId);
      const arr = [];
      arr.push(prev[index]);
      const arr2 = prev.slice(0, index).concat(prev.slice(index + 1));
      console.log(arr2);

      const arr3 = arr.concat(arr2);
      arr3[0].receive = true;
      return arr3;
    });
  };

  const handleUpdate = ()=>{
    navigate('/updateprofile')
  }

  return (
    <div className="home">
      {isOpen && (
        <AddFriend
          userId={user.id}
          setContacts={setContacts}
          contacts={contacts}
          setIsOpen={setIsOpen}
          requests={requests}
          setRequests={setRequests}
          handleSendReq={handleSendReq}
          socket={socket}
          name={user.user}
        />
      )}
      <nav className="homeNav">
        <h1 style={{color:'white'}}>ChitChatty</h1>
        <div className="btn-grp">
          <button onClick={handleClick}>
            <PersonAddIcon sx={{ color: "white" }} />
          </button>
          <button onClick={logOut}>
            <LogoutIcon />
          </button>
        </div>
      </nav>
      <div className="chat">
  {isMobileView && !showChatSection ? (
    <div className="chatlist">
      {contacts.map((contact, index) => (
        <Contact
          key={index}
          contact={contact}
          setChat={setChat}
          chat={currentChat}
          receive={contact.receive ? true : false}
        />
      ))}
      <div className="userProfile">
        <div className="userPic">
          <div style={{ backgroundImage: `url(${user.profile})` }}></div>
        </div>
        <div className="userInfo">
          <div className="userName">{user.username}</div>
          <div className="userAbout">{user.aboutme}</div>
        </div>
        <div className="update">
          <button onClick={handleUpdate} style={{ backgroundColor: "transparent", border: "none", cursor: "pointer" }}>
            <UpdateIcon style={{ color: "black", fontSize: "2rem" }} />
          </button>
        </div>
      </div>
    </div>
  ) : null}

  {isMobileView && showChatSection ? (
    <div className="chat-section active">
      <button onClick={goToContactList} className="back-button">Back</button>
      {currentChat === undefined ? (
        <Welcome />
      ) : (
        <Chat contact={currentChat} user={user} socket={socket} handleMsg={handleMsg} />
      )}
    </div>
  ) : null}

  {!isMobileView && (
    <>
      <div className="chatlist">
        {contacts.map((contact, index) => (
          <Contact
            key={index}
            contact={contact}
            setChat={setChat}
            chat={currentChat}
            receive={contact.receive ? true : false}
          />
        ))}
        <div className="userProfile">
          <div className="userPic">
            <div style={{ backgroundImage: `url(${user.profile})` }}></div>
          </div>
          <div className="userInfo">
            <div className="userName">{user.username}</div>
            <div className="userAbout">{user.aboutme}</div>
          </div>
          <div className="update">
            <button onClick={handleUpdate} style={{ backgroundColor: "transparent", border: "none", cursor: "pointer" }}>
              <UpdateIcon style={{ color: "black", fontSize: "2rem" }} />
            </button>
          </div>
        </div>
      </div>
      {currentChat === undefined ? (
        <Welcome />
      ) : (
        <Chat contact={currentChat} user={user} socket={socket} handleMsg={handleMsg} />
      )}
    </>
  )}
</div>

    </div>
  );
};
