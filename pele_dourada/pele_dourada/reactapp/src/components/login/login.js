import React, { useState } from 'react';
import axios from 'axios';
import './login.css';
import logo from '../../assets/logo.svg'; 

function Login() {
  const [formType, setFormType] = useState('login'); //  'login', 'register', ou 'passwordRecovery'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // estado para 'lembrar de mim'
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

    if (formType === 'login') {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/login/', { username, password });
        localStorage.setItem('token', response.data.token);
        
        // se 'lembrar de mim' estiver marcado, armazene as credenciais
        if (rememberMe) {
          localStorage.setItem('username', username);
          localStorage.setItem('password', password);
        }
        
        setSuccess('Login realizado com sucesso!');
      } catch (err) {
        setError(err.response?.data?.error || 'Erro ao fazer login.');
      }
    } else if (formType === 'register') {
      if (password !== confirmPassword) {
        setError('As senhas não coincidem.');
        return;
      }

      try {
        const response = await axios.post('http://127.0.0.1:8000/api/register/', { username, password });
        setSuccess('Cadastro realizado com sucesso!');
        setFormType('login'); // volta para a tela de login após o registro
      } catch (err) {
        setError(err.response?.data?.error || 'Erro ao cadastrar.');
      }
    } else if (formType === 'passwordRecovery') {
      if (password !== confirmPassword) {
        setError('As senhas não coincidem.');
        return;
      }

      try {
        const response = await axios.post('http://127.0.0.1:8000/api/updatepwd/', { username, password });
        setSuccess(response.data.success || 'Senha redefinida com sucesso!');
        setFormType('login'); // volta para a tela de login após a redefinição de senha
      } catch (err) {
        setError(err.response?.data?.error || 'Erro ao redefinir senha.');
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Logo */}
        <img src={logo} alt="Logo" className="logo" />

        <h1>
          {formType === 'login' 
            ? 'Acesse o sistema com suas credenciais.'
            : formType === 'register' 
            ? 'Cadastro' 
            : 'Recuperação de Senha'
          }
        </h1>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Usuário"
              required
            />
          </div>

          <div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              required
            />
          </div>

          {formType === 'register' || formType === 'passwordRecovery' ? (
            <div>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmar Senha"
                required
              />
            </div>
          ) : null}

          
          {formType === 'login' && (
            <div className="remember-me">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label htmlFor="rememberMe">Lembrar de mim</label>
          </div>
          )}
          

          <button type="submit">{formType === 'login' ? 'Entrar' : formType === 'register' ? 'Cadastrar' : 'Redefinir Senha'}</button>
        </form>

        {/* Alternando entre login, registro e recuperação de senha */}
        <div>
          {formType === 'login' ? (
            <>
              <button
                onClick={() => {
                  setFormType('register');
                  setError('');
                  setSuccess('');
                }}
              >
                Criar uma conta
              </button>
              <button
                onClick={() => {
                  setFormType('passwordRecovery');
                  setError('');
                  setSuccess('');
                }}
              >
                Esqueceu a senha?
              </button>
            </>
          ) : formType === 'register' ? (
            <button
              onClick={() => {
                setFormType('login');
                setError('');
                setSuccess('');
              }}
            >
              Já tenho uma conta
            </button>
          ) : (
            <button
              onClick={() => {
                setFormType('login');
                setError('');
                setSuccess('');
              }}
            >
              Voltar para Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;