import { v4 as uuidv4 } from 'uuid';
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
import dotenv from 'dotenv';
dotenv.config()

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
    allowedHeaders: ["my-custom-header", "my-user-name", "my-user-id"],
    credentials: false
  }
});
const rooms: ChatRoom[] = [];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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
    let userId = socket.handshake.headers['my-user-id']?.toString();
    if (!userId || userId === '') {
      // redirect to the home page
      console.log('User not found');

      socket.emit('redirect', '/newRoom');
      return;
    }

    console.log(`chat: ${roomName} ${msg}`);
    let room = getRoom(roomName);
    const user:User = room?.users.find((user) => user.userId === userId) as User;
    room!.messages.push({
      text: msg,
      userId: userId,
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
    let userId = socket.handshake.headers['my-user-id']?.toString();
    if(!userId || userId===''){
      userId = uuidv4();
    }
    // reply to the socket with his unique id
    socket.emit('userId', userId);
    let room = getRoom(roomName);
    if (!room) {
      room = {
        settings: { showVotes: false },
        playCards: [1, 2, 3, 4],
        messages: [{
          text: `${userName} created the room ${roomName}`,
          userId: userId,
          date: new Date()
        } as ChatMessage],
        roomName: roomName,
        roomId: new Date().toDateString(),
        users: [{
          userName: userName,
          avatar: "",
          userId: userId
        } as User]
      };
      rooms.push(room);
    }
    else {
      room.messages.push({
        text: `${userName} [${userId}] joined the room`,
        userId: userId,
        date: new Date()
      });
      room.users.push({
        userName: userName,
        avatar: "",
        userId: userId,
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
  if (!room) {
    room = rooms.find((room) => room.roomId === roomName);
  }
  return room;
}

function logRooms(func: string) {
  console.log(`\r\n\r\n-------------${func}----------------\r\n\r\n`);
  io.of('/').adapter.rooms.forEach((value, key) => {
    if (!key) {
      console.error(`Value: ${value} BUT key is null`)
      return;
    }
    console.log(`Room: ${getRoom(key.toString())?.roomName} has ${value.size} connections`);
    // log all the connections in the room
    value.forEach((socketId) => {
      console.log(`\t${socketId}`);
    });
  });
}  