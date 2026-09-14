# План MVP (этапы 0–5)

Очередь задач: issues #12–#18. Детали — в [CONSTITUTION.md](./CONSTITUTION.md).

## Этап 0 — Каркас и пайплайн

Issues: #12, #14

- [x] Vite + React 18 + TypeScript
- [x] Ant Design + `ru_RU`
- [x] PWA manifest + иконки-заглушки
- [x] Структура `src/`, placeholder UI
- [x] `docs/CONSTITUTION.md`, `docs/MVP_PLAN.md`, `docs/AGENT_PIPELINE.md`
- [x] `AGENTS.md` с командами
- [ ] Линтинг из `linting.zip`, `.cursor/rules/` *(#14)*

## Этап 1 — Слой данных Open-Meteo

Issue: #16

- [ ] Клиент Geocoding API
- [ ] Клиент Archive API
- [ ] Доменная модель и маппинг ответов
- [ ] Справочник weather code → описание на русском

## Этап 2 — Выбор города и даты

Issue: #15

- [ ] Поиск города (autocomplete)
- [ ] Геолокация браузера
- [ ] DatePicker с ограничениями по дате
- [ ] Синхронизация состояния с URL

## Этап 3 — Режим A

Issue: #18

- [ ] Таблица «год × метрики» за один день
- [ ] Загрузка и отображение ошибок
- [ ] Переключение режимов A / B

## Этап 4 — Режим B

Issue: #13

- [x] Expandable rows по годам
- [x] Окно ±7 дней вокруг выбранной даты
- [x] Вложенная таблица на 15 дней

## Этап 5 — PWA polish и финализация

Issue: #17

- [ ] Финальные иконки и manifest
- [ ] Адаптив и a11y
- [ ] Обработка ошибок сети
- [ ] README и финальные чеклисты docs
