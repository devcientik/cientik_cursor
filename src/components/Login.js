import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();
  const { login, currentUser, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && currentUser) {
      navigate('/inicio');
      setEmail('');
      setPassword('');
      setError(null);
    }
  }, [currentUser, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      console.error('Login failed:', err.message);
      setError(err.message || 'E-mail ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert('Funcionalidade de recuperação de senha em breve!');
  };

  return (
    <div className="login-bg">
      <div className="login-overlay">
        <form className="login-form" onSubmit={handleSubmit}>
          <img src="/cientiklogo.png" alt="Cientik Logo" className="login-logo" />
          <h2>Entrar</h2>
          {error && <div className="login-error">{error}</div>}
          <div className="login-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="login-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <div className="login-options">
            <label>
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
              />
              Manter Conectado
            </label>
            <span className="login-link" onClick={handleForgotPassword} tabIndex={0} role="button">Esqueci minha senha</span>
          </div>
          <button type="submit" disabled={loading} className="login-btn">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login; 