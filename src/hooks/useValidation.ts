import { useState, useCallback } from 'react';
import type { ValidationErrors, PersonalData, AddressAndWork } from '../types';

// Регулярное выражение для проверки телефона в формате 0XXX XXX XXX
const PHONE_REGEX = /^0\d{3}\s\d{3}\s\d{3}$/;

export function useValidation() {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validatePersonalData = useCallback((data: PersonalData): boolean => {
    const newErrors: ValidationErrors = {};

    // Валидация телефона
    if (!data.phone) {
      newErrors.phone = 'Телефон обязателен для заполнения';
    } else if (!PHONE_REGEX.test(data.phone)) {
      newErrors.phone = 'Телефон должен быть в формате 0XXX XXX XXX';
    }

    // Валидация имени
    if (!data.firstName.trim()) {
      newErrors.firstName = 'Имя обязательно для заполнения';
    } else if (data.firstName.trim().length < 2) {
      newErrors.firstName = 'Имя должно содержать минимум 2 символа';
    }

    // Валидация фамилии
    if (!data.lastName.trim()) {
      newErrors.lastName = 'Фамилия обязательна для заполнения';
    } else if (data.lastName.trim().length < 2) {
      newErrors.lastName = 'Фамилия должна содержать минимум 2 символа';
    }

    // Валидация пола
    if (!data.gender) {
      newErrors.gender = 'Пол обязателен для выбора';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const validateAddressAndWork = useCallback((data: AddressAndWork): boolean => {
    const newErrors: ValidationErrors = {};

    // Валидация места работы
    if (!data.workplace) {
      newErrors.workplace = 'Место работы обязательно для выбора';
    }

    // Валидация адреса
    if (!data.address.trim()) {
      newErrors.address = 'Адрес обязателен для заполнения';
    } else if (data.address.trim().length < 5) {
      newErrors.address = 'Адрес должен содержать минимум 5 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const setFieldError = useCallback((field: string, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  }, []);

  return {
    errors,
    validatePersonalData,
    validateAddressAndWork,
    clearErrors,
    setFieldError,
  };
}
