import { ReactNode } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { HiArrowPath } from 'react-icons/hi2';
import { TbDoorExit } from 'react-icons/tb';
import Scoreboard from '@/data/scoreData';
import InstructionsData from '@/data/instructionsData';
import CommitStatus from './CommitStatus';
import { handleButtonClick } from '@/utils/soundManager';
import styles from './styles/Modal.module.css';

// Interfaces
interface ScoreboardModalProps {
  show: boolean;
  onClose: () => void;
  onReset: () => void;
  onExit: () => void;
  title?: string;
  children?: ReactNode;
  score: number;
  moves: number;
  completedTime: string;
}

interface GameInstructionsProps {
  show: boolean;
  onClose: () => void;
}

interface LatestUpdatesProps {
  show: boolean;
  onClose: () => void;
}

// Main modal
export default function ScoreboardModal({
  show,
  onClose,
  onReset,
  onExit,
  title = 'Game completed!',
  children,
  score,
  moves,
  completedTime,
}: ScoreboardModalProps) {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      className={styles.modal}
      backdrop="static"
    >
      <Modal.Header className="border-0 d-flex justify-content-center">
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {children}
        <Scoreboard score={score} moves={moves} completedTime={completedTime} />
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button
          className={`${styles.btnRestart} ${styles.modalButton}`}
          onClick={handleButtonClick(onReset)}
        >
          <HiArrowPath className={`${styles.btnIcon} me-1`} />
          Restart
        </Button>
        <Button
          className={`${styles.btnExit} ${styles.modalButton}`}
          onClick={handleButtonClick(onExit)}
        >
          <TbDoorExit className={`${styles.btnIcon} me-1`} />
          Exit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

// Game Instructions
export function GameInstructions({ show, onClose }: GameInstructionsProps) {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      className={`${styles.modal} ${styles.instructionsModal}`}
    >
      <InstructionsData />
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
}

// Latest Updates
export function LatestUpdates({ show, onClose }: LatestUpdatesProps) {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      className={`${styles.modal} ${styles.latestUpdatesModal}`}
    >
      <Modal.Header className="border-0 d-flex justify-content-center">
        <Modal.Title>Latest Changes</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CommitStatus />
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
}
