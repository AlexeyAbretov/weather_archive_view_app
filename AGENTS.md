# Команды для агентов

Требования: **Node.js ≥ 22**.

## Установка

```bash
npm install
```

## Разработка

```bash
npm run dev
```

Dev-сервер Vite (по умолчанию http://localhost:5173).

## Линтинг

```bash
npm run lint
npm run lint:fix
```

ESLint 9 + Prettier через `@llm/linting` (`eslint.config.js`).

## Сборка

```bash
npm run build
npm run preview
```

Production-сборка в `dist/` (включая PWA manifest и service worker).

## Документация

- [docs/CONSTITUTION.md](./docs/CONSTITUTION.md) — принципы каталога
- [docs/MVP_PLAN.md](./docs/MVP_PLAN.md) — этапы MVP
- [docs/AGENT_PIPELINE.md](./docs/AGENT_PIPELINE.md) — пайплайн агентов
