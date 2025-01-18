import React, { useState } from 'react';
import '../components/login.css';

function Login() {
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!isPasswordRecovery) {
      // Aqui você pode adicionar a lógica de validação de login
      console.log('Usuário:', username);
      console.log('Senha:', password);
    } else {
      // Validação para o caso de "Recuperação de senha"
      if (password !== confirmPassword) {
        setError('As senhas não coincidem');
      } else {
        console.log('Nova senha:', password);
        setError('');
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>{isPasswordRecovery ? 'Recuperação de Senha' : 'Login'}</h1>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <form onSubmit={handleLogin}>
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
            <label htmlFor="password">Senha</label>
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
              <label htmlFor="confirmPassword">Confirmar Senha</label>
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

        {!isPasswordRecovery ? (
          <p onClick={() => setIsPasswordRecovery(true)} className="forgot-password">
            Esqueci minha senha
          </p>
        ) : (
          <p onClick={() => setIsPasswordRecovery(false)} className="forgot-password">
            Voltar para Login
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;