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
  }, [chatRoomService]);

  const submitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    chatRoomService.send(message);
    setMessage('');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-sm">
      <div className="overflow-auto h-full px-6 py-4">
        <div className="border-b border-gray-300 mb-6 pb-2 flex justify-between items-center">
          <h1 className="text-3xl font-semibold">Chat Room</h1>
        </div>
        <div className="chat-history space-y-4">
          {chat.map((msg:any, index) => (
            <div key={index} className="p-4 rounded-lg bg-white shadow">
              <p className="text-gray-800">{msg.text}</p>
            </div>
          ))}
        </div>
      </div>
      <form className="border-t border-gray-300 p-4 bg-white" onSubmit={submitMessage}>
        <div className="flex space-x-4">
          <input
            id="messageInput"
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="flex-grow rounded-lg border-gray-300 p-2"
            placeholder="Type your message"
          />
          <button type="submit" className="bg-blue-500 text-white rounded-lg px-4 py-2">Send</button>
        </div>
      </form>
    </div>
  );
}

export default ChatRoom;