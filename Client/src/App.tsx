// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NewGame from './pages/newRoom/NewRoom';
import ChatRoom from './components/chatroom/ChatRoom';
 import './App.css';
import { SocketProvider } from './contexts/SocketContext';
import PlayRoom from './pages/playRoom/PlayRoom';
const App = () => {
  return (
    <SocketProvider url="http://localhost:3000">
    <Router>
      <Routes>
        <Route path="/newRoom" element={<NewGame />} />
        <Route path="/chat" element={<PlayRoom/>} />
        <Route path="/" element={<NewGame />} />
      </Routes>
    </Router>
 </SocketProvider>
  );
};

export default App;