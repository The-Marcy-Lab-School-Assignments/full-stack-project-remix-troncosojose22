import { useState } from 'react';
import { Link } from 'react-router-dom';

function LoginPage({ handleLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = await handleLogin(username, password);
    if (error) setErrorMessage('Invalid username or password.');
  };

  return (
    <div id="auth-section">
      <form onSubmit={handleSubmit}>
        <h2>Log In</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errorMessage && <p className="error">{errorMessage}</p>}
        <button type="submit">Log In</button>
        <p className="auth-redirect">Need an account? <Link to="/register">Register here</Link></p>
      </form>
    </div>
  );
}

export default LoginPage;