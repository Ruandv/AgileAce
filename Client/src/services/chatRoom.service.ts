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

  static getInstance(socket:Socket,roomName?: string) {
    if (!roomName) {
      roomName = ChatRoomService.getRoomName()!;
    }
    console.log('getting service instance for' + roomName);
    if (!ChatRoomService.instances) {
      console.log('Creating a new instance: ' + roomName);
      ChatRoomService.instance = new ChatRoomService(roomName!,socket);
      // add the instance to the instances array
      ChatRoomService.instances = [ChatRoomService.instance];
    }
    else {
      // check if the instance already exists
      let instance = ChatRoomService.instances.find((instance) => instance.roomName === roomName);
      if (!instance) {
        console.log('Creating a new instance for room: ' + roomName);
        // create a new instance
        instance = new ChatRoomService(roomName!,socket);
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

  public static setUserName(roomName: string) {
    localStorage.setItem("userName", roomName);
    ChatRoomService.roomName = roomName;
  }

  public static getRoomName() {
    return localStorage.getItem("roomName");
  }

  public static getUserName() {
    return localStorage.getItem("userName")?? 'Anonymous';
  }

  async join(roomName: string, userName: string) {
    ChatRoomService.defaultSocket.emit('join', roomName, userName);
  }

  async send(message: string) {
    ChatRoomService.defaultSocket.emit('chat', this.roomName, message);
  }
}

export default ChatRoomService;