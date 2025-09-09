import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';
import { submitLoanApplication, ApiValidationError } from '../services/api';
import styles from './LoanParametersForm.module.css';

export function LoanParametersForm() {
  const navigate = useNavigate();
  const { formData, updateLoanParameters } = useFormContext();
  
  const [localData, setLocalData] = useState(formData.loanParameters);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Синхронизируем локальное состояние с контекстом
  useEffect(() => {
    setLocalData(formData.loanParameters);
  }, [formData.loanParameters]);

  const handleAmountChange = (value: number) => {
    const newData = { ...localData, amount: value };
    setLocalData(newData);
    updateLoanParameters(newData);
  };

  const handleTermChange = (value: number) => {
    const newData = { ...localData, term: value };
    setLocalData(newData);
    updateLoanParameters(newData);
  };

  const handleBack = () => {
    navigate('/address-work');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await submitLoanApplication({
        firstName: formData.personalData.firstName,
        lastName: formData.personalData.lastName,
      });

      if (result.success) {
        // Переходим к модальному окну подтверждения
        navigate('/confirmation');
      } else {
        setError(result.message || 'Произошла ошибка при отправке заявки');
      }
    } catch (err) {
      console.error('Ошибка отправки заявки:', err);
      
      if (err instanceof ApiValidationError) {
        setError('Ошибка формата данных: API изменил структуру ответа. Пожалуйста, обратитесь к администратору.');
      } else {
        setError('Произошла ошибка при отправке заявки');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Параметры займа</h1>
      <p className={styles.subtitle}>Выберите сумму и срок займа</p>
      
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.fieldGroup}>
          <label htmlFor="amount" className={styles.label}>
            Сумма займа: {formatCurrency(localData.amount)}
          </label>
          <div className={styles.sliderContainer}>
            <input
              id="amount"
              type="range"
              min="200"
              max="1000"
              step="100"
              value={localData.amount}
              onChange={(e) => handleAmountChange(Number(e.target.value))}
              className={styles.slider}
              aria-describedby="amount-description"
            />
            <div id="amount-description" className={styles.sliderDescription}>
              От $200 до $1000, шаг $100
            </div>
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="term" className={styles.label}>
            Срок займа: {localData.term} дней
          </label>
          <div className={styles.sliderContainer}>
            <input
              id="term"
              type="range"
              min="10"
              max="30"
              step="1"
              value={localData.term}
              onChange={(e) => handleTermChange(Number(e.target.value))}
              className={styles.slider}
              aria-describedby="term-description"
            />
            <div id="term-description" className={styles.sliderDescription}>
              От 10 до 30 дней, шаг 1 день
            </div>
          </div>
        </div>

        {error && (
          <div className={styles.error} role="alert">
            {error}
          </div>
        )}

        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={handleBack}
            className={styles.backButton}
            disabled={isSubmitting}
          >
            Назад
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className={styles.spinner}></div>
                Отправка...
              </>
            ) : (
              'Подать заявку'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
