import React, {
    createContext,
    useState,
    ReactNode,
    Dispatch,
    SetStateAction,
    useContext,
    Context,
    useEffect,
} from 'react';

import { ChatMessage } from '../models/chatMessage';
import { User } from '../models/user';
import { Settings } from '../models/settings';
import { useChatRoom } from './SocketContext';

// Define the Room interface
export interface Room {
    roomName: string;
    users: User[];
    messages: ChatMessage[];
    settings: Settings;
    me: User;
}

// Define the context type
export interface RoomContextType {
    room: Room;
    setRoom: Dispatch<SetStateAction<Room>>;
}

// Define the default room
export const defaultRoom: Room = {
    roomName: "default room",
    users: [],
    messages: [{
        text: 'Welcome to the chat!',
        userId: 'test',
        date: new Date()
    } as ChatMessage],
    settings: {} as Settings,
    me: {} as User,
};

// Create the context with default values
export const RoomContext: Context<RoomContextType> = createContext<RoomContextType>({
    room: defaultRoom,
    setRoom: () => {
        throw new Error('setRoom function must be overridden');
    },
});

// Define the provider props
export type RoomContextProviderProps = {
    children: ReactNode;
};

// Create the provider component
export const RoomContextProvider = ({ children }: RoomContextProviderProps): JSX.Element => {
    const [room, setRoom] = useState<Room>(defaultRoom);
    const chatRoom = useChatRoom();
    useEffect(() => {
        if(chatRoom.roomId === '') return;
        const data = {
            roomName: chatRoom.roomName,
            users: chatRoom.users,
            messages: chatRoom.messages,
            settings: chatRoom.settings,
            me: chatRoom.users.find(u => u.userId === '3')?? {} as User
        };
        setRoom(data as Room)
    }, [chatRoom]);
    return (
        <RoomContext.Provider value={{ room, setRoom }}>
            {children}
        </RoomContext.Provider>
    );
};

// Hook to use the Room context
export const useRoom = (): Room => {
    const context = useContext(RoomContext);
    if (!context) {
        throw new Error('useRoom must be used within a RoomContextProvider');
    }
    return context.room;
};

// Hook to use the setRoom function
export const useSetRoom = (): Dispatch<SetStateAction<Room>> => {
    const context = useContext(RoomContext);
    if (!context) {
        throw new Error('useSetRoom must be used within a RoomContextProvider');
    }
    return context.setRoom;
};
