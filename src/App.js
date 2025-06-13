import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sobre from './pages/Sobre';
import Inicio from './pages/Inicio';
import NoPage from './pages/NoPage';
import SignUp from './components/SignUp';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './services/AuthContext';

export default () => {
  return (
    <AuthProvider>
      <div className="page">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<SignUp />} />
            <Route path="/sobre" element={
              <PrivateRoute>
                <Sobre />
              </PrivateRoute>
            } />
            <Route path="/inicio" element={
              <PrivateRoute>
                <Inicio />
              </PrivateRoute>
            } />
            <Route index element={
              <PrivateRoute>
                <Inicio />
              </PrivateRoute>
            } />
            <Route path="*" element={<NoPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

 