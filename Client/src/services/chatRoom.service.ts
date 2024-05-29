import { Socket } from "socket.io-client";

class ChatRoomService {
  private static instances: ChatRoomService[] = [];
  private static instance: ChatRoomService;
  private static roomName: string;

  private roomName: string = '';
  static defaultSocket: Socket;

  private constructor(roomName: string, socket: Socket) {
    this.roomName = roomName;
    ChatRoomService.defaultSocket = socket;
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
  
  static getInstance(socket: Socket, roomName?: string) {
    if (!roomName) {
      roomName = ChatRoomService.getRoomName()!;
    }
    console.log('getting service instance for ' + roomName);
    if (!ChatRoomService.instances) {
      console.log('Creating a new instance: ' + roomName);
      ChatRoomService.instance = new ChatRoomService(roomName!, socket);
      // add the instance to the instances array
      ChatRoomService.instances = [ChatRoomService.instance];
    }
    else {
      // check if the instance already exists
      let instance = ChatRoomService.instances.find((instance) => instance.roomName === roomName);
      if (!instance) {
        console.log('Creating a new instance for room: ' + roomName);
        // create a new instance
        instance = new ChatRoomService(roomName!, socket);
        // add the instance to the instances array
        ChatRoomService.instances.push(instance);
      }
      ChatRoomService.instance = instance;
    }
    return ChatRoomService.instance;
  }

  public static setRoomName(roomName: string) {
    localStorage.setItem("roomName", roomName);
    ChatRoomService.roomName = roomName;
  }

  getPlayCards() {
    const roomSettings = localStorage.getItem('roomSettings');
    if (roomSettings) {
      const data = JSON.parse(roomSettings);
      return data.playCards;
    }
    else {
      window.location.href = '/newRoom';
    }
  }

  public static setUserName(userName: string) {
    sessionStorage.setItem("userName", userName);
    // ChatRoomService.roomName = userName;
  }

  public static getRoomName() {
    this.roomName = localStorage.getItem("roomName")!;
    return this.roomName;
  }

  public static getUserName() {
    return sessionStorage.getItem("userName") ?? localStorage.getItem("userName") ?? 'John Doe';
  }

  async join(roomName: string, userName: string) {
    this.roomName = roomName;
    ChatRoomService.defaultSocket.emit('join', roomName, userName);
  }

  async send(message: string) {
    debugger;
    ChatRoomService.defaultSocket.emit('chat', ChatRoomService.getRoomName(), message);
  }
}

export default ChatRoomService;