import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { ChatRoom } from './models/chat-room';
import { Message } from './models/message';
import { ClientToServerEvents, ServerToClientEvents, SocketData } from './models/socket-io';
import { User } from './models/user';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

const server = http.createServer(app);

// https://socket.io/docs/v4/typescript/
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData 
>(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: false
  }
}); 
const rooms: ChatRoom[] = [];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'newGame.html'));
});

io.on('connection', (socket: Socket) => {
  if(socket.recovered) {
  }
  else
  {
    console.log('a user connected');
  }
  if(rooms.length === 0) {
    const data = fs.readFileSync('rooms.json', 'utf8');
    const roomData = JSON.parse(data);
    rooms.push(...roomData);
  };

  socket.on('chat', (roomName:string, msg: string) => {
    console.log(`roomName: ${roomName}`);
    const room = getRoom(roomName);
    if(!room) {
      console.log(`room ${roomName} not found`);
      // throw an error
      throw new Error(`room ${roomName} not found`); 
    }
    room!.messages.push({
      text: msg,
      userId: socket.id, 
      date: new Date()
    });
    console.log(`message: ${JSON.stringify(msg)}`);
    io.emit('updateSettings', JSON.stringify(room));
    fs.writeFileSync('rooms.json', JSON.stringify(rooms));
  });

  socket.on('join', (obj ,b ) => {
    console.log(`room Name: ${JSON.stringify(obj)}`);
    socket.join(obj);
    // check if the room exist in rooms array
    let room = getRoom(obj);
    if (!room) {
      room = { 
        messages: [{
          text: `${b} created the room ${obj}`,
          userId: socket.id,
          date: new Date()
        } as Message],
        roomName: obj,
        roomId: new Date().toDateString(),
        users: [{
          userName: b,
          avatar: "",
          userId: socket.id
        } as User]
      };
      rooms.push(room);
    }
    else {
      room.messages.push({
        text: `${b} joined the room`,
        userId: socket.id,
        date: new Date()
      });
      room.users.push({
        userName: b,
        avatar: "",
        userId: socket.id
      });
    }
    io.emit('updateSettings', JSON.stringify(room));
  });

  socket.on('disconnect', (reason, details) => {
    // the reason of the disconnection, for example "transport error"
  console.log(reason); 
  console.log(JSON.stringify(details,null,2)); 
    // find the room that the user is in
    const room = rooms.find((room) => room.users.find((user) => user.userId === socket.id));
    // remove the user from the room
    if (room) {
      const user = room.users.find((user) => user.userId === socket.id);
      room.users = room.users.filter((user) => user.userId !== socket.id);
      room.messages.push({
        text: `${user?.userName} left the room`,
        userId: socket.id,
        date: new Date()
      });
      io.emit('updateSettings', JSON.stringify(room));
    }
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

function getRoom(roomName: string) {
  return rooms.find((room) => room.roomName === roomName);

}
