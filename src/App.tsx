import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Records from './pages/Records';
import Analytics from './pages/Analytics';
import Historical from './pages/Historical';
import Patterns from './pages/Patterns';
import NotFound from './pages/NotFound';
import InstallPWA from './components/ui/InstallPWA';

const App: React.FC = () => {
  // Registrar evento de PWA instalada
  useEffect(() => {
    window.addEventListener('appinstalled', (event) => {
      console.log('ESP Motion ha sido instalada exitosamente', event);
    });
  }, []);

  return (
    <Router>
      <InstallPWA />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/records" element={<Records />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/historical" element={<Historical />} />
        <Route path="/patterns" element={<Patterns />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
