import { useEffect } from "react";
import { useAuth } from "./AuthProvider.jsx"
import {useNavigate } from "react-router-dom";

const ProtectedRoute = ({children})=>{
    
    const {isSignedIn} = useAuth();
    const navigate = useNavigate();
    
    useEffect(()=>{
        if(!isSignedIn){
            navigate('/signup',{replace:true})
        }
    },[navigate])
                                                                                                                                                                                                            
    if(isSignedIn){
        return children
    }

}
export default ProtectedRoute