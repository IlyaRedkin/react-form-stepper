import { LoanParametersForm } from '../components/LoanParametersForm';
import styles from './Page.module.css';

export function LoanParametersPage() {
  return (
    <div className={styles.page}>
      <LoanParametersForm />
    </div>
  );
}
