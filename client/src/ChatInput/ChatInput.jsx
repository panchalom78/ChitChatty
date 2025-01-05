  import React from 'react'
  import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
  import SendIcon from "@mui/icons-material/Send";
  import ImageIcon from "@mui/icons-material/Image";
  import './ChatInput.css'

  export const ChatInput = ({handleChange,handleImageChange,handleClick,setIsEmojiOpen,text}) => {


    return (
      <div className="chat-input">
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
        </div>
    )
  }
