import { uploadPhoto } from "../FileHandel/Cloudinary.js";
import { addInfo, updateUser } from "./authController.js";
import deleteImage from "../FileHandel/DeleteFile.js";
import { addImage } from "./messageController.js";

async function uploadProfile(req, res, next) {
  try {
    console.log(req.body);
    let data={};

    if(req.file){
      const f = req.file;
    console.log(f);

    const path = await uploadPhoto(f.path, req.user);
    await addInfo(req.body, path,req.user);
    
    deleteImage(f.filename, "./temp", (err, message) => {
      if (err) {
        console.error(err.message);
      } else console.log(message);
    });
    data = {
      id: req.user,
      username: req.body.username,
      aboutme: req.body.aboutme,
      profile: path,
    };
    }
    
    else {
     await addInfo(req.body,req.body.photoLink,req.user); 
    data = {
      id: req.user,
      username: req.body.username,
      aboutme: req.body.aboutme,
      profile: req.body.photoLink,
    };
    }
    
    res.json(data);
  } catch (ex) {
    next(ex);
  }
}

async function uploadImage(req, res, next) {
  try {
    const file = req.file;

    const path = await uploadPhoto(
      file.path,
      `${req.body.sender}${new Date()}`
    );

    await addImage(path, req.body.sender, req.body.receiver);

    deleteImage(file.filename, "./temp", (err, message) => {
      if (err) {
        console.error(err.message);
      } else console.log(message);
    });

    res.json({ link: path });
  } catch (ex) {
    next(ex);
  }
}

const updateProfileWithProfile = async function (req, res, next) {
  try {
    const file = req.file;
    const path = await uploadPhoto(file.path,`${req.user}${new Date()}`);

    deleteImage(file.filename, "./temp", (err, message) => {
      if (err) {
        console.error(err.message);
      } else console.log(message);
    });
    
    let data = {ProfilePic: path}
    if(req.body.username){
        data = {...data,Username:req.body.username}
    }
    if(req.body.about){
        data = {...data,AboutMe:req.body.about}
    }

    const value = await updateUser(data,req.user)

    res.json(value)
  } catch (ex) {
    next(ex);
  }
};

const updateProfileWithOutProfile = async function (req, res, next) {
    try {
      console.log(req.body);
      
        
        let data = {}
        if(req.body.username){
            data = {...data,Username:req.body.username}
        }
        if(req.body.about){
            data = {...data,AboutMe:req.body.about}
        }
    
        const value = await updateUser(data,req.user)
    
        res.json(value)
      } catch (ex) {
        next(ex);
      }
};

export { uploadProfile, uploadImage ,updateProfileWithOutProfile,updateProfileWithProfile};
