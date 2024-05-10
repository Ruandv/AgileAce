import io from 'socket.io-client';

class ChatRoomService {
    private static instance: ChatRoomService;
    private static readonly baseUrl = 'http://localhost:3000';
    private roomName: string = '';
    private socket = io('http://localhost:3000');

    private constructor(roomName:string) {

      this.socket.on('RoomSettings', (msg) => {
        // save the settings to local storage
        debugger;
        this.roomName = JSON.parse(msg).roomName;
        localStorage.setItem('roomSettings', msg);
        window.location.href = '/chat';        
      }); 
      this.roomName = roomName;
    }
  
    static getInstance(roomName:string) {
      if (!ChatRoomService.instance) {
        ChatRoomService.instance = new ChatRoomService(roomName);
      }
      return ChatRoomService.instance;
    }
    
    async getMessages() {
      const roomSettings = localStorage.getItem('roomSettings');
      if(roomSettings){
        const data = JSON.parse(roomSettings);
        return data.messages;
      }
      else
      {
        window.location.href = '/newRoom';
      }
    }

    async join(roomName: string,userName: string) {
        this.socket.emit('newRoom', { roomName: roomName, userName });        
    }

    async send(message: string) {
      this.socket.emit('chat message', { roomName: this.roomName, message });
    }
    
    
}

export default ChatRoomService;