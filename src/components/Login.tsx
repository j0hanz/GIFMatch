import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { handleButtonClick } from '@/utils/soundManager';
import { login, logout } from '@/api/auth';
import styles from './styles/Modal.module.css';

interface LoginProps {
  show: boolean;
  onClose: () => void;
  onLogin: (username: string) => void;
  onLogout: () => void;
  isLoggedIn: boolean;
  username: string | null;
}

// Displays a login/logout modal
const Login: React.FC<LoginProps> = ({
  show,
  onClose,
  onLogin,
  onLogout,
  isLoggedIn,
  username,
}) => {
  const [usernameInput, setUsernameInput] = useState('');
  // Holds value of username input

  const [password, setPassword] = useState('');
  // Holds value of password input

  const [error, setError] = useState<string | null>(null);
  // Holds error message

  const [loading, setLoading] = useState(false);
  // Indicates loading state for login/logout

  const handleSubmit = async (e: React.FormEvent) => {
    // Submits login credentials
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = (await login(usernameInput, password)) as {
        user: { username: string };
      };
      onLogin(data.user.username);
      onClose();
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    // Logs out the user
    setLoading(true);
    try {
      await logout();
      onLogout();
    } catch (err) {
      setError('Error logging out');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered className={styles.modal}>
      <Modal.Header className="border-0 d-flex justify-content-center">
        <Modal.Title>{isLoggedIn ? 'Logout' : 'Login'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoggedIn ? (
          <div>
            <p>Logged in as {username}</p>
            <Button
              onClick={handleButtonClick(handleLogout)}
              disabled={loading}
            >
              {loading ? 'Logging out...' : 'Logout'}
            </Button>
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="password" className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button
              type="submit"
              onClick={handleButtonClick()}
              disabled={loading}
              className="mt-3"
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button
          className={styles.btnClose}
          onClick={handleButtonClick(onClose)}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Login;
