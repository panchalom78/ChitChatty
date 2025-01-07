import express from 'express'
import { login, signIn, getContacts, getFriends,getUsers,getUserByName} from '../controllers/authController.js'
import { getReq, sendReq ,handelRequest} from '../controllers/requestController.js';

const route = express.Router();

route.post("/login", login);
route.post("/signIn", signIn);
route.get("/users/:id", getContacts)
route.post("/friends", getFriends)
route.post("/addfriend", sendReq)
route.post("/getRequests", getReq)
route.post("/handleReq", handelRequest)
route.get("/userInfo/:id", getUsers)
route.post("/userByName",getUserByName)

export default route
