import { renderHook } from '@testing-library/react';
import { usePhoneMask } from '../usePhoneMask';

describe('usePhoneMask', () => {
  it('должен форматировать номер телефона корректно', () => {
    const { result } = renderHook(() => usePhoneMask());

    expect(result.current.formatPhoneNumber('0123456789')).toBe('0123 456 789');
    expect(result.current.formatPhoneNumber('0123456')).toBe('0123 456');
    expect(result.current.formatPhoneNumber('0123')).toBe('0123');
    expect(result.current.formatPhoneNumber('')).toBe('');
  });

  it('должен ограничивать количество цифр до 10', () => {
    const { result } = renderHook(() => usePhoneMask());

    expect(result.current.formatPhoneNumber('0123456789012345')).toBe('0123 456 789');
  });

  it('должен удалять нецифровые символы', () => {
    const { result } = renderHook(() => usePhoneMask());

    expect(result.current.formatPhoneNumber('0-123-456-789')).toBe('0123 456 789');
    expect(result.current.formatPhoneNumber('+7 (123) 456-789')).toBe('7123 456 789');
  });
});
