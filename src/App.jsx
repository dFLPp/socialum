import { startTransition, useRef, useState } from 'react';
import { createAudioManager } from './game/audio.js';
import { FINAL_LEVEL_ID, getLevelById } from './game/levels.js';
import { completeLevel, loadProgress, resetProgress } from './game/storage.js';
import { GameScreen } from './screens/GameScreen.jsx';
import { HowToScreen } from './screens/HowToScreen.jsx';
import { LevelSelectScreen } from './screens/LevelSelectScreen.jsx';
import { ResultScreen } from './screens/ResultScreen.jsx';
import { StartScreen } from './screens/StartScreen.jsx';
import { VictoryScreen } from './screens/VictoryScreen.jsx';

export default function App() {
  const audioManagerRef = useRef(null);
  if (!audioManagerRef.current) {
    audioManagerRef.current = createAudioManager();
  }

  const [progress, setProgress] = useState(() => loadProgress());
  const [route, setRoute] = useState({ name: 'start' });

  function goToStart() {
    startTransition(() => setRoute({ name: 'start' }));
  }

  function startLevel(levelId) {
    audioManagerRef.current.markUnlocked();
    startTransition(() => setRoute({ name: 'game', levelId }));
  }

  function handleLevelFinished(summary) {
    if (summary.outcome === 'won') {
      const nextProgress = completeLevel(progress, summary.levelId);
      setProgress(nextProgress);

      if (summary.levelId === FINAL_LEVEL_ID) {
        startTransition(() => setRoute({ name: 'victory', summary, progress: nextProgress }));
        return;
      }
    }

    startTransition(() => setRoute({ name: 'result', summary }));
  }

  function handleResetProgress() {
    setProgress(resetProgress());
    startTransition(() => setRoute({ name: 'start' }));
  }

  if (route.name === 'select') {
    return (
      <LevelSelectScreen
        progress={progress}
        onBack={goToStart}
        onSelectLevel={startLevel}
      />
    );
  }

  if (route.name === 'how-to') {
    return <HowToScreen onBack={goToStart} />;
  }

  if (route.name === 'game') {
    const level = getLevelById(route.levelId);
    return (
      <GameScreen
        level={level}
        audioManager={audioManagerRef.current}
        onExit={goToStart}
        onFinish={handleLevelFinished}
      />
    );
  }

  if (route.name === 'result') {
    return (
      <ResultScreen
        summary={route.summary}
        onMenu={goToStart}
        onRetry={() => startLevel(route.summary.levelId)}
        onNext={() => startLevel(route.summary.levelId + 1)}
      />
    );
  }

  if (route.name === 'victory') {
    return (
      <VictoryScreen
        progress={route.progress}
        summary={route.summary}
        onContinue={goToStart}
        onResetProgress={handleResetProgress}
      />
    );
  }

  return (
    <StartScreen
      progress={progress}
      onStart={() => startLevel(1)}
      onContinue={() => startTransition(() => setRoute({ name: 'select' }))}
      onHowTo={() => startTransition(() => setRoute({ name: 'how-to' }))}
      onResetProgress={handleResetProgress}
    />
  );
}
