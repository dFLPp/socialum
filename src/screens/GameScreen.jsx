import { GameCanvas } from '../game/GameCanvas.jsx';

export function GameScreen({ level, audioManager, onExit, onFinish }) {
  return (
    <main className="game-screen">
      <GameCanvas level={level} audioManager={audioManager} onExit={onExit} onFinish={onFinish} />
    </main>
  );
}
