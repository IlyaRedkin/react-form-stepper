import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getProductCategories, submitLoanApplication } from '../api';

// Мокаем fetch
globalThis.fetch = vi.fn();

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Сбрасываем кэш перед каждым тестом
    vi.resetModules();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getProductCategories', () => {
    it('должен успешно получить категории продуктов', async () => {
      const mockCategories = [
        { slug: 'smartphones', name: 'Smartphones', url: 'https://dummyjson.com/products/category/smartphones' },
        { slug: 'laptops', name: 'Laptops', url: 'https://dummyjson.com/products/category/laptops' },
        { slug: 'fragrances', name: 'Fragrances', url: 'https://dummyjson.com/products/category/fragrances' },
      ];
      
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCategories,
      });

      const result = await getProductCategories();

      expect(fetch).toHaveBeenCalledWith('https://dummyjson.com/products/categories');
      expect(result).toEqual([
        { id: 'smartphones', name: 'Smartphones' },
        { id: 'laptops', name: 'Laptops' },
        { id: 'fragrances', name: 'Fragrances' },
      ]);
    });

    it('должен использовать кэш при повторном вызове', async () => {
      // Сбрасываем модуль для очистки кэша
      vi.resetModules();
      
      const mockCategories = [
        { slug: 'smartphones', name: 'Smartphones', url: 'https://dummyjson.com/products/category/smartphones' },
        { slug: 'laptops', name: 'Laptops', url: 'https://dummyjson.com/products/category/laptops' },
      ];
      
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCategories,
      });

      // Импортируем функцию заново
      const { getProductCategories: freshGetProductCategories } = await import('../api');

      // Первый вызов
      await freshGetProductCategories();
      expect(fetch).toHaveBeenCalledTimes(1);

      // Второй вызов должен использовать кэш
      const result = await freshGetProductCategories();
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual([
        { id: 'smartphones', name: 'Smartphones' },
        { id: 'laptops', name: 'Laptops' },
      ]);
    });

    it('должен выбросить ошибку при неудачном запросе', async () => {
      // Сбрасываем модуль для очистки кэша
      vi.resetModules();
      
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      // Импортируем функцию заново
      const { getProductCategories: freshGetProductCategories } = await import('../api');
      
      await expect(freshGetProductCategories()).rejects.toThrow('Не удалось загрузить категории продуктов');
    });

    it('должен выбросить ошибку при сетевой ошибке', async () => {
      // Сбрасываем модуль для очистки кэша
      vi.resetModules();
      
      (fetch as any).mockRejectedValueOnce(new Error('Network error'));

      // Импортируем функцию заново
      const { getProductCategories: freshGetProductCategories } = await import('../api');
      
      await expect(freshGetProductCategories()).rejects.toThrow('Не удалось загрузить категории продуктов');
    });

    it('должен выбросить ошибку валидации при невалидном формате данных', async () => {
      // Сбрасываем модуль для очистки кэша
      vi.resetModules();
      
      const invalidData = [
        { invalidField: 'test' }, // невалидная структура
        { slug: 'test', name: 'Test' } // отсутствует url
      ];
      
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => invalidData,
      });

      // Импортируем функцию заново
      const { getProductCategories: freshGetProductCategories } = await import('../api');
      
      await expect(freshGetProductCategories()).rejects.toThrow('Получен невалидный ответ от сервера');
    });
  });

  describe('submitLoanApplication', () => {
    it('должен успешно отправить заявку', async () => {
      const mockResponse = { id: 1, title: 'Иван Иванов' };
      
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await submitLoanApplication({
        firstName: 'Иван',
        lastName: 'Иванов',
      });

      expect(fetch).toHaveBeenCalledWith('https://dummyjson.com/products/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Иван Иванов',
        }),
      });

      expect(result).toEqual({
        data: mockResponse,
        success: true,
        message: 'Заявка успешно отправлена',
      });
    });

    it('должен вернуть ошибку при неудачном запросе', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      const result = await submitLoanApplication({
        firstName: 'Иван',
        lastName: 'Иванов',
      });

      expect(result).toEqual({
        data: { id: 0, title: '' },
        success: false,
        message: 'Ошибка при отправке заявки',
      });
    });

    it('должен вернуть ошибку при сетевой ошибке', async () => {
      (fetch as any).mockRejectedValueOnce(new Error('Network error'));

      const result = await submitLoanApplication({
        firstName: 'Иван',
        lastName: 'Иванов',
      });

      expect(result).toEqual({
        data: { id: 0, title: '' },
        success: false,
        message: 'Ошибка при отправке заявки',
      });
    });

    it('должен вернуть ошибку валидации при невалидном формате данных', async () => {
      const invalidResponse = { invalidField: 'test' }; // невалидная структура
      
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => invalidResponse,
      });

      const result = await submitLoanApplication({
        firstName: 'Иван',
        lastName: 'Иванов',
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain('невалидный ответ от сервера');
    });
  });
});
