import React, { useState } from 'react';
import axios from 'axios';
import '../components/login.css';
import logo from '../assets/logo.svg'; // Assumindo que a logo esteja nesse caminho

function Login() {
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (isPasswordRecovery) {
      if (password !== confirmPassword) {
        setError('As senhas não coincidem.');
        return;
      }

      try {
        const response = await axios.post('http://127.0.0.1:8000/api/register/', {
          username,
          password,
          password2: confirmPassword,
        });
        setSuccess(response.data.success || 'Senha redefinida com sucesso!');
        setIsPasswordRecovery(false);
        setUsername('');
        setPassword('');
        setConfirmPassword('');
      } catch (err) {
        setError(err.response?.data?.error || 'Erro ao redefinir senha.');
      }
    } else {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/login/', {
          username,
          password,
        });
        localStorage.setItem('token', response.data.token);
        setSuccess('Login realizado com sucesso!');
      } catch (err) {
        setError(err.response?.data?.error || 'Erro ao fazer login.');
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Logo */}
        <img src={logo} alt="Logo" className="logo" />

        <h1>{isPasswordRecovery ? 'Recuperação de Senha' : 'Login'}</h1>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Usuário</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password">{isPasswordRecovery ? 'Nova Senha' : 'Senha'}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {isPasswordRecovery && (
            <div>
              <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button type="submit">{isPasswordRecovery ? 'Redefinir Senha' : 'Entrar'}</button>
        </form>

        <button
          onClick={() => {
            setIsPasswordRecovery(!isPasswordRecovery);
            setError('');
            setSuccess('');
          }}
        >
          {isPasswordRecovery ? 'Voltar para Login' : 'Esqueci minha senha'}
        </button>
      </div>
    </div>
  );
}

export default Login;