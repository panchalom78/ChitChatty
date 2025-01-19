// http://localhost:3000
export const host =import.meta.env.VITE_REACT_BACKEND_URL;


export const loginPath = `${host}/login`
export const signPath = `${host}/signIn`
export const getUsers = `${host}/users`
export const getMsg = `${host}/getmessage`
export const getFriend = `${host}/friends`  
export const addFriend = `${host}/addfriend`
export const getReq = `${host}/getRequests`
export const handelReq = `${host}/handleReq`
export const getUser = `${host}/userInfo`
export const profile = `${host}/profile`
export const getUserByName = `${host}/userByName`
export const uploadImage = `${host}/uploadImage`
export const updateWithProfile = `${host}/updatewithprofile`
export const updateWithOutProfile = `${host}/updatewithoutprofile`
export const forgetPass = `${host}/forget`
export const resetPassword  = `${host}/reset`
export const googleLogin = `${host}/google`
