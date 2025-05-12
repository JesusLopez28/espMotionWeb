import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Records from './pages/Records';
import Analytics from './pages/Analytics';
import Historical from './pages/Historical';
import Patterns from './pages/Patterns';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/records" element={<Records />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/historical" element={<Historical />} />
        <Route path="/patterns" element={<Patterns />} />
      </Routes>
    </Router>
  );
};

export default App;
