import React, { useState, useEffect } from 'react';
import { Button, Image } from 'react-bootstrap';
import Game from '@/components/Game';
import LoadingSpinner from '@/components/Spinner';
import { GameInstructions, LatestUpdates } from '@/components/Modal';
import Login from '@/components/Login';
import StartButton from '@/components/StartButton';
import InstructionsButton from '@/components/InstructionsButton';
import { handleButtonClick } from '@/utils/soundManager';
import { HiNewspaper } from 'react-icons/hi2';
import { LiaGithub } from 'react-icons/lia';
import { useGameHandlers } from '@/utils/gameHandlers';
import { motion, Variants } from 'framer-motion';
import { getCurrentUser } from '@/api/auth';
import cardBack from './assets/img/card-back.webp';
import styles from '@/App.module.css';

// Main application component
const App: React.FC = () => {
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  // Indicates whether the game is active

  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Controls display of the loading spinner

  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  // Controls visibility of the instructions modal

  const [showLatestUpdates, setShowLatestUpdates] = useState<boolean>(false);
  // Controls visibility of the latest updates modal

  const [showLogin, setShowLogin] = useState<boolean>(false);
  // Controls visibility of the login modal

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  // Tracks user's login status

  const [username, setUsername] = useState<string | null>(null);
  // Stores the current user's username

  const {
    startGame,
    handleRestart,
    handleExit,
    openInstructions,
    closeInstructions,
    openLatestUpdates,
    closeLatestUpdates,
  } = useGameHandlers({
    // Custom hook to manage game modals & states
    setIsLoading,
    setIsGameActive,
    setShowInstructions,
    setShowLatestUpdates,
  });

  useEffect(() => {
    // Fetch the current user on mount
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user && typeof user === 'object' && 'username' in user) {
          setUsername((user as { username: string }).username);
          setIsLoggedIn(true);
        }
      } catch (err) {
        setIsLoggedIn(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleLogin = (username: string) => {
    // Updates state after successful login
    setUsername(username);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Updates state after logout
    setUsername(null);
    setIsLoggedIn(false);
  };

  const pageVariants: Variants = {
    // Framer Motion animation states
    initial: { opacity: 0, scale: 0.7 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 0.7 },
  };

  const pageTransition: object = {
    // Framer Motion transition configuration
    type: 'spring',
    stiffness: 50,
    damping: 20,
  };

  return (
    <>
      <LoadingSpinner isLoading={isLoading} />
      {!isLoading && !isGameActive && (
        <motion.div
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          <div className={styles.menu}>
            <Image src={cardBack} className={styles.cardBack} fluid />
            <div className={styles.gameTitle}>Memorix</div>
            <StartButton onClick={startGame} />
            <InstructionsButton onClick={openInstructions} />
            <div className={`${styles.smallButtonsDiv} my-4`}>
              <Button
                onClick={handleButtonClick(openLatestUpdates)}
                className={styles.btnUpdates}
              >
                <HiNewspaper />
              </Button>
              <Button
                onClick={() =>
                  window.open('https://github.com/j0hanz/Memorix', '_blank')
                }
                className={styles.btnUpdates}
              >
                <LiaGithub />
              </Button>
            </div>
            <Button
              onClick={() => setShowLogin(true)}
              className={styles.btnUpdates}
            >
              {isLoggedIn ? 'Logout' : 'Login'}
            </Button>
            {isLoggedIn && (
              <div className={styles.username}>Welcome, {username}!</div>
            )}
          </div>
        </motion.div>
      )}
      {isGameActive && (
        <motion.div
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          <Game onRestart={handleRestart} onExit={handleExit} />
        </motion.div>
      )}
      <GameInstructions show={showInstructions} onClose={closeInstructions} />
      <LatestUpdates show={showLatestUpdates} onClose={closeLatestUpdates} />
      <Login
        show={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
        username={username}
      />
    </>
  );
};

export default App;
