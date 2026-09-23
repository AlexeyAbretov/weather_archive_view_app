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

Общий слой — vendored [`packages/linting`](./packages/linting) (`@llm/linting`). Как подключать пакет: [`packages/linting/README.md`](./packages/linting/README.md).

```bash
npm run lint
npm run lint:fix
```

ESLint 9 + Prettier. Конфиг приложения — `eslint.config.js` (`createConfig` из `@llm/linting`). Prettier — поле `prettier` в `package.json`.

Шаблон слоёв frontend (страницы, компоненты, контейнеры, алиасы, стори, тесты) — [`packages/linting/docs/frontend.md`](./packages/linting/docs/frontend.md). Для этого пресета ESLint — `createWebConfig` из `@llm/linting/web` (стрелки, алиасы корневых каталогов `src`, Storybook). Базовый `createConfig` оставляет `function` и этот модуль не загружает.

Домен приложения (город, дата, режимы A/B, Open-Meteo, `ru_RU`) — в [docs/CONSTITUTION.md](./docs/CONSTITUTION.md).

## Правила Cursor

```bash
npm run sync-cursor
```

Копирует `packages/linting/cursor/` в `.cursor/rules/` и перезаписывает только эти файлы. Общие правила правят в пакете, затем синхронизацию запускают снова. Правила проекта, которых нет в пакете, остаются на месте.

## Сборка

```bash
npm run build
npm run preview
```

Production-сборка в `dist/` (включая PWA manifest и service worker).

## Проверка PWA

```bash
npm run build
npm run preview
```

Откройте http://localhost:4173 в Chrome → DevTools → Lighthouse → категория **PWA** → проверка **Installable**.

## Документация

- [docs/CONSTITUTION.md](./docs/CONSTITUTION.md) — принципы каталога и домен приложения
- [docs/MVP_PLAN.md](./docs/MVP_PLAN.md) — этапы MVP
- [packages/linting/README.md](./packages/linting/README.md) — подключение `@llm/linting`
- [packages/linting/docs/frontend.md](./packages/linting/docs/frontend.md) — шаблон слоёв frontend
