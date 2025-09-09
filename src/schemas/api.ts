import { z } from 'zod';

// Схема для категории продукта из API
export const ProductCategoryApiSchema = z.object({
  slug: z.string(),
  name: z.string(),
  url: z.string().url(),
});

// Схема для массива категорий
export const ProductCategoriesApiSchema = z.array(ProductCategoryApiSchema);

// Схема для ответа API добавления продукта
export const AddProductApiSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().optional(),
  price: z.number().optional(),
  discountPercentage: z.number().optional(),
  rating: z.number().optional(),
  stock: z.number().optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
  thumbnail: z.string().optional(),
  images: z.array(z.string()).optional(),
});

// Схемы для внутренних типов
export const ProductCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const ApiResponseSchema = z.object({
  data: z.any(),
  success: z.boolean(),
  message: z.string().optional(),
});

// Экспорт типов на основе схем
export type ProductCategoryApi = z.infer<typeof ProductCategoryApiSchema>;
export type ProductCategoriesApi = z.infer<typeof ProductCategoriesApiSchema>;
export type AddProductApi = z.infer<typeof AddProductApiSchema>;
export type ProductCategory = z.infer<typeof ProductCategorySchema>;
export type ApiResponse<T = any> = z.infer<typeof ApiResponseSchema> & { data: T };
