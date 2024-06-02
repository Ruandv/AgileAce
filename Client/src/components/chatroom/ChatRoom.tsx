import React, { useEffect, useRef, useState } from 'react';
import './ChatRoom.css';
import ChatRoomService from '../../services/chatRoom.service';
import { useChatMessages, useSocket } from '../../contexts/SocketContext';
import { useRoom } from '../../contexts/roomSettingsContext';
import Modal from '../modal/modal';

function ChatRoom() {
  const socket = useSocket();
  const message = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const chatRoomService = ChatRoomService.getInstance(socket);
  const messages = useChatMessages();
  const room = useRoom();

  useEffect(() => {
    // check the querystring to retrieve the room name
    const roomName = new URLSearchParams(window.location.search).get('roomName') ?? ChatRoomService.getRoomName();
    const userName = new URLSearchParams(window.location.search).get('userName') ?? ChatRoomService.getUserName();
    if (roomName === null) {
      window.location.href = '/newRoom';
    }
    else {
      api.current = ChatRoomService.getInstance(socket, roomName);
      api.current.join(roomName, userName);
    }
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
  let api = useRef<ChatRoomService>();

  const modalProps = {
    title: "Change User Name",
    close: () => setIsModalOpen(false),
    content: <p>
      <div>
        <div className="relative">
          <input type="text" id="floating_filled" className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
          <label htmlFor="floating_filled" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Floating filled</label>
        </div>
      </div>
    </p>,
    actions: <>
      <button onClick={() => {
        // get the first_name value
        const userName = (document.getElementById('floating_filled') as HTMLInputElement).value;
        api.current?.userNameUpdated(userName);
        sessionStorage.setItem("userName", userName);
        setIsModalOpen(false)
      }
      } data-modal-hide="default-modal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">I accept</button>
      <button onClick={() => {
        setIsModalOpen(false)
      }
      }
        data-modal-hide="default-modal" type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Decline</button>
    </>
  };

  return (
    <>
      {isModalOpen && (
        <Modal {...modalProps}></Modal>
      )}

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
          type="button" mx-2
          className="bg-blue-400 text-white rounded-sm right-0 px-4 py-2 mx-2"
          onClick={() => setIsModalOpen(true)}
        >
          Change name
        </button>
        <button
          type="submit"
          className="bg-blue-800 text-white rounded-sm right-0 px-4 py-2"
        >
          Send
        </button>
      </form>
      <div className="flex flex-col bg-gray-100 text-sm">
        <div className="px-6 py-4">
          <div className="border-b border-gray-300 mb-6 pb-2 flex justify-between items-center">
            <h1 className="text-3xl font-semibold">
              {room.roomName} ({room.users.length.toString()} users)
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
