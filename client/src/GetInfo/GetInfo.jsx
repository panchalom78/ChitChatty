import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { profile, getUserByName, host, userInfo } from "../../APIPath";
import "./GetInfo.css";
import { useNavigate } from "react-router-dom";
import { Flip, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../utils/AuthProvider";
import profilePhoto from "../../photos/image.png";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

export const GetInfo = () => {
  const [photo, setPhoto] = useState(null);
  const [username, setUserName] = useState("");
  const [aboutme, setAboutMe] = useState("");
  const [isPhotoSet, setIsPhotoSet] = useState(false);
  const [photoURL, setPhotoURL] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const imageURL = "https://res-console.cloudinary.com/dg8rrxsr3/media_explorer_thumbnails/3c6630f82a469b537351f6c111997e08/detailed"
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
      if (photoURL === user?.profile) {
        formData.append("photoLink", photoURL);
      }
      else if(!isPhotoSet){
        formData.append("photoLink", imageURL);
      }
      else {
        formData.append("photo", photo);
      }
      formData.append("username", username);
      formData.append("aboutme", aboutme);

      const data = await axios.post(profile, formData);
      const info = data.data;
      navigate("/home");
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async () => {
    try {
      const data = await axios.get(userInfo);
      if (data.data.username) {
        setUserName(data.data.username);
      }
      if (data.data.profile) {
        setPhotoURL(data.data.profile);
        setIsPhotoSet(true);
      }

      // if(data.data.value){
      //   setUser(data.data.user.user)
      //   setUserName(data.data.user.user.username)
      //   setPhotoURL(data.data.user.user.profile)
      //   setIsPhotoSet(true)
      // }
    } catch (error) {
      alert(error);
      navigate("/");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <div className="addInfo">
        {loading ? (
          <div className="loader"></div>
        ) : (
          <form onSubmit={handleSubmit} id="infoForm">
            <div className="profilePic">
              <div
                className="photoDiv"
                style={{
                  backgroundImage: isPhotoSet
                    ? `url(${photoURL})`
                    : `url(${profilePhoto})`,
                }}
              >
                <label htmlFor="files" id="profileLabel">
                  <div className="cameraIcon">
                    <CameraAltIcon />
                  </div>
                </label>
              </div>
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
