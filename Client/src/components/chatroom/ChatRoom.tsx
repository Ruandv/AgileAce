import React, { useEffect, useRef, useState } from 'react';
import './ChatRoom.css';
import ChatRoomService from '../../services/chatRoom.service';
import { useChatMessages, useSocket } from '../../contexts/SocketContext';

function ChatRoom() {
  const socket = useSocket();
  const message = useRef<HTMLInputElement>(null);

  const chatRoomService = ChatRoomService.getInstance(socket);
  const messages = useChatMessages();

  useEffect(() => {

  }, []);

  const submitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.current) {
      chatRoomService.send(message.current.value);
      message.current.value = "";
    }
  };
  // {
  //   <div key={index} className="flex items-center space-x-4">
  //     <div className="font-semibold">{msg.text}</div>
  //   </div>
  // ))}

  // <form className="border-t border-gray-300 p-4 bg-white" onSubmit={submitMessage}>
  //         <div className="flex space-x-4">
  //           <input
  //             id="messageInput"
  //             ref={message}
  //             className="flex-grow rounded-lg border-gray-300 p-2"
  //             placeholder="Type your message"
  //           />
  //           <button type="submit" className="bg-blue-500 text-white rounded-lg px-4 py-2">Send</button>
  //         </div>
  //       </form>

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
    return messages.map((msg, index) => (
      <li className="border-b border:gray-100 dark:border-gray-600">
        <a href="#" className="flex items-center justify-center w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800">
          <img className="me-3 rounded-full w-11 h-11" src="https://flowbite.com/docs/images/people/profile-picture-3.jpg" alt="Leslie Livingston Avatar"></img>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400"><span className="font-medium text-gray-900 dark:text-white">{msg.userId}</span> : what do you say?</p>
            <span className="text-xs text-blue-600 dark:text-blue-500">{getRTF(msg.date)}</span>
          </div>
        </a>
      </li>));
  }

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
    return messages.map((msg, index) => (
      <div key={index} className="p-4 rounded-lg bg-white shadow">
        <div className="flex">
          <div className="w-1/4 m-2">

            <img className="card-img-top" src="https://i.pravatar.cc/200" width="100%" alt="Card image cap"></img>
          </div>
          <div className="w-3/4 m-2">
            <h3 className=" font-bold">{msg.userId}</h3>
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
    <div>
      <div className="flex flex-col h-screen screen bg-gray-100 text-sm">
        <div className="overflow-auto h-full px-6 py-4">
          <div className="border-b border-gray-300 mb-6 pb-2 flex justify-between items-center">
            <h1 className="text-3xl font-semibold">
              Chat Room ({chatRoomService.getUserCount()})
            </h1>
          </div>
          <div className="chat-history space-y-4">
            {/* {chat.map((msg: any, index) => (
              
            ))} */}
            {renderMessages()}
          </div>
        </div>
        <form
          className="border-t border-gray-300 p-4 bg-white"
          onSubmit={submitMessage}
        >
          <div className="flex space-x-4 flex-row flex-grow">
            <input
              id="messageInput"
              ref={message}
              className="flex-grow rounded-lg border-gray-300 p-2 blcok"
              placeholder="Type your message"
            />

          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-sm px-4 py-2"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatRoom;
