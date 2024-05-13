// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NewGame from './components/newRoom/NewRoom';
import ChatRoom from './components/chatroom/ChatRoom';
 import './App.css';
import { SocketProvider } from './contexts/SocketContext';
const App = () => {
  return (
    <SocketProvider url={process.env.REACT_APP_API_URL!}>
    <Router>
      <Routes>
        <Route path="/newRoom" element={<NewGame />} />
        <Route path="/chat" element={<ChatRoom/>} />
        <Route path="/" element={<NewGame />} />
      </Routes>
    </Router>
 </SocketProvider>
  );
};

export default App;