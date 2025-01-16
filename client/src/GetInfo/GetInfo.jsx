import React, { useEffect, useState } from "react";
import axios from "axios";
import { profile, getUserByName, host } from "../../APIPath";
import "./GetInfo.css";
import { useNavigate } from "react-router-dom";
import { Flip, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../utils/AuthProvider";
import profilePhoto from "../../photos/image.png";

export const GetInfo = () => {

  const [photo, setPhoto] = useState(null);
  const [username, setUserName] = useState("");
  const [aboutme, setAboutMe] = useState("");
  const [isPhotoSet, setIsPhotoSet] = useState(false);
  const [photoURL, setPhotoURL] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    theme: "dark",
    transition: Flip,
  };

  const handleChange = (e) => {
    setPhoto(e.target.files[0]);
    setIsPhotoSet(true);
    setPhotoURL(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username === "" || aboutme === "") {
      toast.error("Please enter username and aboutme", toastOptions);
      return;
    }

    const check = await axios.post(getUserByName, { name: username });
    if (check.data.value) {
      toast.error("Username already exists", toastOptions);
      return;
    }

    setLoading(true);
    try {
      e.preventDefault();
      const formData = new FormData();
      if(photoURL === user.profile){
        formData.append('photoLink',photoURL)
      }
      else{
        formData.append("photo", photo);
      }
      formData.append("username", username);
      formData.append("aboutme", aboutme);
      formData.append("id", user.id);

      console.log(formData);

      const data = await axios.post(profile, formData);
      const info = data.data;
      console.log(info);

      setUser(info);
      navigate("/home");
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async ()=>{
    try {
      const data = await axios.get(`${host}/login/sucess`, { withCredentials: true });
      console.log(data.data);
      setUser(data.data.user.user)
      setUserName(data.data.user.user.username)
      setPhotoURL(data.data.user.user.profile)
      setIsPhotoSet(true)
    } catch (error) {
      alert(error)
      navigate("/");
    }
  }

  useEffect(()=>{
    getUser();
  },[])

  return (
    <>
      <div className="addInfo">
        {loading ? (
          <div className="loader"></div>
        ) : (
          <form onSubmit={handleSubmit} id="infoForm">
            <div className="profilePic">
              <label htmlFor="files" id="profileLabel">
                <div
                  className="photoDiv"
                  style={{
                    backgroundImage: isPhotoSet
                      ? `url(${photoURL})`
                      : `url(${profilePhoto})`,
                  }}
                ></div>
              </label>
            </div>
            <input type="file" id="files" onChange={handleChange} />
            <input
              id="infoName"
              type="text"
              name=""
              value={username}
              placeholder="Username..."
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            />
            <input
              type="text"
              placeholder="About me..."
              value={aboutme}
              onChange={(e) => {
                setAboutMe(e.target.value);
              }}
            />
            <input type="submit" value="Upload" />
          </form>
        )}
      </div>
      <ToastContainer />
    </>
  );
};
