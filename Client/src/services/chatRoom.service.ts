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
    ChatRoomService.setRoomName(roomName);
    return ChatRoomService.instance;
  }

  public static setRoomName(roomName: string) {
    sessionStorage.setItem("roomName", roomName);
    ChatRoomService.roomName = roomName;
  }

  public static setUserName(userName: string) {
    sessionStorage.setItem("userName", userName);
    // ChatRoomService.roomName = userName;
  }

  public static getRoomName() {
    this.roomName = sessionStorage.getItem("roomName")!;
    return this.roomName;
  }

  public static getUserName() {
    return sessionStorage.getItem("userName") ?? 'John Doe';
  }

  public static getUserId() {
    return sessionStorage.getItem("userId") ?? '';
  }

  async join(roomName: string, userName: string) {
    this.roomName = roomName;
    ChatRoomService.defaultSocket.emit('join', roomName, userName);
  }

  async voted(card: number) {
    ChatRoomService.defaultSocket.emit('voted', this.roomName, card);
  }
  
  async showVotes() {
    ChatRoomService.defaultSocket.emit('showVotes', this.roomName);
  }

  async send(message: string) {
    ChatRoomService.defaultSocket.emit('chat', ChatRoomService.getRoomName(), message);
  }

  async userNameUpdated(userName: string) {
    ChatRoomService.defaultSocket.emit('userNameUpdated', ChatRoomService.getRoomName(), userName);
  }

  async resetVotes() {
    ChatRoomService.defaultSocket.emit('resetVotes', ChatRoomService.getRoomName());
  }
}

export default ChatRoomService;