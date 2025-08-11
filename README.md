## Spotify – Frontend

## Deploy

https://spotify-frontend-zeta-blue.vercel.app/login

## Screens

![Home](screens/home.png)
![Home (Mobile)](screens/home-mobile.png)

## Player Expandido

![Player Expandido](screens/expandenplayer.png)
![Player Expandido (Mobile)](screens/expandedplayer-mobile.png)

## Login
![Login](screens/Login.jpg)

## Álbum

![Página do Álbum](screens/album-page.png)

## Perfil

![Página de Perfil](screens/profile-page.png)

## Playlists

![Lista de Playlists](screens/playlist-page.png)
![Página de Playlist](screens/playlit-page.png)
![Página de Playlist (dono)](screens/playlist-ownder-page.png)

## Criar Playlist

![Criar Playlist](screens/create-playlist.png)

## Artistas

![Página de Artistas](screens/artistas-page.png)
![Top Artistas](screens/top-artistas.png)

## Busca

![Busca](screens/buscar.png)
![Prévia de Resultados](screens/results-preview.png)
![Buscas Recentes](screens/buscas-recentes.png)

---

### Como começar

#### Pré-requisitos

- Node.js 18+ e Yarn
- Credenciais da API do Spotify (Client ID/Secret) e uma Redirect URI configurada no Spotify Developer Dashboard

#### 1) Instalar dependências

```bash
yarn
```

#### 2) Variáveis de ambiente

Crie um arquivo `.env.local` (ou utilize seu fluxo de env preferido) e defina os valores. Exemplo:

```bash
VITE_API_URL=<url do backend>
```

#### 3) Executar em desenvolvimento

```bash
yarn dev
```

Aplicação disponível em:

```
http://localhost:5173
```

#### 4) Build e Preview

```bash
yarn build
yarn preview
```

#### 5) Testes e Lint

```bash
# Testes unitários (Vitest)
yarn test

# Testes E2E (Playwright)
yarn test:e2e
# UI dos testes E2E (opcional)
yarn test:e2e:ui
# Relatório HTML do Playwright
yarn test:e2e:report

# Lint
yarn lint
```

---

### Scripts úteis

- `yarn dev`: inicia o servidor de desenvolvimento (Vite)
- `yarn build`: compila o app para produção
- `yarn preview`: pré-visualiza o build de produção
- `yarn test`: executa os testes unitários (Vitest)
- `yarn test:e2e`: executa os testes end-to-end (Playwright)
- `yarn test:e2e:ui`: abre a interface do Playwright Test
- `yarn test:e2e:report`: abre o relatório HTML mais recente
- `yarn lint`: roda o ESLint

---

### Notas de desenvolvimento

- Reprodução (Playback): utiliza Spotify Web Playback SDK + Web API. É necessária uma conta Spotify Premium para controlar a reprodução via Web SDK.
- HTTPS (opcional): alguns navegadores/dispositivos exigem HTTPS para determinados recursos.
  - Caminho mais simples: `vite-plugin-mkcert` ou túnel (ex.: `ngrok`).
- PWA: o app registra um Service Worker quando servido em HTTPS (ou localhost) para oferecer experiência instalável/offline básica.

### Solução de problemas

- A reprodução não inicia:
  - Garanta que você está autenticado, possui um dispositivo ativo e que a conta é Premium.
  - Abra o aplicativo Spotify em qualquer dispositivo para “ativar” um device e, então, selecione-o no app (se aplicável).

---

### Licença

Projeto para fins educacionais/demonstração. Verifique os Termos de Desenvolvedor do Spotify antes de ir para produção.
