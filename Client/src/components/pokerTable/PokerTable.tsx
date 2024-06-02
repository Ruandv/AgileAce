import React, { useEffect, useRef, useState } from 'react';
import ChatRoomService from '../../services/chatRoom.service';
import PokerCard from '../pokerCard/PokerCard';
import { User } from '../../models/user';
import { useRoom } from '../../contexts/roomSettingsContext';
import { useSocket } from '../../contexts/SocketContext';
import styles from './PokerTable.module.css';

interface Props {
    // define your props here
}

const PokerTable: React.FC<Props> = (props) => {
    const socket = useSocket();
    const roomCtx = useRoom();
    let api = useRef<ChatRoomService>();

    const [playCards, setPlayCards] = useState<number[]>([]);

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
            setPlayCards(roomCtx.playCards);
        }
    }, []);

    function toggleButton(user: User, cardIndex: number): void {
        if (user.value === cardIndex.toString()) {
            cardIndex = -1;
        }
        api.current?.voted(cardIndex);
    }
    return (
        <>
            <div className={styles['poker-table']}>
                <div
                    id="right"
                    className="flex items-center justify-center"
                >
                    <div>
                        {roomCtx.users.map((user, i) => {
                            if (ChatRoomService.getUserId() !== user.userId) {
                                return (
                                    <div key={`${user.userId}_${i}`} className='flex flex-row'>
                                        <div className="flex flex-col items-center">
                                            <img
                                                className="rounded-full h-16 w-16"
                                                src="https://i.pravatar.cc/200"
                                                alt="user"
                                            />
                                            <p className="text-sm font-semibold text-gray-800">
                                                {user.userName}
                                            </p>
                                        </div>
                                        <span className="flex flex-row m-5">

                                            <PokerCard
                                                key={`${user.userId}_${i}_${0}`}
                                                display={'?'}
                                                isActive={user.voted === true}
                                            />
                                        </span>
                                    </div>);
                            }
                        })}
                    </div>
                </div>
                <div className='absolute bottom-0 left-1/3'>
                    {roomCtx.users.filter(x => x.userId === ChatRoomService.getUserId()).map((user, i) => {
                        return (<div key={`${user.userId}_${i}`} className='flex flex-row'>
                            <div className="flex flex-col items-center">
                                <img
                                    className="rounded-full h-16 w-16"
                                    src="https://i.pravatar.cc/200"
                                    alt="user"
                                />
                                <p className="text-sm font-semibold text-gray-800">
                                    {user.userName} (ME)
                                </p>
                            </div>
                            <span className="flex flex-row m-5">
                                {playCards?.map((card, idx) => (
                                    <PokerCard
                                        key={`${user.userId}_${i}_${idx}`}
                                        display={card.toString()}
                                        isActive={card === Number(user.value)}
                                        onClick={() => toggleButton(user, card)}
                                    />
                                ))}
                            </span>
                        </div>);
                    })}
                </div>
            </div>
        </>
    );
}

export default PokerTable;