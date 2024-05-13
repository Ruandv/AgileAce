import React, { useEffect} from 'react';


const NewRoom = () => {
    useEffect(() => {
        console.log('NewRoom component mounted');
    }, []);
    return (
        <div className="flex h-screen ">

        </div>
    );
};

export default NewRoom;