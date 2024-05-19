import { createContext } from "react";
import { defaultSocket } from "./socketContext";
import { defaultRoom } from "./roomSettingsContext";

export const RoomSettingsContext = createContext(defaultRoom);
export const SocketContext = createContext(defaultSocket);