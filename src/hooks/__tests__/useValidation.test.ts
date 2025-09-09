import { renderHook, act } from '@testing-library/react';
import { useValidation } from '../useValidation';
import type { PersonalData, AddressAndWork } from '../../types';

describe('useValidation', () => {
  describe('validatePersonalData', () => {
    it('должен пройти валидацию при корректных данных', () => {
      const { result } = renderHook(() => useValidation());
      
      const validData: PersonalData = {
        phone: '0123 456 789',
        firstName: 'Иван',
        lastName: 'Иванов',
        gender: 'male',
      };

      act(() => {
        const isValid = result.current.validatePersonalData(validData);
        expect(isValid).toBe(true);
      });

      expect(result.current.errors).toEqual({});
    });

    it('должен показать ошибки при пустых полях', () => {
      const { result } = renderHook(() => useValidation());
      
      const invalidData: PersonalData = {
        phone: '',
        firstName: '',
        lastName: '',
        gender: '',
      };

      act(() => {
        const isValid = result.current.validatePersonalData(invalidData);
        expect(isValid).toBe(false);
      });

      expect(result.current.errors).toEqual({
        phone: 'Телефон обязателен для заполнения',
        firstName: 'Имя обязательно для заполнения',
        lastName: 'Фамилия обязательна для заполнения',
        gender: 'Пол обязателен для выбора',
      });
    });

    it('должен показать ошибку при неверном формате телефона', () => {
      const { result } = renderHook(() => useValidation());
      
      const invalidData: PersonalData = {
        phone: '123456789',
        firstName: 'Иван',
        lastName: 'Иванов',
        gender: 'male',
      };

      act(() => {
        const isValid = result.current.validatePersonalData(invalidData);
        expect(isValid).toBe(false);
      });

      expect(result.current.errors.phone).toBe('Телефон должен быть в формате 0XXX XXX XXX');
    });

    it('должен показать ошибку при коротком имени', () => {
      const { result } = renderHook(() => useValidation());
      
      const invalidData: PersonalData = {
        phone: '0123 456 789',
        firstName: 'И',
        lastName: 'Иванов',
        gender: 'male',
      };

      act(() => {
        const isValid = result.current.validatePersonalData(invalidData);
        expect(isValid).toBe(false);
      });

      expect(result.current.errors.firstName).toBe('Имя должно содержать минимум 2 символа');
    });
  });

  describe('validateAddressAndWork', () => {
    it('должен пройти валидацию при корректных данных', () => {
      const { result } = renderHook(() => useValidation());
      
      const validData: AddressAndWork = {
        workplace: 'IT Company',
        address: 'ул. Примерная, д. 123',
      };

      act(() => {
        const isValid = result.current.validateAddressAndWork(validData);
        expect(isValid).toBe(true);
      });

      expect(result.current.errors).toEqual({});
    });

    it('должен показать ошибки при пустых полях', () => {
      const { result } = renderHook(() => useValidation());
      
      const invalidData: AddressAndWork = {
        workplace: '',
        address: '',
      };

      act(() => {
        const isValid = result.current.validateAddressAndWork(invalidData);
        expect(isValid).toBe(false);
      });

      expect(result.current.errors).toEqual({
        workplace: 'Место работы обязательно для выбора',
        address: 'Адрес обязателен для заполнения',
      });
    });

    it('должен показать ошибку при коротком адресе', () => {
      const { result } = renderHook(() => useValidation());
      
      const invalidData: AddressAndWork = {
        workplace: 'IT Company',
        address: 'ул.1',
      };

      let isValid = false;
      act(() => {
        isValid = result.current.validateAddressAndWork(invalidData);
      });

      expect(isValid).toBe(false);
      expect(result.current.errors.address).toBe('Адрес должен содержать минимум 5 символов');
    });
  });

  describe('clearErrors', () => {
    it('должен очистить все ошибки', () => {
      const { result } = renderHook(() => useValidation());
      
      // Сначала создаем ошибки
      act(() => {
        result.current.validatePersonalData({
          phone: '',
          firstName: '',
          lastName: '',
          gender: '',
        });
      });

      expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);

      // Затем очищаем их
      act(() => {
        result.current.clearErrors();
      });

      expect(result.current.errors).toEqual({});
    });
  });
});
