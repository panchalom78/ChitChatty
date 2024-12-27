import { createContext, useState ,useContext} from "react"


const AuthContext = createContext(null);

const AuthProvider = ({children})=>{
    const [isSignedIn,setIsSignedIn] = useState(false);
    const [user,setUser] = useState(null); 

    const signOut = ()=>{setIsSignedIn(false);};
    const signIn = ()=>{setIsSignedIn(true);};

    return(
        <AuthContext.Provider value={{isSignedIn,user,setUser,signIn,signOut}}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    const context = useContext(AuthContext)
    if(context===undefined) throw new Error("useAuth must be used within an AuthProvider")
    return context
}

export default AuthProvider;
export {useAuth}

