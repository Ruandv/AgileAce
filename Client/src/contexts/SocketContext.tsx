import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { SocketEvents } from './enums';
import { ClientToServerEvents, ServerToClientEvents } from '../models/socket-io';

interface SocketContextType extends Socket { }

const SocketContext = createContext<SocketContextType | null>(null);

interface SocketProviderProps {
  url: string;
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ url, children }) => {
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(url, {
    withCredentials: false,
    extraHeaders: {
      "my-custom-header": "abcd"
    }
  });

  const [messages, setMessages] = useState<Date>();

  useEffect(() => {
    socket.on(SocketEvents.Connect, () => {
      console.log('Connected to server');
      setMessages(new Date());
    });
    socket.on("join", () => { });
    socket.on("chat", () => { });
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