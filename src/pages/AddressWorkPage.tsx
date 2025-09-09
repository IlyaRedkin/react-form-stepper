import { AddressWorkForm } from '../components/AddressWorkForm';
import styles from './Page.module.css';

export function AddressWorkPage() {
  return (
    <div className={styles.page}>
      <AddressWorkForm />
    </div>
  );
}
