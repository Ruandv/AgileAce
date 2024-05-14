import React, { useEffect, useState } from 'react';
import ChatRoom from '../../components/chatroom/ChatRoom';
import PokerCard from '../../components/pokerCard/PokerCard';


const NewRoom = () => {
    useEffect(() => {
        console.log('NewRoom component mounted');
    }, []);
    const [selected, setSelected] = useState<number | null>(null);

    return (
        <div className="flex h-screen ">
            <div id='left'><ChatRoom></ChatRoom></div>
            <div id='rhs' className='flex flex-col flex-grow'>
                <div id='toolbar' className="bg-red-500 flex flex-col items-center justify-center min-h-[3em]">toolbar</div>
                <div id='right' className="bg-red-300 flex flex-col items-center justify-center flex-grow">
                    <span className='flex flex-row'>
                        {selected}
                        {[1, 2, 3, 4].map((i) =>
                            <PokerCard
                                display={i.toString()}
                                isActive={(selected !== null && selected === i) ? true : false}
                                onClick={() => { setSelected(i) }}
                            />
                        )}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default NewRoom;