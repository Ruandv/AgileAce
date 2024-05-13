import React, { useEffect, useState } from 'react';
import Login from '../../components/login/Login';
import PokerCard from '../../components/pokerCard/PokerCard';

const NewRoom = () => {
    useEffect(() => {
        console.log('NewRoom component mounted');
    }, []);
    const [selected, setSelected] = useState<number | null>(null);

    return (
        <div className="flex justify-center items-center h-screen">
            {selected}
            {[1, 2, 3, 4].map((i) => 
                <PokerCard 
                    key={i}
                    display={i.toString()} 
                    isActive={selected === i} 
                    onClick={() => { setSelected(i) }} 
                />
            )}
            <div className="w-6/10 p-4 border border-gray-300 mx-2 text-center">
                <Login />
            </div>
        </div>
    );
};

export default NewRoom;