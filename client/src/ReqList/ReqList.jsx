import React from 'react'
import './ReqList.css'
import axios from 'axios'
import { getUser } from '../../utils/APIPath'
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
export const ReqList = ({ requests, userId, setRequests,setContacts ,socket,username}) => {

  const handleClick = async (val, user, friend,index) => {
    // const data = await axios.post(handelReq, { val, user, friend })
    // console.log(data.data);
    socket.current.emit("handelReq",{user,friend,val,username})
    console.log("hiiiiiiiiiiiiiiiiii");
    

    setRequests((req)=>{
      const arr = [...req]
      arr.splice(index,1)
      return arr
    })
    if(val){
      const info = await axios.get(`${getUser}/${friend}`)
      const data =info.data
      console.log(data);
      
      setContacts((con)=>{
        return [...con,{id:data._id,username:data.Username,profile:data.ProfilePic,aboutmE:data.AboutMe}]
      })
    }

  }

  return (
    <div className="list">
      {requests.length === 0 ? <p>No friend Requests</p> :
        requests.map((req, index) => {
          return <div className='req' key={index}>
            <div className='req-name'>
              {req.username}
            </div>
            <div className="req-btn">
              <button onClick={() => {
                handleClick(false, userId, req.id,index)
              }}><CloseIcon/></button>
              <button onClick={() => {
                handleClick(true, userId, req.id,index)
              }}><DoneIcon/></button>
            </div>
          </div>
        })}
    </div>
  )
}
