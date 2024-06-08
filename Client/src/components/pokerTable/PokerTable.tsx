import React, { useEffect, useRef, useState } from 'react';
import ChatRoomService from '../../services/chatRoom.service';
import PokerCard from '../pokerCard/PokerCard';
import { User } from '../../models/user';
import { useRoom } from '../../contexts/roomSettingsContext';
import { useSocket } from '../../contexts/SocketContext';
import styles from './PokerTable.module.css';
import Modal from '../modal/modal';
import { ModalProps } from '../../models/modalProps';

interface Props {
    // define your props here
}

const PokerTable: React.FC<Props> = (props) => {
    const socket = useSocket();
    const roomCtx = useRoom();
    const shotClockRef = useRef<HTMLDivElement>(null);
    const shotClockTimerRef = useRef<any>(null);
    let api = useRef<ChatRoomService>();
    const [modalProps, setModalProps] = useState<ModalProps>({} as ModalProps);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [playCards, setPlayCards] = useState<number[]>([]);

    socket.on('shotClock', (res) => {
        const data = JSON.parse(res);
        if (!shotClockTimerRef.current) {
            // create a timer that updates showVotes
            shotClockTimerRef.current = setInterval(() => {
                //parse shotClockRef.current?.innerText to int 
                let nbr = shotClockRef.current ? parseInt(shotClockRef.current.innerText) : 0;
                if (isNaN(nbr)) {
                    nbr = 0;
                }
                nbr = nbr + 1;
                shotClockRef.current!.innerText = nbr.toString();
                if (nbr >= 2) {
                    stop(data);
                    shotClockRef.current!.onclick = () => shotClock();
                    shotClockRef.current!.innerHTML = `<p>Shot Clock</p>`;
                }
            }, 1000);
        }
    });

    socket.on('showVotes', () => {

    });

    useEffect(() => {
        // check the querystring to retrieve the room name
        const roomName = new URLSearchParams(window.location.search).get('roomName') ?? ChatRoomService.getRoomName();
        if (roomName === null) {
            window.location.href = '/newRoom';
        }
        else {
            api.current = ChatRoomService.getInstance(socket, roomName);
            setPlayCards(roomCtx.playCards);
        }
    }, []);
    useEffect(() => {
        setShowModal(false);
    }, [roomCtx.users])
    const stop = (data: any) => {
        clearInterval(shotClockTimerRef.current);
        setShowModal(true);
        setModalProps({
            title: "Results",
            content:
                <div>
                    <div className={`${styles['voters-result']}`}>
                        {data.cards.map((card: any, i: number) => {
                            return <span>
                                <PokerCard display={card.value} isActive={false} />
                                {card.users.map((user: any, j: number) => {
                                    return <p>{user}</p>
                                })}
                            </span>
                        })}
                    </div>
                    <hr />
                    <p>Total votes: {data.votes}</p>
                    <p>Average: {data.average}</p>
                    <p>Closest: {data.closest}</p>
                </div >,
            close: () => { setShowModal(false); api.current?.resetVotes(); },
            actions: <>
                <button onClick={() => {
                    setShowModal(false); api.current?.resetVotes();
                }
                } data-modal-hide="default-modal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">New Game</button>
            </>
        } as unknown as ModalProps);
    };

    const toggleButton = (user: User, cardIndex: number): void => {
        if (user.value === cardIndex.toString()) {
            cardIndex = -1;
        }
        api.current?.voted(cardIndex);
    }

    const shotClock = (): void => {
        api.current?.showVotes();
    };

    return (
        <>
            <div className={styles['poker-table']}>
                <div
                    id='players'
                    className="flex max-h-[80%] flex-col flex-wrap justify-center"
                >
                    {roomCtx.users.map((user, i: number) => {
                        if (ChatRoomService.getUserId() !== user.userId) {
                            return (
                                <div key={`${user.userId}_${i} `} className='flex flex-row items-center'>
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
                                    {user.voted && <span style={{ '--index': `${i}` } as React.CSSProperties} className={`flex flex-row m-5 ${styles.card} ${styles.animate}`}>
                                        <PokerCard
                                            key={`${user.userId}_${i}_${0} `}
                                            display={showModal ? user.value : '?'}
                                            isActive={false}
                                        />
                                    </span>}
                                </div>);
                        }
                    })}
                </div>
                <div id='me' className='absolute bottom-0 left-1/3'>
                    {roomCtx.users.filter(x => x.userId === ChatRoomService.getUserId()).map((user, i) => {
                        return (<div key={`${user.userId}_${i} `} className='flex flex-row'>
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
                                        key={`${user.userId}_${i}_${idx} `}
                                        display={card.toString()}
                                        isActive={card === Number(user.value)}
                                        onClick={() => toggleButton(user, card)}
                                    />
                                ))}
                            </span>
                        </div>);
                    })}
                </div>
                <div ref={shotClockRef} className="absolute bottom-0 right-0" onClick={shotClock}>
                    <p>Shot Clock</p>
                </div>
            </div>
            {showModal && <Modal {...modalProps}></Modal>}
        </>
    );
}

export default PokerTable;