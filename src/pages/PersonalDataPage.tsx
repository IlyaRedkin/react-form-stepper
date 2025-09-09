import { PersonalDataForm } from '../components/PersonalDataForm';
import styles from './Page.module.css';

export function PersonalDataPage() {
  return (
    <div className={styles.page}>
      <PersonalDataForm />
    </div>
  );
}
