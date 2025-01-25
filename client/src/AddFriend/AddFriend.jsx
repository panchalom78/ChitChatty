import React, { useState } from "react";
import "./AddFriend.css";
import SearchIcon from "@mui/icons-material/Search";
import { SearchList } from "../SearchList/SearchList";
import { ReqList } from "../ReqList/ReqList";
import axios from "../../utils/axiosInstance";
import { getFriend, addFriend } from "../../APIPath";
import { Flip, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AddFriend = ({
  userId,
  contacts,
  setContacts,
  setIsOpen,
  requests,
  setRequests,
  handleSendReq,
  socket,
  name,
}) => {
  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    theme: "dark",
    transition: Flip,
  };

  const [friend, setFriend] = useState("");
  const [search, setSearch] = useState([]);
  const [isReq, setIsReq] = useState(true);

  const handleClick = async () => {
    if (friend === "") {
      toast.error("Input feild cannot be empty", toastOptions);
      return;
    }
    const friends = contacts.map((con) => {
      return con.id;
    });
    friends.push(userId);
    const data = await axios.post(getFriend, {
      name: friend,
      friends: friends,
    });
    setSearch(data.data);
    setIsReq(false);
  };

  const handleChange = (e) => {
    setFriend(e.target.value);
  };

  const sendReq = async (id, index) => {
    handleSendReq(id);
    setSearch((prev) => {
      const arr = [...prev];
      arr.splice(index, 1);
      return arr;
    });
    const data = await axios.post(addFriend, { sender: userId, receiver: id });
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const change = (value) => {
    setIsReq(value);
  };

  return (
    <>
      <div className="black">
        <div className="add">
          <div className="inputS">
            <input
              type="text"
              value={friend}
              onChange={handleChange}
              placeholder="Enter Username..."
            />
            <button onClick={handleClick} className="ser">
              <SearchIcon />
            </button>
            <button className="close" onClick={onClose}>
              X
            </button>
          </div>
          <div className="head">
            <button
              onClick={() => {
                change(false);
              }}
              style={isReq ? { border: "1px solid #d1d9e6" } : {}}
            >
              Search
            </button>
            <button
              onClick={() => {
                change(true);
              }}
              style={!isReq ? { border: "1px solid #d1d9e6" } : {}}
            >
              Requests
            </button>
          </div>
          {isReq ? (
            <ReqList
              requests={requests}
              userId={userId}
              setRequests={setRequests}
              setContacts={setContacts}
              socket={socket}
              username={name}
            />
          ) : (
            <SearchList search={search} sendReq={sendReq} />
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};
