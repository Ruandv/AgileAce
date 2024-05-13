import React, { useRef, useState } from 'react';
import './PokerCard.css';


interface PokerCardProps {
    display: string;
    isActive?: boolean;
    onClick?: () => void;
}

function PokerCard(pokerCardProps: PokerCardProps) {
    let [isActive,setIsActive] = useState(pokerCardProps.isActive || false);
    return (
        <div tabIndex={1} className={`poker-card ${isActive===true ? 'slide' : 'back'}`} onClick={() => {
            setIsActive(!isActive); 
            pokerCardProps.onClick && pokerCardProps.onClick()
        }}>
            {isActive ? pokerCardProps.display : '?'}
        </div>
    );
}

export default PokerCard;