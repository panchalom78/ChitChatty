import express from "express";
import {
  login,
  signIn,
  getContacts,
  getFriends,
  getUsers,
  getUserByName,
  forgotPassword,
  resetPassword,
  getUserInfo,
  authenticateUser,
  logOutUser,
} from "../controllers/authController.js";
import {
  getReq,
  sendReq,
  handelRequest,
} from "../controllers/requestController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const route = express.Router();

route.post("/login", login);
route.post("/signIn", signIn);

route.get("/authenticate", authMiddleware, authenticateUser);
route.get("/user", authMiddleware, getUserInfo);
route.get("/users/:id", authMiddleware, getContacts);
route.post("/friends", authMiddleware, getFriends);
route.post("/addfriend", authMiddleware, sendReq);
route.post("/getRequests", authMiddleware, getReq);
route.post("/handleReq", authMiddleware, handelRequest);
route.get("/userInfo/:id", authMiddleware, getUsers);
route.post("/userByName", authMiddleware, getUserByName);
route.post("/forget", forgotPassword);
route.post("/reset", resetPassword);
route.get("/logoutuser", authMiddleware, logOutUser);

export default route;
