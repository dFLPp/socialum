export function VictoryScreen({ progress, summary, onContinue, onResetProgress }) {
  return (
    <main className="menu-screen victory-screen">
      <section className="victory-card">
        <h1>Voce venceu</h1>
        <p>pontuacao: {summary.score}</p>
        <p>zerado {progress.timesCleared} vez(es)</p>
        <div className="stacked-actions">
          <button className="outline-button" type="button" onClick={onContinue}>
            continuar
          </button>
          <button className="outline-button" type="button" onClick={onResetProgress}>
            zerar progresso
          </button>
        </div>
      </section>
    </main>
  );
}
