import React, { useEffect, useRef } from "react";
import ChatRoomService from "../../services/chatRoom.service";

const NewRoom = () => {
  const userName = useRef<HTMLInputElement>(null); // Create a ref for the userName input element
  const roomName = useRef<HTMLInputElement>(null); // Create a ref for the roomName input element
  const submitChatName = async (event: React.FormEvent) => {
    event.preventDefault();
    // post to the server to check if the room exist if exist then save the config and redirect to the chat room
    const service = ChatRoomService.getInstance("roomName");
    await service.join(
      roomName.current?.value as string,
      userName.current?.value as string
    );
    // redirect to the chat room
    window.location.href = "/chat";
  };
  const buttons = [
    {
      id: 1,
      displayValue: 1,
    },
    {
      id: 2,
      displayValue: 2,
    }
  ];
  useEffect(() => {
    console.log("NewRoom component mounted");
  }, []);
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-3/10 p-4 border border-gray-300 mx-2 text-center hidden lg:block">
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-10 w-auto"
              src="logo192.png"
              alt="Your Company"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Join a room
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" action="#" method="POST">
              <div>
                <label
                  htmlFor="roomName"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Room Name
                </label>
                <div className="mt-2">
                  <input
                    ref={roomName}
                    id="roomName"
                    name="roomName"
                    type="text"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="userName"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  User Name
                </label>
                <div className="mt-2">
                  <input
                    ref={userName}
                    id="userName"
                    name="userName"
                    type="text"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={submitChatName}
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="container mx-auto my-8">
        <div className="relative mx-auto mb-4 h-10 w-10 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600">
          <svg
            className="absolute -left-1 h-12 w-12 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>
        <h1 className="mb-4 text-center text-3xl font-bold">Agile Ace!</h1>
        <h2 className="mb-4 text-center text-2xl">Estimate this task:</h2>
        <div className="inline-flex w-full items-center justify-center">
          <hr className="my-8 h-px w-64 border-0 bg-gray-200 dark:bg-gray-700" />
          <span className="absolute left-1/2 -translate-x-1/2 bg-white px-3 font-medium text-gray-900 dark:bg-gray-900 dark:text-white">
            Task:
          </span>
        </div>
        <h3 className="mb-4 text-center text-xl font-bold">
          Sage 300 Integration
        </h3>
        <div className="inline-flex w-full items-center justify-center">
          <hr className="my-8 h-px w-64 border-0 bg-gray-200 dark:bg-gray-700" />
          <span className="absolute left-1/2 -translate-x-1/2 bg-white px-3 font-medium text-gray-900 dark:bg-gray-900 dark:text-white">
            (Estimates In Hours)
          </span>
        </div>
        <div className="mx-4 grid grid-cols-4 gap-4 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {buttons.map((button) => (
            <button className="h-16 w-16 rounded-full
            bg-blue-500 px-4 py-2 
              font-bold text-white hover:bg-blue-700">
              {button.displayValue}
            </button>
          ))}
        </div>
        <div className="inline-flex w-full items-center justify-center">
          <hr className="my-8 h-px w-64 border-0 bg-gray-200 dark:bg-gray-700" />
          <span className="absolute left-1/2 -translate-x-1/2 bg-white px-3 font-medium text-gray-900 dark:bg-gray-900 dark:text-white">
            or
          </span>
        </div>
        <div className="mx-4 grid grid-cols-4 gap-4 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <button className="col-span-4 rounded-xl bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
            Not Sure ?
          </button>
        </div>
        <div id="estimates" className="flex flex-wrap justify-center"></div>
      </div>
      <div className="w-3/10 p-4 border border-gray-300 mx-2 text-center hidden lg:block">
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-10 w-auto"
              src="logo192.png"
              alt="Your Company"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Lets Talk!
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" action="#" method="POST">
              <div>
              
              <div className="flex items-start gap-2.5">
   <div className="flex flex-col gap-1 w-full max-w-[320px]">
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
         <span className="text-sm font-semibold text-gray-900 dark:text-white">Bonnie Green</span>
         <span className="text-sm font-normal text-gray-500 dark:text-gray-400">11:46</span>
      </div>
      <div className="flex flex-col leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
         <p className="text-sm font-normal text-gray-900 dark:text-white"> How will we determine the best time for this estimate?</p>
      </div>
      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Delivered</span>
   </div>
   </div>

   <div className="flex flex-col gap-1 w-full max-w-[320px]">
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
         <span className="text-sm font-semibold text-gray-900 dark:text-white">Johnny Blue</span>
         <span className="text-sm font-normal text-gray-500 dark:text-gray-400">11:51</span>
      </div>
      <div className="flex flex-col leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
         <p className="text-sm font-normal text-gray-900 dark:text-white"> It is really simple, we use Agile Ace!</p>
      </div>
      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Delivered</span>
   </div>
              </div>

              <div>
                <label
                  htmlFor="userName"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  User Name
                </label>
                <div className="mt-2">
                  <input
                    ref={userName}
                    id="userName"
                    name="userName"
                    type="text"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={submitChatName}
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRoom;
