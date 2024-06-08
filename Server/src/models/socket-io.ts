//https://socket.io/docs/v4/typescript/

// The events declared in the ServerToClientEvents interface are used when sending and broadcasting events:
export interface ServerToClientEvents {
  chat: (msg: string) => void;
  updateSettings: (settings: string) => void;
  join: (roomName: string) => void;
  shotClock: (data:string) => void;
}

//The ones declared in the ClientToServerEvents interface are used when receiving events:
export interface ClientToServerEvents {
  join: (roomName: string, userName: string) => void;
  chat: (msg: string) => void;
}

//And finally, the SocketData type is used to type the socket.data attribute (added in socket.io@4.4.0):
export interface SocketData {
  name: string;
  age: number;
}