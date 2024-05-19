import React, { useRef } from 'react';
import './Login.css';
import ChatRoomService from '../../services/chatRoom.service';

function Login() {
    const userName = useRef<HTMLInputElement>(null); // Create a ref for the userName input element
    const roomName = useRef<HTMLInputElement>(null); // Create a ref for the roomName input element
    const submitChatName = async (event: React.FormEvent) => {
        event.preventDefault();
        ChatRoomService.setRoomName(roomName.current!.value); // Set the room name
        ChatRoomService.setUserName(userName.current!.value); // Set the room name

        // redirect to the chat room
        window.location.href = '/chat?roomName=' + roomName.current!.value + '&userName=' + userName.current!.value;
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 w:24">            
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
                        <label htmlFor="roomName" className="block text-sm font-medium leading-6 text-gray-900">
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
                        <label htmlFor="userName" className="block text-sm font-medium leading-6 text-gray-900">
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
    );
}

export default Login;