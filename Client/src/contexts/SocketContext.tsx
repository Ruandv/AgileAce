import React, {
    createContext,
    ReactNode,
    useState,
    useContext,
    useEffect,
} from "react";
import { io, Socket } from "socket.io-client";
import { ChatMessage } from "../models/chatMessage";
import { Settings } from "../models/settings";
import { ChatRoom } from "../models/chatRoom";

const API_URL = process.env.REACT_APP_API_URL!;

// Create the default socket connection
export const defaultSocket = io(API_URL, {
    withCredentials: false,
    extraHeaders: {
        "my-custom-header": "abcd",
        "my-user-name": sessionStorage.getItem("userName") ?? localStorage.getItem("userName") ?? "John Doe",
        "my-user-id": sessionStorage.getItem("userId") ?? localStorage.getItem("userId") ?? '',
    },
});

export const defaultChatRoom: ChatRoom =
{
    roomId: "123",
    roomName: "Default Room",
    users: [],
    messages: [],
    settings: {} as Settings
};

// Define the context type
export interface SocketContextType {
    chatMessages: ChatMessage[];
    socket: Socket;
    chatRoom: ChatRoom;
    setSocket: React.Dispatch<React.SetStateAction<Socket>>;
    setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

// Create the context with default values
export const SocketContext = createContext<SocketContextType>({
    chatMessages: [],
    socket: defaultSocket,
    chatRoom: defaultChatRoom,
    setSocket: () => {
        throw new Error("setSocket function must be overridden");
    },
    setChatMessages: () => {
        throw new Error("setChatMessages function must be overridden");
    }
});

// Define the provider props
export type SocketContextProviderProps = {
    children: ReactNode;
};

// Create the provider component
export const SocketContextProvider = ({
    children,
}: SocketContextProviderProps): JSX.Element => {
    const [socket, setSocket] = useState<Socket>(defaultSocket);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatRoom, setChatRoom] = useState<ChatRoom>(defaultChatRoom);

    // Optionally, add any side effects related to the socket here
    useEffect(() => {
        // Example: handle socket connection/disconnection
        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
            // join the room that is in useRoom

        });

        socket.on('userId', (userId: string) => {
            console.log('User ID received:', userId);
            sessionStorage.setItem('userId', userId);
            localStorage.setItem('userId', userId);
        });

        socket.on("updateSettings", (msg: string) => {
            console.log("Update Settings received:", msg);
            setChatMessages(JSON.parse(msg).messages);
            setChatRoom(JSON.parse(msg));
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected");
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.close();
        };
    }, [socket]);

    return (
        <SocketContext.Provider value={{ chatMessages, setChatMessages, socket, setSocket, chatRoom: chatRoom }}>
            {children}
        </SocketContext.Provider>
    );
};

// Hook to use the socket context
export const useSocket = (): Socket => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketContextProvider");
    }
    return context.socket;
};

// Hook to use the setSocket function
export const useSetSocket = (): React.Dispatch<React.SetStateAction<Socket>> => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSetSocket must be used within a SocketContextProvider");
    }
    return context.setSocket;
};

// Hook to use the chat messages
export const useChatMessages = (): ChatMessage[] => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useChatMessages must be used within a SocketContextProvider");
    }
    return context.chatMessages;
};


// Hook to use the chat messages
export const useChatRoom = (): ChatRoom => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useChatRoom must be used within a SocketContextProvider");
    }
    return context.chatRoom;
};
