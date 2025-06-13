import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sobre from './pages/Sobre';
import Inicio from './pages/Inicio';
import NoPage from './pages/NoPage';
import SignUp from './components/SignUp';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import AdminCientik from './pages/AdminCientik';
import { AuthProvider } from './services/AuthContext';

export default () => {
  return (
    <AuthProvider>
      <div className="page">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
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

            <Route path="/admin" element={<AdminRoute />}>
                <Route path="cientik" element={<AdminCientik />} />
            </Route>

            <Route path="*" element={<NoPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

 