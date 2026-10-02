# Архив погоды

PWA для сравнения погоды в выбранном городе по одной якорной дате: 10 лет до неё и до 10 лет после, не позже текущего года. Интерфейс на русском.

Данные — [Open-Meteo Archive API](https://open-meteo.com/en/docs/historical-weather-api) (non-commercial use). Будущие даты и годы без архива показываются как «нет данных», без прогноза.

## Возможности

- Поиск города (Open-Meteo Geocoding, `language=ru`) и «Моё местоположение».
- Якорная дата, в том числе 29 февраля.
- **По годам (A)** — таблица лет для выбранной даты: температура min/max, осадки, ветер, облачность.
- **По неделям (B)** — по каждому году неделя вокруг даты (7 дней до и 7 после); данные подгружаются при раскрытии года.
- Устанавливаемое PWA: manifest, иконки, service worker.

## Стек

Vite, React, TypeScript, Ant Design (`ru_RU`), `vite-plugin-pwa`. Требуется **Node.js ≥ 22**.

## Запуск

```bash
npm install
npm run dev
```

Dev-сервер: http://localhost:5173.

## Скрипты

| Команда | Назначение |
| --- | --- |
| `npm run dev` | Локальная разработка |
| `npm test` | Тесты (Vitest) |
| `npm run test:watch` | Тесты в watch-режиме |
| `npm run lint` | ESLint |
| `npm run lint:fix` | ESLint с автоправкой |
| `npm run storybook` | Storybook на порту 6006 |
| `npm run build` | Production-сборка в `dist/` |
| `npm run preview` | Просмотр сборки (http://localhost:4173) |

Проверка PWA: `npm run build`, затем `npm run preview`, в Chrome — DevTools → Lighthouse → **PWA** → **Installable**.

## Документация

- [docs/CONSTITUTION.md](./docs/CONSTITUTION.md) — домен и ограничения
- [docs/MVP_PLAN.md](./docs/MVP_PLAN.md) — этапы MVP
- [AGENTS.md](./AGENTS.md) — команды для разработки и линтинг
