import React from 'react'
import Emoji from 'emoji-picker-react'
import { memo } from 'react'

const EmojiComponet = ({setText}) => {
  return (
    <>
      <Emoji
        onEmojiClick={(emoji) => setText((prev) => prev + emoji.emoji)}
        reactionsDefaultOpen={false}
        style={{
          position: "fixed",
          bottom: "10%",
          left: "30%",
          width: "20%",
          height: "50%",
        }}
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