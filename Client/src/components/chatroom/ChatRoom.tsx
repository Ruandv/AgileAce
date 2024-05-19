import React, { useEffect, useRef, useState } from 'react';
import './ChatRoom.css';
import ChatRoomService from '../../services/chatRoom.service';
import { useChatMessages, useSocket } from '../../contexts/socketContext';

function ChatRoom() {
  const socket = useSocket();
  const message = useRef<HTMLInputElement>(null);
  const chatRoomService = ChatRoomService.getInstance(socket);
  const messages = useChatMessages();
  const submitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.current) {
      chatRoomService.send(message.current.value);
      message.current.value = '';
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

  return (
    <div className="min-w-96">
      <div className="flex flex-col h-screen screen bg-gray-100 text-sm">
        <div className="relative w-full max-w-sm overflow-y-scroll bg-white border border-gray-100 rounded-lg dark:bg-gray-700 dark:border-gray-600 h-96">
          <ul>
            {renderMessages()}
          </ul>

          <div className="sticky bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
            <form className="border-t border-gray-300 p-4 bg-white" onSubmit={submitMessage}>
              <div className="flex space-x-4">
                <input
                  id="messageInput"
                  ref={message}
                  className="flex-grow rounded-lg border-gray-300 p-2"
                  placeholder="Type your message"
                />
                <button type="submit" className="bg-blue-500 text-white rounded-lg px-4 py-2">Send</button>
              </div>
            </form>
            <div className="grid h-full max-w-lg grid-cols-3 mx-auto">
              <button type="button" className="inline-flex flex-col items-center justify-center font-medium px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
                <svg className="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                </svg>
                <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Clear Mesasges</span>
              </button>
              <button type="button" className="inline-flex flex-col items-center justify-center font-medium px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
                <svg className="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 19">
                  <path d="M14.5 0A3.987 3.987 0 0 0 11 2.1a4.977 4.977 0 0 1 3.9 5.858A3.989 3.989 0 0 0 14.5 0ZM9 13h2a4 4 0 0 1 4 4v2H5v-2a4 4 0 0 1 4-4Z" />
                  <path d="M5 19h10v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2ZM5 7a5.008 5.008 0 0 1 4-4.9 3.988 3.988 0 1 0-3.9 5.859A4.974 4.974 0 0 1 5 7Zm5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm5-1h-.424a5.016 5.016 0 0 1-1.942 2.232A6.007 6.007 0 0 1 17 17h2a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5ZM5.424 9H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h2a6.007 6.007 0 0 1 4.366-5.768A5.016 5.016 0 0 1 5.424 9Z" />
                </svg>
                <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Export</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ChatRoom;