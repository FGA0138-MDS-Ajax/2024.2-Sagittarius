import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import './login.css';
import logo from '../../assets/icons/logo.svg'; 
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const navigate = useNavigate();
  const [formType, setFormType] = useState('login'); // 'login', 'register', ou 'passwordRecovery'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // estado para 'lembrar de mim'
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // limpar os dados se trocar de tela:
  useEffect(() => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    setRememberMe(false);
  }, [formType]); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username || !password || (formType === 'register' && !confirmPassword)) {
      toast.error('Por favor, preencha todos os campos.', {
        position: 'top-left',
        autoClose: 5000,
        theme: 'colored',
        transition: Bounce,
      });
      return;
    }

    if (formType === 'login') {
      try { 
        const response = await axios.post('http://127.0.0.1:8000/api/login/', { username, password }); 
        localStorage.setItem('token', response.data.token);
        const token = localStorage.getItem('token');
        if (token) {
          console.log('Token encontrado:', token);
          // O usuário está autenticado
        } else {
          console.log('Token não encontrado.');
          // O usuário não está autenticado
        }
        
        // se 'lembrar de mim' estiver marcado, armazene as credenciais
        if (rememberMe) {
          localStorage.setItem('username', username);
          localStorage.setItem('password', password);
        }
        
        toast.success('Login realizado com sucesso!', {
          position: 'top-left',
          autoClose: 5000,
          theme: 'colored',
          transition: Bounce,
        });

        setTimeout(() => {
          navigate('/estoque'); 
        }, 2000);
      } catch (err) {
        setError(err.response?.data?.error || 'Erro ao fazer login.');
      }
    } else if (formType === 'register') {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/register/', { username, password, password2: confirmPassword });
        
        toast.success('Cadastro realizado com sucesso!', {
          position: 'top-left',
          autoClose: 5000,
          theme: 'colored',
          transition: Bounce,
        });

        setFormType('login'); // volta para a tela de login após o registro
      } catch (err) {
        setError(err.response?.data?.error || 'Erro ao cadastrar.');
      }
    } 
    else if (formType === 'passwordRecovery') {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/updatepwd/', { username, password });
        toast.success(response.data.success || 'Senha redefinida com sucesso!', {
          position: 'top-left',
          autoClose: 5000,
          theme: 'colored',
          transition: Bounce,
        });
        setFormType('login');
        } catch (err) {
          toast.error(err.response?.data?.error || 'Erro ao redefinir senha.', {
            position: 'top-left',
            autoClose: 5000,
            theme: 'colored',
            transition: Bounce,
          });
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <img src={logo} alt="Logo" className="logo" />
        <h1 className="login-title">
          {formType === 'login' 
            ? 'Acesse o sistema com suas credenciais.'
            : formType === 'register' 
            ? 'Cadastro' 
            : 'Recuperação de Senha'
          }
        </h1>

        {error && <p className="login-error">{error}</p>}
        {success && <p className="login-success">{success}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-form-group">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Usuário"
              required
              className="login-input"
            />
          </div>

          <div className="login-form-group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              required
              className="login-input"
            />
          </div>

          {formType === 'register' && (
            <div className="login-form-group">
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme a Senha"
                required
                className="login-input"
              />
            </div>
          )}

          {formType === 'login' && (
            <div className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="remember-me-checkbox"
              />
              <label htmlFor="rememberMe" className="remember-me-label">Lembrar de mim</label>
            </div>
          )}

          <button type="submit" className="login-button">
            {formType === 'login' ? 'Entrar' : formType === 'register' ? 'Cadastrar' : 'Redefinir Senha'}
          </button>
        </form>

        <div className="action-buttons">
          {formType === 'login' ? (
            <>
              <button
                className="register-button"
                onClick={() => {
                  setFormType('register');
                }}
              >
                Criar uma conta
              </button>
              <button
                className="forgot-password-button"
                onClick={() => {
                  setFormType('passwordRecovery');
                }}
              >
                Esqueceu a senha?
              </button>
            </>
          ) : formType === 'register' ? (
            <button
              className="back-to-login-button"
              onClick={() => {
                setFormType('login');
              }}
            >
              Já tenho uma conta
            </button>
          ) : (
            <button
              className="back-to-login-button"
              onClick={() => {
                setFormType('login');
              }}
            >
              Voltar para Login
            </button>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;