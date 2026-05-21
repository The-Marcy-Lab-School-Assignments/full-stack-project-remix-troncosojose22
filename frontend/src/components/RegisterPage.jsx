import { useState } from 'react';
import { Link } from 'react-router-dom';

function RegisterPage({ handleRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = await handleRegister(username, password);
    if (error) setErrorMessage('Could not register. Username may already be taken.');
  };

  return (
    <div id="auth-section">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
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
        <button type="submit">Register</button>
        <p className="auth-redirect">Already have an account? <Link to="/login">Log in here</Link></p>
      </form>
    </div>
  );
}

export default RegisterPage;