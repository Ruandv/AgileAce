import React, { useEffect, useRef, useState } from 'react';
import { useRoom } from '../../contexts/roomSettingsContext';
import ChatRoomService from '../../services/chatRoom.service';
import { useChatMessages, useSocket } from '../../contexts/socketContext';
import ChatRoom from '../../components/chatroom/ChatRoom';
import PokerCard from '../../components/pokerCard/PokerCard';
import { User } from '../../models/user';
import './PlayRoom.css';
import Modal from '../../components/modal/modal';

const PlayRoom = () => {
    const room = useRoom();
    const socket = useSocket();
    const messages = useChatMessages();
    const [connectedUsers, setConnectedUsers] = useState<string>('');

    const [isModalOpen, setIsModalOpen] = useState(false);

    let api = useRef<ChatRoomService>();
    useEffect(() => {
        socket.on("usersCount", (msg: string) => {
            setConnectedUsers(msg);
        });
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
                const userName = (document.getElementById('first_name') as HTMLInputElement).value;
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
            {(messages.length) && (
                <>
                    <div>Socket:
                        <div>Connected Users: {connectedUsers}</div>
                        <div>Total Messages : {messages.length}</div>
                    </div>
                    {/* <div>Messages:
                        <pre>{JSON.stringify(messages, null, 2)}</pre>
                    </div><div>Room:
                        <pre>{JSON.stringify(room, null, 2)}</pre>
                    </div> */}
                </>
            )}
            <div className="flex h-screen ">
                <div id='left'><ChatRoom></ChatRoom></div>
                <div id='rhs' className='flex flex-col flex-grow'>
                    <div id='toolbar' className="bg-red-500 flex flex-col items-center justify-center min-h-[3em]">toolbar

                        <button className="btn" onClick={() => setIsModalOpen(true)}>Set UserName</button>

                    </div>
                    <div id='right' className="bg-red-300 flex flex-col items-center justify-center flex-grow">
                        <div className="flex flex-col items-center justify-center">
                            <span>Room: {room.roomName}</span>
                            <span>Users: {room.users.length}</span>
                            <span>Connected Users: {connectedUsers}</span>
                        </div>
                        <div className="grid gap-4 grid-cols-1 grid-rows-2">
                            <span className='flex flex-row flex-space'>
                                {room.users?.map((u: User, i: number) =>
                                    <div className='min-w-[50px]'>
                                        <span>{u.userName}</span>
                                    </div>
                                )}
                            </span>
                            {isModalOpen && (
                                <Modal {...modalProps}
                                >
                                </Modal>
                            )}
                            <span className='flex flex-row'>
                                {[1, 2, 3, 4].map((i) =>
                                    <PokerCard
                                        display={i.toString()}
                                        isActive={false}
                                        onClick={() => { }}
                                    />
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};

export default PlayRoom;