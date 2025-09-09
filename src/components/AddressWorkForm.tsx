import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';
import { useValidation } from '../hooks/useValidation';
import { getProductCategories, ApiValidationError } from '../services/api';
import type { ProductCategory } from '../schemas/api';
import styles from './AddressWorkForm.module.css';

export function AddressWorkForm() {
  const navigate = useNavigate();
  const { formData, updateAddressAndWork } = useFormContext();
  const { errors, validateAddressAndWork, clearErrors } = useValidation();
  
  const [localData, setLocalData] = useState(formData.addressAndWork);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загружаем категории при монтировании компонента
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductCategories();
        setCategories(data);
      } catch (err) {
        console.error('Ошибка загрузки категорий:', err);
        
        if (err instanceof ApiValidationError) {
          setError('Ошибка формата данных: API изменил структуру ответа. Пожалуйста, обратитесь к администратору.');
        } else {
          setError('Не удалось загрузить список мест работы');
        }
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Синхронизируем локальное состояние с контекстом
  useEffect(() => {
    setLocalData(formData.addressAndWork);
  }, [formData.addressAndWork]);

  const handleInputChange = (field: keyof typeof localData, value: string) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    updateAddressAndWork(newData);
    
    // Очищаем ошибку для этого поля при изменении
    if (errors[field]) {
      clearErrors();
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateAddressAndWork(localData)) {
      navigate('/loan-parameters');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Адрес и место работы</h1>
      <p className={styles.subtitle}>Укажите ваше место работы и адрес проживания</p>
      
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.fieldGroup}>
          <label htmlFor="workplace" className={styles.label}>
            Место работы *
          </label>
          {loading ? (
            <div className={styles.loading} role="status" aria-label="Загрузка мест работы">
              <div className={styles.spinner}></div>
              Загрузка...
            </div>
          ) : error ? (
            <div className={styles.error} role="alert">
              {error}
            </div>
          ) : (
            <select
              id="workplace"
              value={localData.workplace}
              onChange={(e) => handleInputChange('workplace', e.target.value)}
              className={`${styles.select} ${errors.workplace ? styles.inputError : ''}`}
              aria-describedby={errors.workplace ? 'workplace-error' : undefined}
              aria-invalid={!!errors.workplace}
              required
            >
              <option value="">Выберите место работы</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
          {errors.workplace && (
            <div id="workplace-error" className={styles.errorMessage} role="alert">
              {errors.workplace}
            </div>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="address" className={styles.label}>
            Адрес проживания *
          </label>
          <input
            id="address"
            type="text"
            value={localData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Введите ваш адрес проживания"
            className={`${styles.input} ${errors.address ? styles.inputError : ''}`}
            aria-describedby={errors.address ? 'address-error' : undefined}
            aria-invalid={!!errors.address}
            required
          />
          {errors.address && (
            <div id="address-error" className={styles.errorMessage} role="alert">
              {errors.address}
            </div>
          )}
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={handleBack}
            className={styles.backButton}
          >
            Назад
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            Далее
          </button>
        </div>
      </form>
    </div>
  );
}
