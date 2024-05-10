import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket: Socket) => {
  console.log('a user connected');

  socket.on('chat message', (msg: string) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
  console.log('http://localhost:3000');
});