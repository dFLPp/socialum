import { FINAL_LEVEL_ID } from '../game/levels.js';

export function ResultScreen({ summary, onMenu, onRetry, onNext }) {
  const won = summary.outcome === 'won';
  const hearts = Array.from({ length: 3 }, (_, index) => index < summary.lives);

  return (
    <main className="menu-screen result-screen">
      <section className="result-stage" aria-label={won ? 'Resultado: ganhou' : 'Resultado: perdeu'}>
        <div className={`result-player${won ? ' won' : ' lost'}`}>
          <div className="player-token" aria-label="Jogador">S</div>
          <div className="result-hearts" aria-label={`${summary.lives} vidas restantes`}>
            {hearts.map((filled, index) => (
              <span className={filled ? 'heart filled' : 'heart'} key={index}>♥</span>
            ))}
          </div>
        </div>

        <aside className="result-card">
          <h1>{won ? 'Voce ganhou' : 'Voce perdeu'}</h1>
          <p>pontuacao: {summary.score}</p>
          {won ? <p>erros: {summary.mistakes}</p> : null}
          <div className="stacked-actions">
            {won && summary.levelId < FINAL_LEVEL_ID ? (
              <button className="outline-button" type="button" onClick={onNext}>
                proxima fase
              </button>
            ) : (
              <button className="outline-button" type="button" onClick={onRetry}>
                tentar denovo
              </button>
            )}
            <button className="outline-button" type="button" onClick={onMenu}>
              sair
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}
