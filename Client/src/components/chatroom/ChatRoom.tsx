import React, { useEffect, useRef } from 'react';
import './ChatRoom.css';
import ChatRoomService from '../../services/chatRoom.service';
import { useChatMessages, useChatRoom, useSocket } from '../../contexts/SocketContext';
import { useRoom } from '../../contexts/roomSettingsContext';

function ChatRoom() {
  const socket = useSocket();
  const message = useRef<HTMLInputElement>(null);

  const chatRoomService = ChatRoomService.getInstance(socket);
  const messages = useChatMessages();
  const room = useRoom();
  useEffect(() => {

  }, []);

  const submitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.current) {
      chatRoomService.send(message.current.value);
      message.current.value = "";
    }
  };

  const DIVISIONS = [
    { amount: 60, name: "seconds" },
    { amount: 60, name: "minutes" },
    { amount: 24, name: "hours" },
    { amount: 7, name: "days" },
    { amount: 4.34524, name: "weeks" },
    { amount: 12, name: "months" },
    { amount: Number.POSITIVE_INFINITY, name: "years" },
  ]

  const renderMessages = () => {
    const getRTF = (date: Date): React.ReactNode => {
      // convert the date to Intl.RelativeTimeFormat
      const formatter = new Intl.RelativeTimeFormat(undefined, {
        numeric: "auto",
      })

      let duration = (new Date(date).getTime() - new Date().getTime()) / 1000

      for (let i = 0; i < DIVISIONS.length; i++) {
        const division = DIVISIONS[i]
        if (Math.abs(duration) < division.amount) {
          return formatter.format(Math.round(duration), (division.name as any))
        }
        duration /= division.amount
      }
      return 'long ago';
    }
    function getUserName(userId: string): React.ReactNode {
      const user = room.users.find((user) => user.userId === userId);
      return user?.userName ?? 'Unknown';
    }

    return messages.map((msg, index) => (
      <div key={index} className="p-4 rounded-lg bg-white shadow">
        <div className="flex">
          <div className="w-1/4 m-2">
            <img className="card-img-top" src="https://i.pravatar.cc/200" width="100%" alt=""></img>
          </div>
          <div className="w-3/4 m-2">
            <h3 className=" font-bold">{getUserName(msg.userId)}</h3>
            <small>{getRTF(msg.date)}</small>
          </div>
        </div>
        <div className="m-2">
          <p className="text-gray-800">{msg.text}</p>
        </div>
      </div>
    ))
  }

  return (
    <>
      <form
        className="border-t border-gray-300 p-4 bg-white sticky top-0 mt-auto"
        onSubmit={submitMessage}
      >
        <div className="flex space-x-4 flex-row flex-grow">
          <input
            id="messageInput"
            ref={message}
            className="flex-grow rounded-lg border-gray-300 p-2 block"
            placeholder="Type your message"
          />

        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-sm right-0 px-4 py-2"
        >
          Send
        </button>
      </form>
      <div className="flex flex-col bg-gray-100 text-sm">
        <div className="px-6 py-4">
          <div className="border-b border-gray-300 mb-6 pb-2 flex justify-between items-center">
            <h1 className="text-3xl font-semibold">
              Chat Room ({room.users.length.toString()} users)
            </h1>
          </div>
          <div className="chat-history flex flex-col space-y-4  flex-col-reverse">
            {renderMessages()}
          </div>
        </div>
      </div>

    </>
  );
}

export default ChatRoom;
