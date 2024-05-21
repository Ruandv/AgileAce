import { io, Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from '../models/socket-io';

class ChatRoomService {
  private static instances: ChatRoomService[] = [];
  private static instance: ChatRoomService;
  private static readonly baseUrl = 'http://localhost:3000';
  private roomName: string = '';
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(ChatRoomService.baseUrl, {
    withCredentials: false,
    extraHeaders: {
      "my-custom-header": "abcd"
    }
  });

  private constructor(roomName: string) {

    this.socket.on('updateSettings', (msg) => {
      // save the settings to local storage
      console.log('updateSettings: ' + msg);
      this.roomName = JSON.parse(msg).roomName;
      localStorage.setItem('roomSettings', msg);
      window.location.href = '/chat';
    });
    this.roomName = roomName;
  }

  static getInstance(roomName?: string) {
    if (!roomName) {
      roomName = ChatRoomService.getRoomName();
    }
    console.log('getting service instance for' + roomName);
    if (!ChatRoomService.instances) {
      console.log('Creating a new instance: ' + roomName);
      ChatRoomService.instance = new ChatRoomService(roomName!);
      // add the instance to the instances array
      ChatRoomService.instances = [ChatRoomService.instance];
    }
    else {
      // check if the instance already exists
      let instance = ChatRoomService.instances.find((instance) => instance.roomName === roomName);
      if (!instance) {
        console.log('Creating a new instance for room: ' + roomName);
        // create a new instance
        instance = new ChatRoomService(roomName!);
        // add the instance to the instances array
        ChatRoomService.instances.push(instance);
      }
      ChatRoomService.instance = instance;
    }
    return ChatRoomService.instance;
  }

  async getMessages() {
    const roomSettings = localStorage.getItem('roomSettings');
    if (roomSettings) {
      const data = JSON.parse(roomSettings);
      return data.messages;
    }
    else {
      window.location.href = '/newRoom';
    }
  }

  async getPlayCards() {
    const roomSettings = localStorage.getItem('roomSettings');
    if (roomSettings) {
      const data = JSON.parse(roomSettings);
      return data.playCards;
    }
    else {
      window.location.href = '/newRoom';
    }
  }

  getUserCount() {
    const roomSettings = localStorage.getItem('roomSettings');
    if (roomSettings) {
      const data = JSON.parse(roomSettings);
      return data.users.length;
    }
    else {
      window.location.href = '/newRoom';
    }
  }

  public static getRoomName() {
    const roomSettings = localStorage.getItem('roomSettings');
    if (roomSettings) {
      const data = JSON.parse(roomSettings);
      return data.roomName;
    }
    else {
      window.location.href = '/newRoom';
    }
  }

  async join(roomName: string, userName: string) {
    this.socket.emit('join', roomName, userName);
  }

  async send(message: string) {
    this.socket.emit('chat', this.roomName, message);
  }


}

export default ChatRoomService;