import React, { createContext, useContext, useEffect, useState } from 'react';
import socketIOClient, { Socket } from 'socket.io-client';
import { SocketEvents } from './enums';

interface SocketContextType extends Socket {}

const SocketContext = createContext<SocketContextType | null>(null);

interface SocketProviderProps {
  url: string;
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ url, children }) => {
  const socket = socketIOClient(url);
    const [messages,setMessages] = useState<Date>();

  useEffect(() => {
    socket.on(SocketEvents.Connect, () => {
        console.log('Connected to server');
        setMessages(new Date());
    });
    socket.on(SocketEvents.Joined, () => {});
    socket.on(SocketEvents.Send, () => {});
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = (): SocketContextType => {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return socket;
};