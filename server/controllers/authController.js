import User from "../models/User.js";
import Contact from "../models/Contact.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import emailSender from "./emailSender.js";

async function login(req, res, next) {
  try {
    const { Email, Password } = req.body;
    const check = await User.findOne({ Email });
    console.log(req.body);

    if (check) {
      res.json({ value: true });
    } else {
      const hash = await argon2.hash(Password);
      const user = await User.create({
        Email,
        Password: hash,
      });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      console.log(user);
      res.cookie("token", token, {
        httpOnly: true
      });

      res.json({ value: false});
    }
  } catch (ex) {
    next(ex);
  }
}

async function signIn(req, res, next) {
  try {
    const { Email, Password } = req.body;
    console.log(Email, Password);

    const getUser = await User.findOne({ Email });
    console.log(getUser);

    if (getUser) {
      if (!getUser.Password) {
        return res.json({ value: false });
      }
      if (await argon2.verify(getUser.Password, Password)) {
        const token = jwt.sign({ id: getUser._id }, process.env.JWT_SECRET, {
          expiresIn: "2h",
        });

        res.cookie("token", token, {
          httpOnly: true          
        });

        if (getUser.ProfilePic === undefined || getUser.ProfilePic === null) {
          res.json({
            isInfoSet: false,
            value: true,
            user: { id: getUser._id },
          });
        } else
          res.json({
            isInfoSet: true,
            value: true,
            user: {
              id: getUser._id,
              username: getUser.Username,
              about: getUser.AboutMe,
              profile: getUser.ProfilePic,
            },
          });
      } else {
        res.json({ value: false });
      }
    } else {
      res.json({ notUser: true });
    }
  } catch (ex) {
    next(ex);
  }
}

async function authenticateUser(req, res) {
  if(req.user){
    return res.json({value:true})
  }
  return res.json({value:false})
}

async function getUserInfo(req, res,next) {
  try {
    const user = await User.findOne({_id:req.user},{Password:0,Email:0})
    return res.json({
      id:user._id,
      username:user.Username,
      about:user.AboutMe,
      profile: user.ProfilePic
    })
  } catch (error) {
    next(error);
  }
}

async function getName(id) {
  const data = await User.findOne({ _id: id }, { Password: 0 });
  return {
    username: data.Username,
    id: data._id,
    profile: data.ProfilePic,
    about: data.AboutMe,
  };
}

async function getContacts(req, res, next) {
  try {
    console.log(req.user);
    const userId = req.user;
    const data = await Contact.findOne({ user: userId });
    if (data) {
      const list = await Promise.all(
        data.friends.map(async (f) => {
          const name = await getName(f);
          return name;
        })
      );
      return res.json(list);
    }
    return res.json([]);
  } catch (ex) {
    next(ex);
  }
}

async function getFriends(req, res, next) {
  try {
    const name = req.body.name;
    const friends = req.body.friends;
    const regex = new RegExp(name, "i");

    function check(id) {
      for (var i = 0; i < friends.length; i++) {
        if (friends[i] == id) {
          return false;
        }
      }
      return true;
    }

    const data = await User.find(
      { Username: { $regex: regex } },
      { Password: 0, Email: 0, AboutMe: 0 }
    );
    const response = data.filter((con) => {
      return check(con._id);
    });

    return res.json(response);
  } catch (ex) {
    next(ex);
  }
}

async function getUsers(req, res, next) {
  try {
    const id = req.params.id;
    const data = await User.findOne({ _id: id }, { Password: 0, Email: 0 });
    res.json(data);
  } catch (ex) {
    next(ex);
  }
}

async function getUserData(id) {
  const data = await User.findOne({ _id: id }, { Password: 0, Email: 0 });
  return data;
}

const addInfo = async function (body, path,id) {
  const data = await User.updateOne(
    { _id:id },
    { Username: body.username, AboutMe: body.aboutme, ProfilePic: path }
  );
};

const getUserByName = async function (req, res, next) {
  const name = req.body.name;
  const data = await User.findOne({ Username: name }, { Password: 0 });
  const value = data ? true : false;
  res.json({ value });
};

const updateUser = async function (data, id) {
  const data1 = await User.updateOne({ _id: id }, data);
  const value = await getName(id);
  return value;
};

const forgotPassword = async function (req, res, next) {
  try {
    const { Email } = req.body;
    const user = await User.findOne({ Email });
    if (!user) {
      return res.json({ error: "User not found", value: false });
    }
    const token = jwt.sign({ email: Email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const resetURL = `${process.env.FRONTEND_URL}/resetpass?token=${token}`;

    emailSender(Email, resetURL);
    res.json({ value: true });
  } catch (ex) {
    res.json({ value: false, error });
    next(ex);
  }
};

const resetPassword = async function (req, res, next) {
  try {
    const { token, pass } = req.body;

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(decoded.email);
      const hash = await argon2.hash(pass);
      const data = await User.updateOne(
        { Email: decoded.email },
        { Password: hash }
      );
      res.json({ value: true });

      return;
    });
  } catch (ex) {
    next(ex);
  }
};

const getUserByGoogleId = async function (id) {
  const data = await User.findOne(
    { GoogleId: id },
    { Password: 0, Email: 0, GoogleId: 0 }
  );
  return data;
};

const addNewUser = async function (data) {
  const user = await User.create(data);
  return user;
};

const logOutUser = async function (req, res) {
  res.clearCookie("token");
  return res.json({ value: false });
}

export {
  login,
  signIn,
  getContacts,
  getFriends,
  getName,
  getUsers,
  addInfo,
  getUserData,
  getUserByName,
  updateUser,
  forgotPassword,
  resetPassword,
  getUserByGoogleId,
  addNewUser,
  getUserInfo,
  authenticateUser,
  logOutUser
};
