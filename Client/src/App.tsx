// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NewGame from './pages/newRoom/NewRoom';
import './App.css';
import PlayRoom from './pages/playRoom/PlayRoom';
import { SocketContextProvider } from './contexts/socketContext';
import { RoomContextProvider } from './contexts/roomSettingsContext';

const App = () => {
  return (
    <SocketContextProvider>
      <RoomContextProvider>
        <Router>
          <Routes>
            <Route path="/newRoom" element={<NewGame />} />
            <Route path="/chat" element={<PlayRoom />} />
            <Route path="/" element={<NewGame />} />
          </Routes>
        </Router>
      </RoomContextProvider>
    </SocketContextProvider>
  );
};

export default App;
