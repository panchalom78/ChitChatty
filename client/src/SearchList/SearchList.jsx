import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import './SearchList.css'

export const SearchList = ({search,sendReq}) => {
    return (
        <div className="list">
            {search.length === 0 ? <p>No friend request</p> :
                search.map((item, index) => {
                    return <div key={index} className='element'>
                        <div className="ele-photo" style={{
                            backgroundImage:`url(${item.ProfilePic})`
                        }}></div>
                        <div className="ele-name">
                            <p>{item.Username}</p>
                        </div>
                        <button className='addicon' onClick={() => { sendReq(item._id,index) }}>
                            <AddIcon />
                        </button>
                    </div>
                })}
        </div>
    )
}
