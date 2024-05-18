import React, { useEffect } from 'react';
import Login from '../../components/login/Login';

const NewRoom = () => {
    useEffect(() => {
        console.log('NewRoom component mounted');        
    }, []);

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-6/10 p-4 border border-gray-300 mx-2 text-center">
                <Login />
            </div>
        </div>
    );
};

export default NewRoom;