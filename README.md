# Simon Game

### Visão Geral

Este projeto é uma releitura moderna do clássico Simon Game, desenvolvida com foco em qualidade de interface, organização de código e experiência do usuário.

Mais do que reproduzir a mecânica do jogo, a proposta foi construir uma aplicação com acabamento de portfólio, incluindo acessibilidade, responsividade, microinterações, persistência local e testes automatizados.

### Demo

Versão online:  
https://simon-game-react-nine.vercel.app/

### Screenshot

![Versao desktop](./assets/readme/desktop.png)
![Versao mobile](./assets/readme/mobile.png)

### Destaques Para Recrutadores

- Interface moderna com foco em hierarquia visual e microinterações
- Lógica do jogo isolada em hook customizado
- Persistência local com `localStorage`
- Suporte a acessibilidade e navegação por teclado
- Modos de dificuldade e leaderboard local
- Testes automatizados cobrindo fluxos principais

### Funcionalidades

- Sequência aleatória progressiva
- Feedback visual e sonoro para cada cor
- Estados de jogo claros: início, reprodução, turno do jogador e game over
- High score persistido localmente
- Leaderboard local com top 5
- Modos `easy`, `normal` e `hard`
- Alternância de idioma entre PT-BR e EN
- Toggle de som
- Suporte a teclado nas cores e navegação acessível
- Layout responsivo para mobile e desktop

### Stack

- React
- Vite
- JavaScript
- CSS
- Vitest
- Testing Library

### Deploy

Adicione o link da versão publicada aqui.

Exemplo:

```md
[Ver projeto online](https://seu-link-aqui.com)
```

### Qualidade Técnica

- Componentes separados por responsabilidade
- Hook `useSimonGame` concentrando a regra principal do jogo
- Constantes centralizadas
- Feedback de interface orientado por estado
- Testes para:
  - início de jogo
  - avanço de fase
  - erro do jogador
  - restart

### Estrutura

```text
src/
  components/
  constants/
  hooks/
  test/
```

### Como Rodar

```bash
npm install
npm run dev
```

### Scripts

```bash
npm run dev
npm run build
npm run lint
npm test
```

### Objetivo do Projeto

Este projeto foi desenvolvido para demonstrar:

- domínio de React com hooks
- organização de interface em componentes reutilizáveis
- atenção a UX/UI
- preocupação com acessibilidade
- cuidado com qualidade de código e testes

### Contato e Links

- LinkedIn: https://www.linkedin.com/in/tamirisfreis/
- GitHub: https://github.com/tamicoding

---


