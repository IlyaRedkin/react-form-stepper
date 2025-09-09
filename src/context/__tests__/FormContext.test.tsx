import { renderHook, act } from '@testing-library/react';
import { FormProvider, useFormContext } from '../FormContext';
import type { PersonalData, AddressAndWork, LoanParameters } from '../../types';

// Обертка для тестов
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <FormProvider>{children}</FormProvider>
);

describe('FormContext', () => {
  it('должен предоставлять начальное состояние', () => {
    const { result } = renderHook(() => useFormContext(), { wrapper });

    expect(result.current.formData).toEqual({
      personalData: {
        phone: '',
        firstName: '',
        lastName: '',
        gender: '',
      },
      addressAndWork: {
        workplace: '',
        address: '',
      },
      loanParameters: {
        amount: 200,
        term: 10,
      },
    });
  });

  it('должен обновлять личные данные', () => {
    const { result } = renderHook(() => useFormContext(), { wrapper });

    const newPersonalData: Partial<PersonalData> = {
      phone: '0123 456 789',
      firstName: 'Иван',
      lastName: 'Иванов',
      gender: 'male',
    };

    act(() => {
      result.current.updatePersonalData(newPersonalData);
    });

    expect(result.current.formData.personalData).toEqual({
      phone: '0123 456 789',
      firstName: 'Иван',
      lastName: 'Иванов',
      gender: 'male',
    });
  });

  it('должен обновлять данные адреса и работы', () => {
    const { result } = renderHook(() => useFormContext(), { wrapper });

    const newAddressAndWork: Partial<AddressAndWork> = {
      workplace: 'IT Company',
      address: 'ул. Примерная, д. 123',
    };

    act(() => {
      result.current.updateAddressAndWork(newAddressAndWork);
    });

    expect(result.current.formData.addressAndWork).toEqual({
      workplace: 'IT Company',
      address: 'ул. Примерная, д. 123',
    });
  });

  it('должен обновлять параметры займа', () => {
    const { result } = renderHook(() => useFormContext(), { wrapper });

    const newLoanParameters: Partial<LoanParameters> = {
      amount: 500,
      term: 20,
    };

    act(() => {
      result.current.updateLoanParameters(newLoanParameters);
    });

    expect(result.current.formData.loanParameters).toEqual({
      amount: 500,
      term: 20,
    });
  });

  it('должен сбрасывать форму', () => {
    const { result } = renderHook(() => useFormContext(), { wrapper });

    // Сначала заполняем данные
    act(() => {
      result.current.updatePersonalData({
        phone: '0123 456 789',
        firstName: 'Иван',
        lastName: 'Иванов',
        gender: 'male',
      });
      result.current.updateAddressAndWork({
        workplace: 'IT Company',
        address: 'ул. Примерная, д. 123',
      });
      result.current.updateLoanParameters({
        amount: 500,
        term: 20,
      });
    });

    // Проверяем, что данные заполнены
    expect(result.current.formData.personalData.firstName).toBe('Иван');

    // Сбрасываем форму
    act(() => {
      result.current.resetForm();
    });

    // Проверяем, что форма сброшена
    expect(result.current.formData).toEqual({
      personalData: {
        phone: '',
        firstName: '',
        lastName: '',
        gender: '',
      },
      addressAndWork: {
        workplace: '',
        address: '',
      },
      loanParameters: {
        amount: 200,
        term: 10,
      },
    });
  });

  it('должен выбросить ошибку при использовании вне провайдера', () => {
    // Подавляем console.error для этого теста
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useFormContext());
    }).toThrow('useFormContext must be used within a FormProvider');

    consoleSpy.mockRestore();
  });
});
