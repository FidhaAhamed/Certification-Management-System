import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import StudentDash from './student-dash.jsx';
import AdvisorDash from './advisor-dash.jsx';
import OrganizerDash from './organizer-dash.jsx';
import StudentLogin from './student-login.jsx';

import App from './App.jsx'

function AppRouter() {
  const getPath = () => {
    const hash = window.location.hash || '#/';
    return hash.replace('#', '') ;
  };

  const [path, setPath] = useState(getPath());

  useEffect(() => {
    const onHash = () => setPath(getPath());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

   const handleLogout = () => {
    window.location.hash = '/';
    setPath('/');
    console.log('User logged out, redirecting to login page.');
  } 
if (path === '/student') return <StudentDash handleLogout={handleLogout} />;
if (path === '/organizer') return <OrganizerDash handleLogout={handleLogout} />;
if (path === '/advisor') return <AdvisorDash handleLogout={handleLogout} />;

return <StudentLogin />;

}


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
);

