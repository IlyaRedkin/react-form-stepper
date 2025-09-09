import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';
import { useValidation } from '../hooks/useValidation';
import { usePhoneMask } from '../hooks/usePhoneMask';
import styles from './PersonalDataForm.module.css';

export function PersonalDataForm() {
  const navigate = useNavigate();
  const { formData, updatePersonalData } = useFormContext();
  const { errors, validatePersonalData, clearErrors } = useValidation();
  const { handlePhoneChange } = usePhoneMask();
  
  const [localData, setLocalData] = useState(formData.personalData);

  // Синхронизируем локальное состояние с контекстом
  useEffect(() => {
    setLocalData(formData.personalData);
  }, [formData.personalData]);

  const handleInputChange = (field: keyof typeof localData, value: string) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    updatePersonalData(newData);
    
    // Очищаем ошибку для этого поля при изменении
    if (errors[field]) {
      clearErrors();
    }
  };

  const handlePhoneInputChange = (value: string) => {
    handlePhoneChange(value, (formatted) => {
      handleInputChange('phone', formatted);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validatePersonalData(localData)) {
      navigate('/address-work');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Личные данные</h1>
      <p className={styles.subtitle}>Пожалуйста, заполните ваши личные данные</p>
      
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.fieldGroup}>
          <label htmlFor="phone" className={styles.label}>
            Телефон *
          </label>
          <input
            id="phone"
            type="tel"
            value={localData.phone}
            onChange={(e) => handlePhoneInputChange(e.target.value)}
            placeholder="0XXX XXX XXX"
            className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            aria-invalid={!!errors.phone}
            required
          />
          {errors.phone && (
            <div id="phone-error" className={styles.errorMessage} role="alert">
              {errors.phone}
            </div>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="firstName" className={styles.label}>
            Имя *
          </label>
          <input
            id="firstName"
            type="text"
            value={localData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder="Введите ваше имя"
            className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
            aria-describedby={errors.firstName ? 'firstName-error' : undefined}
            aria-invalid={!!errors.firstName}
            required
          />
          {errors.firstName && (
            <div id="firstName-error" className={styles.errorMessage} role="alert">
              {errors.firstName}
            </div>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="lastName" className={styles.label}>
            Фамилия *
          </label>
          <input
            id="lastName"
            type="text"
            value={localData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder="Введите вашу фамилию"
            className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
            aria-describedby={errors.lastName ? 'lastName-error' : undefined}
            aria-invalid={!!errors.lastName}
            required
          />
          {errors.lastName && (
            <div id="lastName-error" className={styles.errorMessage} role="alert">
              {errors.lastName}
            </div>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="gender" className={styles.label}>
            Пол *
          </label>
          <select
            id="gender"
            value={localData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className={`${styles.select} ${errors.gender ? styles.inputError : ''}`}
            aria-describedby={errors.gender ? 'gender-error' : undefined}
            aria-invalid={!!errors.gender}
            required
          >
            <option value="">Выберите пол</option>
            <option value="male">Мужской</option>
            <option value="female">Женский</option>
          </select>
          {errors.gender && (
            <div id="gender-error" className={styles.errorMessage} role="alert">
              {errors.gender}
            </div>
          )}
        </div>

        <button type="submit" className={styles.submitButton}>
          Далее
        </button>
      </form>
    </div>
  );
}
