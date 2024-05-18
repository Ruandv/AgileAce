import { Settings } from "./settings";
import { ChatMessage } from "./chatMessage";
import { User } from "./user";

export interface ChatRoom {
    roomId:string;
    roomName: string;
    users: User[];
    messages: ChatMessage[];
    settings: Settings;
}