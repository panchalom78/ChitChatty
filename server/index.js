import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import route from "./routes/auth.js";
import bodyParser from "body-parser";
import msgRoute from "./routes/message.js";
import { addMessage } from "./controllers/messageController.js";
import { handelRequest } from "./controllers/requestController.js";
import {
  addNewUser,
  getName,
  getUserByGoogleId,
  getUserData,
} from "./controllers/authController.js";
import connectDb from "./utils/db.js";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import passport from "passport";
import session from "express-session";
import { Strategy } from "passport-google-oauth20";
import cookieParser from "cookie-parser";
import generateToken from "./utils/jwtToken.js";
// Resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = 3000;
dotenv.config();

const isProduction = process.env.IS_PRODUCTION === "yes";
const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Replace with the frontend's origin
    credentials: true,
  })
);

console.log(process.env.FRONTEND_URL);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: isProduction,
      httpOnly: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      const data = await getUserByGoogleId(profile.id);
      if (data !== null) {
        console.log("User Data", data);
        return done(null, { user: data, isNew: false });
      } else {
        const newUser = {
          Email: profile._json.email,
          GoogleId: profile._json.sub,
          Username: profile._json.name,
          ProfilePic: profile._json.picture,
        };
        console.log("user data", newUser);

        const data1 = await addNewUser(newUser);
        console.log(data1);
        return done(null, { user: data1, isNew: true });
      }
    }
  )
);

passport.serializeUser((data, done) => {
  done(null, { id: data.user._id, isNew: data.isNew });
});

passport.deserializeUser(async (data, done) => {
  try {
    const user = await getName(data.id);
    done(null, { user, isNew: data.isNew });
  } catch (error) {
    done(error, null);
  }
});

// initial google ouath login
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.FRONTEND_URL,
  }),
  (req, res) => {
    console.log("Google req", req.user);

    const token = generateToken(req.user.user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax", // Lax for local dev
      maxAge: 1000 * 60 * 60 * 24,
    });
    if (req.user.isNew) {
      // Redirect new users to a different page
      res.redirect(`${process.env.FRONTEND_URL}/profile`);
    } else {
      // Redirect returning users
      res.redirect(`${process.env.FRONTEND_URL}/home`);
    }
  }
);

// app.get("/login/sucess",async(req,res)=>{
//     if(req.user){
//         res.status(200).json({value:true,user:req.user})
//     }else{
//         res.status(200).json({value:false})
//     }
// })

app.get("/logout", (req, res, next) => {
  res.clearCookie("token",{sameSite:isProduction ? "none" : "lax",secure:isProduction,httpOnly:true});
  console.log("Hellllllllllllllllllo");
  res.json({ value: true });
});

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

connectDb();

global.users = new Map();
io.on("connection", (socket) => {
  console.log("User connected");
  console.log(socket.id);

  socket.on("addUser", ({ id }) => {
    console.log("id = ", id);

    users.set(id, socket.id);
  });

  socket.on("send-msg", ({ msg, sender, receiver }) => {
    const id = users.get(receiver.id);
    socket.to(id).emit("add-msg", { msg, id: sender.id });
    addMessage(msg, sender.id, receiver.id);
  });

  function find(id) {
    for (let [key, val] of users.entries()) {
      if (val == id) {
        return key;
      }
    }
  }

  socket.on("disconnect", () => {
    const key = find(socket.id);
    console.log(key, socket.id);

    users.delete(key);
  });

  socket.on("sendReq", ({ sender, receiver }) => {
    const id = users.get(receiver);
    if (id) {
      console.log("Hello");
      socket.to(id).emit("addReq", { sender });
    }
  });

  socket.on("handelReq", async ({ user, friend, val }) => {
    await handelRequest(user, friend, val);
    if (val) {
      const id = users.get(friend);
      if (id) {
        console.log("Hello");
        const data = await getUserData(user);
        console.log(data);

        socket
          .to(id)
          .emit("addContact", {
            id: data._id,
            name: data.Username,
            profile: data.ProfilePic,
            aboutme: data.AboutMe,
          });
      }
    }
  });

  socket.on("sendImage", ({ msg, sender, receiver }) => {
    const id = users.get(receiver);
    socket.to(id).emit("addImage", { msg, id: sender });
  });
});

app.use(route);
app.use(msgRoute);

// if(process.env.NODE_ENV !== 'production'){
//     app.use(express.static(path.join(__dirname, '../client/dist')))

//     app.get('*', (req, res) => {
//         res.sendFile(path.join(__dirname, '../client','dist', 'index.html'))
//     })
// }

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
