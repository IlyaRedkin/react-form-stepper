import { z } from 'zod';
import { 
  ProductCategoriesApiSchema, 
  AddProductApiSchema,
  ProductCategorySchema,
  type ProductCategory,
  type ApiResponse,
  type ProductCategoryApi
} from '../schemas/api';

// Базовый URL для API
const BASE_URL = 'https://dummyjson.com';

// Кэш для категорий продуктов
let categoriesCache: ProductCategory[] | null = null;

// Класс для ошибок валидации API
export class ApiValidationError extends Error {
  public validationErrors: z.ZodError;
  
  constructor(message: string, validationErrors: z.ZodError) {
    super(message);
    this.name = 'ApiValidationError';
    this.validationErrors = validationErrors;
  }
}

/**
 * Получение списка категорий продуктов
 * Использует кэширование для оптимизации повторных запросов
 */
export async function getProductCategories(): Promise<ProductCategory[]> {
  // Возвращаем кэшированные данные, если они есть
  if (categoriesCache) {
    return categoriesCache;
  }

  try {
    const response = await fetch(`${BASE_URL}/products/categories`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const rawData = await response.json();
    
    // Валидируем ответ API с помощью Zod
    const validationResult = ProductCategoriesApiSchema.safeParse(rawData);
    
    if (!validationResult.success) {
      console.error('Ошибка валидации API ответа:', validationResult.error);
      throw new ApiValidationError(
        'Получен невалидный ответ от сервера. Формат данных изменился.',
        validationResult.error
      );
    }
    
    const categories = validationResult.data;
    
    // Преобразуем массив объектов в массив объектов с id и name
    const formattedCategories: ProductCategory[] = categories.map((category: ProductCategoryApi) => ({
      id: category.slug,
      name: category.name,
    }));
    
    // Дополнительная валидация преобразованных данных
    const formattedValidation = z.array(ProductCategorySchema).safeParse(formattedCategories);
    if (!formattedValidation.success) {
      console.error('Ошибка валидации преобразованных данных:', formattedValidation.error);
      throw new ApiValidationError(
        'Ошибка при преобразовании данных категорий',
        formattedValidation.error
      );
    }
    
    // Кэшируем результат
    categoriesCache = formattedCategories;
    
    return formattedCategories;
  } catch (error) {
    console.error('Ошибка при получении категорий продуктов:', error);
    
    if (error instanceof ApiValidationError) {
      throw error;
    }
    
    throw new Error('Не удалось загрузить категории продуктов');
  }
}

/**
 * Отправка заявки на займ
 * Использует тестовый API для добавления продукта
 */
export async function submitLoanApplication(data: {
  firstName: string;
  lastName: string;
}): Promise<ApiResponse<{ id: number; title: string }>> {
  try {
    const response = await fetch(`${BASE_URL}/products/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: `${data.firstName} ${data.lastName}`,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawData = await response.json();
    
    // Валидируем ответ API с помощью Zod
    const validationResult = AddProductApiSchema.safeParse(rawData);
    
    if (!validationResult.success) {
      console.error('Ошибка валидации API ответа:', validationResult.error);
      throw new ApiValidationError(
        'Получен невалидный ответ от сервера при отправке заявки. Формат данных изменился.',
        validationResult.error
      );
    }
    
    const result = validationResult.data;
    
    return {
      data: { id: result.id, title: result.title },
      success: true,
      message: 'Заявка успешно отправлена',
    };
  } catch (error) {
    console.error('Ошибка при отправке заявки:', error);
    
    if (error instanceof ApiValidationError) {
      return {
        data: { id: 0, title: '' },
        success: false,
        message: error.message,
      };
    }
    
    return {
      data: { id: 0, title: '' },
      success: false,
      message: 'Ошибка при отправке заявки',
    };
  }
}
