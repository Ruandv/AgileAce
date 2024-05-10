import { Message } from "./message";
import { User } from "./user";

export interface ChatRoom {
    roomId:string;
    roomName: string;
    users: User[];
    messages: Message[];
}