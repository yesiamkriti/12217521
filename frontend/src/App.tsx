import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import { Stats } from './pages/Stats';

const App: React.FC = () => {
  return (
    <Router>
      <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
        <Link to="/" style={{ marginRight: '20px' }}>Shorten URL</Link>
        <Link to="/stats">Stats</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </Router>
  );
};

export default App;
