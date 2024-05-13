// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NewGame from './components/newRoom/NewRoom';
import ChatRoom from './components/chatroom/ChatRoom';
 import './App.css';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/newRoom" element={<NewGame />} />
        <Route path="/chat" element={<ChatRoom/>} />
        <Route path="/" element={<NewGame />} />
      </Routes>
    </Router>
  );
};

export default App;