import { uploadPhoto } from "../FileHandel/Cloudinary.js";
import { addInfo, updateUser } from "./authController.js";
import deleteImage from "../FileHandel/DeleteFile.js";
import { addImage } from "./messageController.js";

async function uploadProfile(req, res, next) {
  try {
    console.log(req.body);

    const f = req.file;
    console.log(f);

    const path = await uploadPhoto(f.path, req.body.id);
    await addInfo(req.body, path);
    const data = {
      id: req.body.id,
      username: req.body.username,
      aboutme: req.body.aboutme,
      profile: path,
    };

    deleteImage(f.filename, "./temp", (err, message) => {
      if (err) {
        console.error(err.message);
      } else console.log(message);
    });

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
    const path = await uploadPhoto(file.path,`${req.body.id}${new Date()}`);

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

    const value = await updateUser(data,req.body.id)

    res.json(value)
  } catch (ex) {
    next(ex);
  }
};

const updateProfileWithOutProfile = async function (req, res, next) {
    try {
        
        const data = {}
        if(req.body.username){
            data = {...data,Username:req.body.username}
        }
        if(req.body.about){
            data = {...data,AboutMe:req.body.about}
        }
    
        const value = await updateUser(data,req.body.id)
    
        res.json(value)
      } catch (ex) {
        next(ex);
      }
};

export { uploadProfile, uploadImage ,updateProfileWithOutProfile,updateProfileWithProfile};
