import React, { useEffect, useState } from 'react';
import './ChatRoom.css';
import ChatRoomService from '../../services/chatRoom.service';

function ChatRoom() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const chatRoomService = ChatRoomService.getInstance("roomName");
  useEffect(() => {
    const doWork = async () => {
      const messages = await chatRoomService.getMessages();
      setChat(messages);
    }
    doWork();
  }, []);

  const submitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    debugger;
    chatRoomService.send(message);
    setMessage('');
  };

  return (
    <div>
      <div className='chat-history'>
      {chat.map((msg:any, index) => (
        <p key={index}>{msg.text}</p>
      ))}
      </div>
      <form className='sending' onSubmit={submitMessage}>
        <input
          id="messageInput"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatRoom;