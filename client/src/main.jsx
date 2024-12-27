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
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path:"profile",
    element: <GetInfo/>
  },
  {
    path:"updateProfile",
    element:<ProfileUpdate/>
  }
]);

createRoot(document.getElementById("root")).render(
  <>
  <GoogleOAuthProvider clientId="343231360093-98seilv4c2kh4ojs2q9qcomenvag3o1g.apps.googleusercontent.com">
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
    </GoogleOAuthProvider>
  </>
);
