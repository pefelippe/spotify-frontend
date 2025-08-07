import AuthLayout from './layout/AuthLayout';
import LoginLayout from './layout/LoginLayout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Home from './pages/Home';
import Artistas from './pages/Artistas';
import Playlists from './pages/Playlists';
import Perfil from './pages/Perfil';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          <LoginLayout>
            <Login />
          </LoginLayout>
        } />

        <Route path="/" element={<AuthLayout><Home /></AuthLayout>} />
        <Route path="/artistas" element={<AuthLayout><Artistas /></AuthLayout>} />
        <Route path="/playlists" element={<AuthLayout><Playlists /></AuthLayout>} />
        <Route path="/perfil" element={<AuthLayout><Perfil /></AuthLayout>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
