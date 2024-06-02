/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef } from 'react';
import ChatRoomService from '../../services/chatRoom.service';
import { useSocket } from '../../contexts/SocketContext';
import ChatRoom from '../../components/chatroom/ChatRoom';
import { useRoom } from '../../contexts/roomSettingsContext';
import PokerTable from '../../components/pokerTable/PokerTable';
import styles from './PlayRoom.module.css';

const PlayRoom = () => {
    const socket = useSocket();
    const roomCtx = useRoom();
    let api = useRef<ChatRoomService>();
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
    }, [socket]);

    return (
        <>
            <nav className="bg-white border-gray-200 dark:bg-gray-900">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Agile Ace</span>
                    </a>
                    <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                </div>
            </nav>
            <div className={styles.container}>
                <div className={styles['chat-pane']} id="chatroom"><ChatRoom></ChatRoom></div>
                <div className={styles['play-area']} id="playroom">
                    <PokerTable></PokerTable>
                </div>
            </div>
        </>
    );
};
export default PlayRoom;
