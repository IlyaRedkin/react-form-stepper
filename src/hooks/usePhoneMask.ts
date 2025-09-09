import { useCallback } from 'react';

/**
 * Хук для форматирования номера телефона в формате 0XXX XXX XXX
 */
export function usePhoneMask() {
  const formatPhoneNumber = useCallback((value: string): string => {
    // Удаляем все нецифровые символы
    const numbers = value.replace(/\D/g, '');
    
    // Ограничиваем до 10 цифр
    const limitedNumbers = numbers.slice(0, 10);
    
    // Форматируем в соответствии с маской 0XXX XXX XXX
    if (limitedNumbers.length === 0) return '';
    if (limitedNumbers.length <= 4) return limitedNumbers;
    if (limitedNumbers.length <= 7) {
      return `${limitedNumbers.slice(0, 4)} ${limitedNumbers.slice(4)}`;
    }
    return `${limitedNumbers.slice(0, 4)} ${limitedNumbers.slice(4, 7)} ${limitedNumbers.slice(7)}`;
  }, []);

  const handlePhoneChange = useCallback((value: string, onChange: (value: string) => void) => {
    const formatted = formatPhoneNumber(value);
    onChange(formatted);
  }, [formatPhoneNumber]);

  return {
    formatPhoneNumber,
    handlePhoneChange,
  };
}
