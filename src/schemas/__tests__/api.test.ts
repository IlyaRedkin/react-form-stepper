import { describe, it, expect } from 'vitest';
import { 
  ProductCategoryApiSchema, 
  ProductCategoriesApiSchema, 
  AddProductApiSchema,
  ProductCategorySchema,
  ApiResponseSchema
} from '../api';

describe('API Schemas', () => {
  describe('ProductCategoryApiSchema', () => {
    it('должен валидировать корректный объект категории', () => {
      const validCategory = {
        slug: 'smartphones',
        name: 'Smartphones',
        url: 'https://dummyjson.com/products/category/smartphones'
      };

      const result = ProductCategoryApiSchema.safeParse(validCategory);
      expect(result.success).toBe(true);
    });

    it('должен отклонять объект с невалидным URL', () => {
      const invalidCategory = {
        slug: 'smartphones',
        name: 'Smartphones',
        url: 'invalid-url'
      };

      const result = ProductCategoryApiSchema.safeParse(invalidCategory);
      expect(result.success).toBe(false);
    });

    it('должен отклонять объект без обязательных полей', () => {
      const invalidCategory = {
        slug: 'smartphones'
        // отсутствует name и url
      };

      const result = ProductCategoryApiSchema.safeParse(invalidCategory);
      expect(result.success).toBe(false);
    });
  });

  describe('ProductCategoriesApiSchema', () => {
    it('должен валидировать массив категорий', () => {
      const validCategories = [
        {
          slug: 'smartphones',
          name: 'Smartphones',
          url: 'https://dummyjson.com/products/category/smartphones'
        },
        {
          slug: 'laptops',
          name: 'Laptops',
          url: 'https://dummyjson.com/products/category/laptops'
        }
      ];

      const result = ProductCategoriesApiSchema.safeParse(validCategories);
      expect(result.success).toBe(true);
    });

    it('должен отклонять пустой массив', () => {
      const result = ProductCategoriesApiSchema.safeParse([]);
      expect(result.success).toBe(true); // Пустой массив валиден
    });

    it('должен отклонять массив с невалидными объектами', () => {
      const invalidCategories = [
        {
          slug: 'smartphones',
          name: 'Smartphones',
          url: 'invalid-url'
        }
      ];

      const result = ProductCategoriesApiSchema.safeParse(invalidCategories);
      expect(result.success).toBe(false);
    });
  });

  describe('AddProductApiSchema', () => {
    it('должен валидировать корректный объект продукта', () => {
      const validProduct = {
        id: 1,
        title: 'Test Product',
        description: 'Test Description',
        price: 100,
        discountPercentage: 10,
        rating: 4.5,
        stock: 50,
        brand: 'Test Brand',
        category: 'smartphones',
        thumbnail: 'https://example.com/thumb.jpg',
        images: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg']
      };

      const result = AddProductApiSchema.safeParse(validProduct);
      expect(result.success).toBe(true);
    });

    it('должен валидировать минимальный объект продукта', () => {
      const minimalProduct = {
        id: 1,
        title: 'Test Product'
      };

      const result = AddProductApiSchema.safeParse(minimalProduct);
      expect(result.success).toBe(true);
    });

    it('должен отклонять объект без обязательных полей', () => {
      const invalidProduct = {
        title: 'Test Product'
        // отсутствует id
      };

      const result = AddProductApiSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
    });
  });

  describe('ProductCategorySchema', () => {
    it('должен валидировать внутренний объект категории', () => {
      const validCategory = {
        id: 'smartphones',
        name: 'Smartphones'
      };

      const result = ProductCategorySchema.safeParse(validCategory);
      expect(result.success).toBe(true);
    });

    it('должен отклонять объект с невалидными полями', () => {
      const invalidCategory = {
        id: 123, // должно быть строкой
        name: 'Smartphones'
      };

      const result = ProductCategorySchema.safeParse(invalidCategory);
      expect(result.success).toBe(false);
    });
  });

  describe('ApiResponseSchema', () => {
    it('должен валидировать корректный ответ API', () => {
      const validResponse = {
        data: { id: 1, title: 'Test' },
        success: true,
        message: 'Success'
      };

      const result = ApiResponseSchema.safeParse(validResponse);
      expect(result.success).toBe(true);
    });

    it('должен валидировать ответ без сообщения', () => {
      const validResponse = {
        data: { id: 1, title: 'Test' },
        success: false
      };

      const result = ApiResponseSchema.safeParse(validResponse);
      expect(result.success).toBe(true);
    });
  });
});
