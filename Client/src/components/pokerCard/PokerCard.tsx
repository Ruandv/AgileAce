import React, { useRef, useState } from 'react';
import './PokerCard.css';


interface PokerCardProps { 
    display: string;
    isActive?: boolean;
    onClick?: () => void;
}

function PokerCard(pokerCardProps: PokerCardProps) {
    return (
        <div key={pokerCardProps.display} tabIndex={1} className={`poker-card ${pokerCardProps.isActive===true ? 'slide' : 'back'}`} onClick={() => {
            
            pokerCardProps.onClick && pokerCardProps.onClick()
        }}>
            {pokerCardProps.isActive ? pokerCardProps.display : '?'}
        </div>
    );
}

export default PokerCard;