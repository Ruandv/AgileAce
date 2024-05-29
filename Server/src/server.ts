import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { ChatRoom } from './models/chatRoom';
import { ChatMessage } from './models/chatMessage';
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
    allowedHeaders: ["my-custom-header","my-user-name"],
    credentials: false
  }
});
const rooms: ChatRoom[] = [];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'newGame.html'));
});

io.on('connection', (socket: Socket) => {
  if (socket.recovered) {
    console.log('recovered');
  }
  else {
  }
  if (rooms.length === 0) {
    const data = fs.readFileSync('rooms.json', 'utf8');
    const roomData = JSON.parse(data);
    rooms.push(...roomData);
  };

  socket.on('chat', (roomName: string, msg: string) => {
    //read the socket headers to retrieve the user name
    const userName = socket.handshake.headers['my-user-name'];
    console.log(`chat: ${roomName} ${msg}`);
    let room = getRoom(roomName);
    const user:User = room?.users.find((user) => user.userName === userName) as User;
    if (!room) {
      const userName = 'user' + Math.floor(Math.random() * 1000);
      // throw an error
      socket.join(roomName);
      room = { 
        settings: { showVotes: false },
        playCards: [1,2,3,4],
        messages: [{
          text: `${userName} created the room ${roomName}`,
          userId: socket.id,
          date: new Date()
        } as ChatMessage],
        roomName: roomName,
        roomId: new Date().toDateString(),
        users: [{
          userName: userName,
          avatar: "",
          userId: socket.id
        } as User]
      };
      rooms.push(room);
    }

    room!.messages.push({
      text: msg,
      userId: socket.id,
      date: new Date()
    });
    console.log(`message ${user?.userName}: ${JSON.stringify(msg)}`);
    logRooms('chat');
    io.emit('updateSettings', JSON.stringify(room));
    fs.writeFileSync('rooms.json', JSON.stringify(rooms, null, 2));
  });

  socket.on('join', async (roomName, userName) => {
    // remove the current socket from all rooms
    socket.rooms.forEach((room) => {
      socket.leave(room);
    });

    socket.join(roomName);
    const val = io.sockets.adapter.rooms.get(roomName);
    socket.in(roomName).emit('usersCount', val?.size.toString());

    let room = getRoom(roomName);
    if (!room) {
      room = {
        settings: { showVotes: false },
        playCards: [1,2,3,4],
        messages: [{
          text: `${userName} created the room ${roomName}`,
          userId: socket.id,
          date: new Date()
        } as ChatMessage],
        roomName: roomName,
        roomId: new Date().toDateString(),
        users: [{
          userName: userName,
          avatar: "",
          userId: socket.id
        } as User]
      };
      rooms.push(room);
    }
    else {
      room.messages.push({
        text: `${userName} [${socket.id}] joined the room`,
        userId: socket.id,
        date: new Date()
      });
      room.users.push({ 
        userName: userName,
        avatar: "",
        userId: socket.id, 
        voted: false,
        value: "?"
      });
    }
    console.log(JSON.stringify(room, null, 2));
    logRooms('join');
    io.emit('updateSettings', JSON.stringify(room));
  });

  socket.on('disconnect', (reason, details) => {
    // the reason of the disconnection, for example "transport error"
    console.log(reason);
    console.log(JSON.stringify(details, null, 2));
    // find the room that the user is in
    const room = rooms.find((room) => room.users.find((user) => user.userId === socket.id));
    // remove the user from the room
    if (room) {
      const user = room.users.find((user) => user.userId === socket.id);
      room.users = room.users.filter((user) => user.userId !== socket.id); 
      io.emit('updateSettings', JSON.stringify(room));
    }
    console.log('user disconnected');
    logRooms('disconnect');
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

function getRoom(roomName: string) {
  let room = rooms.find((room) => room.roomName === roomName);
  if(!room) {
    room = rooms.find((room) => room.roomId === roomName);
  }
  return room;
}

function logRooms(func:string) {
  console.log(`\r\n\r\n-------------${func}----------------\r\n\r\n`);
  io.of('/').adapter.rooms.forEach((value, key) => {
    console.log(`Room: ${getRoom(key.toString())?.roomName} has ${value.size} connections`);
    // log all the connections in the room
    value.forEach((socketId) => {
      console.log(`\t${socketId}`);
    });
  });
}