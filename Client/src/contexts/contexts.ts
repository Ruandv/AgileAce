import { createContext } from "react";
import { defaultSocket } from "./SocketContext";
import { defaultRoom } from "./roomSettingsContext";

export const RoomSettingsContext = createContext(defaultRoom);
export const SocketContext = createContext(defaultSocket);