# Пайплайн агентов

Оркестрация разработки MVP через GitHub Issues и Cloud Agents.

## Роли

| Роль | Задача |
|------|--------|
| **analyst** | Разбор issue, план реализации, метка `ready-for-dev` |
| **developer** | Реализация, PR, документация этапа |
| **QA** | Проверка по чеклисту, метка `qa-passed` / `needs-fix` |

## Flow

1. Issue создаётся оркестратором с меткой `feature`.
2. Analyst анализирует и оставляет план в комментарии.
3. Developer создаёт ветку `issue/<номер>-краткое-имя`, реализует, открывает PR с `Fixes #<номер>`.
4. QA проверяет PR по чеклисту из плана.
5. Человек мержит PR после `qa-passed`.

## Метки

- `feature` — задача на разработку
- `ready-for-dev` — готова к реализации
- `qa-passed` / `needs-fix` — результат QA

## Документы

- [AGENT_PIPELINE_PLAN.md](./AGENT_PIPELINE_PLAN.md) — чеклист этапов пайплайна
- [MVP_PLAN.md](./MVP_PLAN.md) — чеклист этапов MVP
- [CONSTITUTION.md](./CONSTITUTION.md) — принципы каталога
