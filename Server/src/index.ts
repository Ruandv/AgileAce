import express, { Request, Response } from 'express';
import path from "path";
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
 
const app = express();
app.use(cors);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const port = process.env.PORT || 3000;

// Serve the Socket.IO client library
app.get('/socket.io/socket.io.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'node_modules', 'socket.io', 'client-dist', 'socket.io.js'));
});

app.get('/', (req: Request, res: Response) => {
  res.redirect('/index.html');
});

// Socket.IO event handling
io.on('connection', (socket) => {
    console.log('A user connected');
  
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  
    socket.on('chat message', (msg) => {
      console.log('Message: ' + JSON.stringify(msg));
      io.emit('chat message', JSON.stringify(msg));
    });
  });
  

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`http://localhost:${port}`);
});