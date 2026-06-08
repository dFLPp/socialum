export function HowToScreen({ onBack }) {
  return (
    <main className="menu-screen how-to-screen">
      <section className="how-to-card" aria-labelledby="how-to-title">
        <h1 id="how-to-title">Como jogar</h1>
        <div className="instruction-box">
          <p>
            Digite a palavra que apareceu primeiro antes dela bater no personagem.
          </p>
          <p>
            Letras certas avançam a palavra. Letra errada dá feedback vermelho e conta erro.
          </p>
          <p>
            Se a palavra encostar no personagem, você perde vida. Sobreviva à fase para liberar a próxima.
          </p>
        </div>
        <button className="outline-button" type="button" onClick={onBack}>
          voltar
        </button>
      </section>
    </main>
  );
}
