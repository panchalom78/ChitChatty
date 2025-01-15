import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login } from "./Login/Login.jsx";
import { Home } from "./Home/Home.jsx";
import { SignUp } from "./SignUp/SignUp.jsx";
import AuthProvider from "../utils/AuthProvider.jsx";
import ProtectedRoute from "../utils/ProtectedRoute.jsx";
import { GetInfo } from "./GetInfo/GetInfo.jsx";
import { ProfileUpdate } from "./ProfileUpdate/ProfileUpdate.jsx";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ForgetPass } from "./ForgetPass/ForgetPass.jsx";
import { ResetPass } from "./ResetPass/ResetPass.jsx";


const router = new createBrowserRouter([
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "signup",
    element: <SignUp />,
  },
  {
    path: "/",
    element: <App />,
  },
  {
    path: "home",
    element: (
        <Home/>
    ),
  },
  {
    path:"profile",
    element: <GetInfo/>
  },
  {
    path:"updateProfile",
    element:<ProfileUpdate/>
  },
  {
    path:"forgetpass",
    element:<ForgetPass/>
  },
  {
    path:"resetpass",
    element:<ResetPass/>
  }
]);

createRoot(document.getElementById("root")).render(
  <>
  <GoogleOAuthProvider clientId="893628773417-u55rk7qohupju507k93rg09ues8h2fv2.apps.googleusercontent.com">
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
    </GoogleOAuthProvider>
  </>
);
