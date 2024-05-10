import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { ChatRoom } from './models/chat-room';
import { Message } from './models/message';

const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'newGame.html'));
});

io.on('connection', (socket: Socket) => {
  console.log('a user connected');

  socket.on('chat message', (msg: string) => {
    console.log(`message: ${JSON.stringify(msg)}`);
    io.emit('chat message', msg);
  });

  socket.on('newRoom', (obj:any) => {
    console.log(`room Name: ${JSON.stringify(obj)}`);
    var room: ChatRoom = {
      messages: [{
        text: `${obj.userName} created the room ${obj.roomName}`,
        userId: socket.id,
        date: new Date()
      } as Message],
      roomName: obj.roomName,
      roomId: new Date().toDateString(),
      users: [{ userName: obj.userName, avatar: "", userId: socket.id }]
    };
    io.emit('RoomSettings', JSON.stringify(room));
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
  console.log(`http://localhost:${PORT}`);
});