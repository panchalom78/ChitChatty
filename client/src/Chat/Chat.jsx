import React, { useEffect, useState, useRef } from "react";
import "./Chat.css";
import { Message } from "../Message/Message";
import { getMsg, uploadImage } from "../../utils/APIPath";
import axios from "axios";
import  EmojiComponet  from "../Emoji/EmojiComponet";
import { ChatInput } from "../ChatInput/ChatInput";

export const Chat = ({ user, contact, socket, handleMsg }) => {
  const ref = useRef(null);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [isImageSet, setIsImageSet] = useState(false);
  const [isSendingImage, setIsSendingImage] = useState(false);

  useEffect(() => {
    async function getMsgs() {
      const response = await axios.post(getMsg, {
        to: contact.id,
        from: user.id,
      });
      console.log(response.data);
      setMessages(response.data);
    }
    getMsgs();
  }, [contact]);

  useEffect(() => {
    setTimeout(() => {
      scrollDown();
    }, 500);
  }, [messages]);

  function addM({ msg, id }) {
    setMessages((m) => {
      return [...m, { msg: msg, sender: id, isImage: false }];
    });
  }

  useEffect(() => {
    console.log("addChat");

    const handleAddMsg = ({ msg, id }) => {
      const contactId = contact.id;
      console.log(contactId, id);

      if (contactId === id) {
        addM({ msg, id });
      } else {
        handleMsg(msg, id);
      }
    };

    socket.current.on("add-msg", handleAddMsg);

    // Clean up the event listener when the component unmounts
    return () => {
      socket.current.off("add-msg", handleAddMsg);
    };
  }, [contact]);

  useEffect(() => {
    const handleAddImage = ({ msg, id }) => {
      console.log(contact.id, id);

      if (contact.id === id) {
        setMessages((prev) => {
          return [...prev, { msg: msg, sender: id, isImage: true }];
        });
      } else {
        handleMsg(msg, id);
      }
    };

    socket.current.on("addImage", handleAddImage);

    // Clean up the event listener when the component unmounts
    return () => {
      socket.current.off("addImage", handleAddImage);
    };
  }, []);

  const handleClick = async () => {
    if (text === "" && !image) return;

    const messageData = {
      msg: text,
      sender: user,
      receiver: contact,
    };

    if (image) {
      setIsSendingImage(true);

      document.querySelector(".send-btn").disabled = true;

      const formData = new FormData();
      formData.append("photo", image);
      formData.append("sender", user.id);
      formData.append("receiver", contact.id);

      const data = await axios.post(uploadImage, formData);
      console.log(data.data);
      const msg = data.data.link;

      setMessages((prev) => {
        return [...prev, { msg, sender: user.id, isImage: true }];
      });
      socket.current.emit("sendImage", {
        msg,
        sender: user.id,
        receiver: contact.id,
      });
      document.querySelector(".send-btn").disabled = false;
      setIsSendingImage(false);
    } else {
      sendMessage(messageData);
    }

    setText("");
    setImage(null);
    setPreview("");
    setIsImageSet(false);
  };

  const sendMessage = (messageData) => {
    socket.current.emit("send-msg", messageData);
    setMessages((msg) => [
      ...msg,
      { msg: messageData.msg, sender: user.id, isImage: false },
    ]);
  };

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Create a temporary URL for image preview
      setIsImageSet(true);
    }
  };

  const scrollDown = () => {
    ref.current.scrollIntoView({ block: "end", behavior: "smooth" });
  };

  return (
    <div className="chatmain">
      <div className="chat-msg">
        {messages.map((msg, index) => (
          <Message
            key={index}
            msg={msg.msg}
            isSender={user.id === msg.sender}
            isImage={msg.isImage}
          />
        ))}
        {isEmojiOpen && (
          <EmojiComponet setText={setText}/>
        )}

        <div className="scroll" ref={ref}></div>
      </div>

      {/* Image Preview Section */}
      {isImageSet && (
        <div
          className={`image-preview ${isSendingImage ? "sending" : ""}`}
          style={{ zIndex: 1 }}
        >
          {isSendingImage ? <div className="imageLoader"></div> : ""}
          <img src={preview} alt="Preview" />
          <button
            onClick={() => {
              setIsImageSet(false);
              setPreview("");
              setImage(null);
              console.log("hgd");
            }}
          >
            X
          </button>
        </div>
      )}
      <ChatInput handleChange={handleChange} handleClick={handleClick} handleImageChange={handleImageChange} setIsEmojiOpen={setIsEmojiOpen} text={text}/>

      {/* <div className="chat-input">
        <button
          onClick={() => setIsEmojiOpen((curr) => !curr)}
          className="emoji-btn"
        >
          <EmojiEmotionsIcon />
        </button>
        <input
          type="text"
          value={text}
          id="chatInput"
          onChange={handleChange}
          placeholder="Type a message..."
          className="message-input"
        />
        <button>
          <label htmlFor="imageInput" className="image-btn">
            <ImageIcon />
          </label>
        </button>
        <input
          type="file"
          id="imageInput"
          name="imageInput"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
        <button onClick={handleClick} className="send-btn">
          <SendIcon />
        </button>
      </div> */}
    </div>
  );
};
