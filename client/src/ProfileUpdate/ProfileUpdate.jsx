import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileUpdate.css";
import { useAuth } from "../../utils/AuthProvider";
import axios from "../../utils/axiosInstance";
import profilePhoto from "../../photos/image.png";
import { updateWithOutProfile,updateWithProfile } from "../../APIPath";
import EditIcon from '@mui/icons-material/Edit';

export const ProfileUpdate = () => {
  const { user, setUser } = useAuth();  
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(user.profile || "");
  const [url, setUrl] = useState(profileImage ? profileImage : profilePhoto);
  const [username, setUsername] = useState(user.username || "");
  const [about, setAbout] = useState(user.about || "");

  const handleImageUpload = (event) => {
    setProfileImage(event.target.files[0]);
    setUrl(URL.createObjectURL(event.target.files[0]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData()
    formData.append('id',user.id)
    if(username!==user.username){
      formData.append("username",username)
    }
    if(about!==user.about){
      formData.append('about',about)
    }

    var data;
    if(url!==user.profile && url!== user.profilePhoto){
      formData.append("photo",profileImage)
      data  = await axios.post(updateWithProfile,formData)
    }
    else{
      let input  = {id:user.id}
      if(username!==user.username){
        input = {...input, username}
      }
      if(about!==user.about){
        input = {...input, about}
      }
      data = await axios.post(updateWithOutProfile,input)
    }
    setUser(data.data)
    navigate('/home')
  };

  return (
    <div className="profileUpdate">
      <nav className="profileNav">
        <h1>Update Profile</h1>
        <button onClick={() => navigate("/home")} className="backButton">
          Back to Home
        </button>
      </nav>
      <div className="form-main">
        <div className="profileFormContainer">
          <form className="profileForm" onSubmit={handleSubmit}>
            <div className="formGroup">
              <label>Profile Picture</label>
              <div className="profileImageContainer">
                <img src={url} alt="Profile" className="profileImagePreview" />
                <label htmlFor="profile-image"><EditIcon/></label>
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="profileImageInput"
                />
              </div>
            </div>
            <div className="formGroup">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="formGroup">
              <label>About</label>
              <input
                type="text"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Tell everyone about you"
              />
            </div>
            <button type="submit" className="updateButton">
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
