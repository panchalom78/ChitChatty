import React, { useContext } from 'react'
import Emoji from 'emoji-picker-react'
import { memo } from 'react'

const EmojiComponet = ({setText,isMobileView}) => {
  console.log(isMobileView);
  

  return (
    <>  
      <Emoji
        onEmojiClick={(emoji) => setText((prev) => prev + emoji.emoji)}
        reactionsDefaultOpen={false}
        style={isMobileView ? {position: "fixed",
          bottom: "10%",
          left:"5%",
          width: "60%",
          height: "40%" }: {position: "fixed",
          bottom: "10%",
          left: "30%",
          width: "20%",
          height: "50%",}}
        lazyLoadEmojis={true}
        autoFocusSearch={false}
        searchDisabled={true}
        size={10}
        allowExpandReactions={false}
      />
    </>
  )
}

export default memo(EmojiComponet)