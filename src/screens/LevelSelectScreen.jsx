import { useState } from 'react';
import { getUnlockedLevelIds, LEVELS } from '../game/levels.js';

export function LevelSelectScreen({ progress, onBack, onSelectLevel }) {
  const unlocked = new Set(getUnlockedLevelIds(progress));
  const completed = new Set(progress.completedLevels);
  const defaultLevelId = unlocked.has(progress.nextLevel) ? progress.nextLevel : LEVELS[0].id;
  const [selectedId, setSelectedId] = useState(defaultLevelId);
  const selectedLevel = LEVELS.find((level) => level.id === selectedId);
  const canPlaySelected = selectedLevel ? unlocked.has(selectedLevel.id) : false;

  return (
    <main className="menu-screen level-select-screen">
      <button className="outline-button back-button" type="button" onClick={onBack}>
        voltar
      </button>

      <section className="level-select-layout" aria-label="Selecionar fase">
        <div className="level-track">
          {LEVELS.map((level) => {
            const canPlay = unlocked.has(level.id);
            const isComplete = completed.has(level.id);
            const isSelected = selectedId === level.id;

            return (
              <div className="level-node-wrap" key={level.id}>
                <button
                  className={`level-node${isSelected ? ' selected' : ''}${isComplete ? ' complete' : ''}`}
                  type="button"
                  disabled={!canPlay}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedId(level.id)}
                >
                  {level.id}
                </button>
                <span className="level-node-label">fase {level.id}</span>
              </div>
            );
          })}
        </div>

        {selectedLevel ? (
          <aside className="level-detail-panel" aria-label={`Detalhes da fase ${selectedLevel.id}`}>
            <button className="close-panel" type="button" onClick={() => setSelectedId(null)}>
              x
            </button>
            <h1>fase {selectedLevel.id}</h1>
            <div className="level-detail-copy">
              <p>{selectedLevel.description}</p>
              <p>{selectedLevel.wordCount} palavras</p>
            </div>
            <button
              className="outline-button"
              type="button"
              disabled={!canPlaySelected}
              onClick={() => onSelectLevel(selectedLevel.id)}
            >
              jogar
            </button>
          </aside>
        ) : null}
      </section>
    </main>
  );
}
