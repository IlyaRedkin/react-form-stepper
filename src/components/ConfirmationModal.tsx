import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';
import styles from './ConfirmationModal.module.css';

export function ConfirmationModal() {
  const navigate = useNavigate();
  const { formData, resetForm } = useFormContext();

  const { personalData, loanParameters } = formData;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleStartNew = () => {
    resetForm();
    navigate('/');
  };

  // Блокируем прокрутку страницы при открытом модальном окне
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Обработка нажатия Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleStartNew();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 id="modal-title" className={styles.title}>
            Поздравляем!
          </h2>
        </div>
        
        <div className={styles.content}>
          <div className={styles.message}>
            <p className={styles.greeting}>
              Поздравляем, <strong>{personalData.lastName} {personalData.firstName}</strong>.
            </p>
            <p className={styles.approval}>
              Вам одобрена <strong>{formatCurrency(loanParameters.amount)}</strong> на{' '}
              <strong>{loanParameters.term} дней</strong>.
            </p>
          </div>
          
          <div className={styles.details}>
            <h3 className={styles.detailsTitle}>Детали займа:</h3>
            <div className={styles.detailsList}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Сумма:</span>
                <span className={styles.detailValue}>{formatCurrency(loanParameters.amount)}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Срок:</span>
                <span className={styles.detailValue}>{loanParameters.term} дней</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Телефон:</span>
                <span className={styles.detailValue}>{personalData.phone}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.footer}>
          <button
            onClick={handleStartNew}
            className={styles.button}
            autoFocus
          >
            Подать новую заявку
          </button>
        </div>
      </div>
    </div>
  );
}
