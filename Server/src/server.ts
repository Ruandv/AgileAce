import { v4 as uuidv4 } from 'uuid';
import express from 'express';
import http, { get } from 'http';
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
  if (rooms.length === 0) {
    console.log('loading rooms');
    // find all the files starting with room_*.json in the directory
    const dirFiles = fs.readdirSync('./');
    dirFiles.map((file) => {
      if (file.startsWith('room_') && file.endsWith('.json')) {
        console.log(`\t${file}`);
        const data = fs.readFileSync(file, 'utf8');
        const roomData = JSON.parse(data);
        rooms.push(roomData);
      }
    });
  };

  socket.on('voted', (roomName: string, card: number) => {
    console.log("voted", socket.id)
    let userId = socket.handshake.headers['my-user-id']?.toString();
    let room = getRoom(roomName);
    if (!room) {
      return;
    }
    const user: User = room?.users.find((user) => user.userId === userId) as User;
    user.value = card.toString();
    user.voted = card >= 0;
    updateSettings(room)
  });

  socket.on('userNameUpdated', (roomName: string, userName: string) => {
    let userId = socket.handshake.headers['my-user-id']?.toString();
    let room = getRoom(roomName);
    if (!room) {
      return;
    }
    const user: User = room?.users.find((user) => user.userId === userId) as User;

    room!.messages.push({
      text: `${user.userName} is now known as ${userName}`, 
      userId: userId!,
      date: new Date()
    });
    user.userName = userName;
    updateSettings(room);

  });

  socket.on('chat', (roomName: string, msg: string) => {
    //read the socket headers to retrieve the user name
    let userId = socket.handshake.headers['my-user-id']?.toString();
    if (!userId || userId === '') {
      // redirect to the home page
      socket.emit('redirect', '/newRoom');
      return;
    }

    let room = getRoom(roomName);
    if (!room) {
      return;
    }
    room.messages.push({
      text: msg,
      userId: userId,
      date: new Date()
    });
    logRooms('chat');
    updateSettings(room);
  });

  socket.on('showVotes', (roomName: string) => {
    // calculate the votes
    const data = { votes: 0, value: 0 };
    getRoom(roomName)?.users.forEach((user) => {
      if (user.voted === true && user.value !== "?") {
        data.value += parseInt(user.value);
        data.votes++;
      }
    });
    io.to(roomName).emit('shotClock', JSON.stringify(data));

  });

  socket.on('resetVotes', (roomName: string) => {
    getRoom(roomName)?.users.forEach((user) => {
      user.value = "?";
      user.voted = false;
    });
    updateSettings(getRoom(roomName)!);
  });

  socket.on('join', async (roomName, userName) => {
    let userId = socket.handshake.headers['my-user-id']?.toString();
    let room = getRoom(roomName);
    // socket.rooms.forEach((room) => {
    //   console.log(`Leaving room ${room}`);
    //   socket.leave(room);
    // });
    socket.join(roomName);
    if (!userId || userId === '') {
      userId = uuidv4();
    }
    // reply to the socket with his unique id
    socket.emit('userId', userId);

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
        roomId: uuidv4(),
        users: [{
          userName: userName,
          avatar: "",
          value: "?",
          voted: false,
          userId: userId,
          socketId: socket.id
        } as User]
      };
      rooms.push(room);
    }
    else {
      // room.messages.push({
      //   text: `${userName} [${userId}] joined the room`,
      //   userId: userId,
      //   date: new Date()
      // });
      const user = room?.users.find((user) => user.userId === userId);
      if (!user) {
        room.users.push({
          userName: userName,
          avatar: "",
          userId: userId,
          voted: false,
          value: "?",
          socketId: socket.id
        });
      }
    }
    logRooms('join');
    updateSettings(room);
  });
  socket.on("disconnecting", () => {
    let userId = socket.handshake.headers['my-user-id']?.toString();
    const roomsToExit = Array.from(socket.rooms).filter((room) => room !== socket.id);
    // find all the rooms where RoomToExit is part of
    const roomsData = rooms.filter(room => roomsToExit.some((roomToExit) => roomToExit === room.roomName))
    // remove the user from the room
    if (roomsData) {
      Array.from(roomsData).forEach(x => {
        x.users = x.users.filter((user) => user.userId !== userId);
      }
      )
    }
  });

  socket.on('disconnect', (reason, details) => {
    // the reason of the disconnection, for example "transport error"
    console.log(reason);
    console.log(JSON.stringify(details, null, 2));
    console.log('user disconnected');
    rooms.forEach((room) => {
      updateSettings(room);
    });
  });
});

const updateSettings = (room: ChatRoom) => {
  io.to(room.roomName).emit('updateSettings', JSON.stringify(room));
  fs.writeFileSync(`room_${room.roomName}.json`, JSON.stringify(room, null, 2));
}
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

const getRoom = (roomName: string): ChatRoom | undefined => {
  let room = rooms.find((room) => room.roomName.toLocaleLowerCase() === roomName.toLocaleLowerCase());
  if (!room) {
    room = rooms.find((room) => room.roomId.toLocaleLowerCase() === roomName.toLocaleLowerCase());
  }
  if (!room) {
    return undefined;
  }
  else {
    return room;
  }
}

function logRooms(func: string) {
  console.log(`\r\n\r\n-------------${func}----------------\r\n\r\n`);
  io.of('/').adapter.rooms.forEach((value, key) => {
    if (!key) {
      console.error(`Value: ${value} BUT key is null`)
      return;
    }
    const room = getRoom(key.toString());
    if (room) {
      console.log(`Room: ${room?.roomName} has ${value.size} connections`);
      // log all the connections in the room
      value.forEach((socketId) => {
        console.log(`\t${socketId}`);
      });
      // remove all the users where the socketId is not part of the user.socketId
      room.users = room.users.filter((user) => value.has(user.socketId));
      updateSettings(room);
    }
  });
}  