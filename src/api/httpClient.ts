import { ApiError } from '../domain/errors';

const DEFAULT_TIMEOUT_MS = 30_000;

export async function fetchJson<T>(url: string, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new ApiError(`Ошибка сервера (${response.status})`);
    }

    const data = (await response.json()) as T & { error?: boolean; reason?: string };

    if (data.error) {
      throw new ApiError(data.reason ?? 'Не удалось выполнить запрос');
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('Превышено время ожидания ответа');
    }
    throw new ApiError('Ошибка сети');
  } finally {
    clearTimeout(timeoutId);
  }
}
