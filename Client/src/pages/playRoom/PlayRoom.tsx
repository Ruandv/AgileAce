import React, { useEffect, useRef, useState } from 'react';
import { useRoom } from '../../contexts/roomSettingsContext';
import ChatRoomService from '../../services/chatRoom.service';
import { useChatMessages, useSocket } from '../../contexts/SocketContext';
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
    const [selectedCard, setSelectedCard] = useState<string>('0');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [playCards, setPlayCards] = useState<number[]>([]);

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
            setPlayCards( api.current!.getPlayCards());

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
    {/* <div id='toolbar' className="bg-red-500 flex flex-col items-center justify-center min-h-[3em]">toolbar



</div> */}
 

    const [activeButton, setIsActiveButton] = useState(0);

    function toggleButton(buttonIndex: number): void {
        const buttons: NodeListOf<HTMLButtonElement> = document.querySelectorAll(
            '[class^="votebutton"]'
        );
        const currentButton: HTMLButtonElement = buttons[buttonIndex - 1];

        if (
            activeButton === buttonIndex &&
            currentButton.classList.contains("slide-up")
        ) {
            // Slide down the button if already in "slide-up" position
            currentButton.classList.remove("slide-up");
            setIsActiveButton(0);
        } else {
            // Slide down previous button and slide up current button
            if (activeButton !== 0) {
                buttons[activeButton - 1].classList.remove("slide-up");
            }
            currentButton.classList.add("slide-up");
            setIsActiveButton(buttonIndex);
        }
        console.log("active button = " + activeButton);
    }

    return (
        <>
        <button className="btn" onClick={() => setIsModalOpen(true)}>Set UserName</button>
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
            <div className="mycontainer">
                <div className="mychat-pane" id="chatroom"><ChatRoom></ChatRoom></div>
                <div className="myplay-area" id="playroom">
                    <div className="poker-table">
                        <div
                            id="right"
                            className="flex items-center justify-center"
                        >
                            <span className="flex flex-row m-5">
                                {playCards.map((i) => (
                                    <PokerCard
                                        display={i.toString()}
                                        onClick={() => toggleButton(Number(i))}
                                    />
                                ))}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <Modal {...modalProps}
                >
                </Modal>
            )}
        </>
    );
};
export default PlayRoom;
