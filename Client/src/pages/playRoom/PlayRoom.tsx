import React, { Ref, useContext, useEffect, useRef, useState } from 'react';
import { useRoom } from '../../contexts/roomSettingsContext';
import ChatRoomService from '../../services/chatRoom.service';
import { useChatMessages, useSocket } from '../../contexts/socketContext';
import ChatRoom from '../../components/chatroom/ChatRoom';
import PokerCard from '../../components/pokerCard/PokerCard';
import { User } from '../../models/user';

const PlayRoom = () => {
    const room = useRoom();
    const socket = useSocket();
    const messages = useChatMessages();
    const [connectedUsers, setConnectedUsers] = useState<string>('');

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
    return (
        <>
            {(messages.length > 100000) && (
                <><div>Socket:
                    <div>Connected Users: {connectedUsers}</div>
                    <div>Total Messages : {messages.length}</div>
                </div><div>Messages:
                        <pre>{JSON.stringify(messages, null, 2)}</pre>
                    </div><div>Room:
                        <pre>{JSON.stringify(room, null, 2)}</pre>
                    </div></>
            )}
            <div className="flex h-screen ">
                <div id='left'><ChatRoom></ChatRoom></div>
                <div id='rhs' className='flex flex-col flex-grow'>
                    <div id='toolbar' className="bg-red-500 flex flex-col items-center justify-center min-h-[3em]">toolbar</div>
                    <div id='right' className="bg-red-300 flex flex-col items-center justify-center flex-grow">
                        <div className="grid gap-4 grid-cols-1 grid-rows-2">
                            <span className='flex flex-row flex-space'>
                                {room.users?.map((u: User, i: number) =>
                                    <div className='min-w-[50px]'>
                                        <span>{u.userName}</span>
                                    </div>
                                )}
                            </span>



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