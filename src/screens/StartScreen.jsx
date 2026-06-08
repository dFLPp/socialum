export function StartScreen({ progress, onStart, onContinue, onHowTo, onResetProgress }) {
  const hasProgress =
    progress.completedLevels.length > 0 || progress.nextLevel > 1 || progress.timesCleared > 0;
  const hasClearedGame = progress.timesCleared > 0;

  return (
    <main className="menu-screen start-screen">
      <section className="menu-center" aria-label="Menu inicial">
        <h1 className="brand-title">Socialum</h1>
        <div className="stacked-actions">
          <button className="outline-button" type="button" onClick={hasProgress ? onContinue : onStart}>
            {hasProgress ? 'continuar' : 'começar'}
          </button>
          <button className="outline-button" type="button" onClick={onHowTo}>
            como jogar
          </button>
        </div>
      </section>

      {hasClearedGame ? (
        <>
          <button className="outline-button menu-reset" type="button" onClick={onResetProgress}>
            resetar
            <br />
            progresso
          </button>
          <p className="times-cleared">zerado<br />{progress.timesCleared} vez(es)</p>
        </>
      ) : null}
    </main>
  );
}
