# Socialum

Socialum e um jogo minimalista de digitacao e sobrevivencia feito com React, Vite e canvas. O tema atual brinca com a pergunta: depois de usar Copilot, Cursor e agentes o dia inteiro, voce ainda consegue digitar codigo em velocidade?

## Inicio Rapido

```bash
npm install
npm run dev
```

O servidor de desenvolvimento usa Vite e esta configurado para escutar em `0.0.0.0`.

## Comandos

| Comando | Descricao |
| --- | --- |
| `npm run dev` | Inicia o servidor local de desenvolvimento. |
| `npm test` | Executa a suite de testes com Vitest. |
| `npm run build` | Gera a versao estatica de producao em `dist/`. |
| `npm run preview` | Abre uma previa local da build de producao. |

## Tema do Jogo

As palavras e frases representam pequenas provocacoes sobre dependencia de ferramentas agenticas: `sem copilot`, `tab falhou`, `prompt ruim`, `ci vermelho`, `merge quebra` e outras pressoes comuns de desenvolvimento. O objetivo e digitar cada termo para apaga-lo antes que ele encoste no personagem.

As fases aumentam a pressao aos poucos, mas as frases foram mantidas curtas para preservar o equilibrio do jogo.

## Estrutura

| Caminho | Finalidade |
| --- | --- |
| `src/game/` | Loop do jogo, geracao de palavras, pontuacao, input, audio, renderizacao em canvas e testes. |
| `src/screens/` | Telas React de inicio, como jogar, selecao de fase, resultado e vitoria. |
| `src/styles/` | Estilos globais e estilos das telas do jogo. |
| `public/assets/` | Assets opcionais para sprites, fontes, musicas e efeitos sonoros. |
| `scripts/inject-sw-manifest.mjs` | Adiciona os arquivos gerados ao manifesto de cache do service worker depois do `vite build`. |

## Assets

O jogo funciona sem assets personalizados, usando visuais de fallback e audio silencioso. Arquivos opcionais podem ser colocados em `public/assets/`; veja `public/assets/README.md` para os caminhos esperados.

## GitHub Pages

O projeto gera HTML/CSS/JS estaticos em `dist/` e publica via GitHub Actions. O workflow fica em `.github/workflows/pages.yml`.

Para habilitar o GitHub Pages no repositorio, configure a origem como **GitHub Actions** nas configuracoes do repositorio ou rode:

```bash
gh api \
  --method PUT \
  repos/:owner/:repo/pages \
  -f build_type=workflow
```

Depois disso, todo push na branch `main` executa os testes, gera a build, envia `dist/` e publica o site estatico.

## Observacoes

- `dist/` e um resultado gerado e fica fora do git de proposito.
- O Vite usa `base: './'` para que os caminhos dos assets funcionem em uma URL de projeto do GitHub Pages, como `/socialum/`.
