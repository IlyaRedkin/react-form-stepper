import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FormProvider } from './context/FormContext';
import { PersonalDataPage } from './pages/PersonalDataPage';
import { AddressWorkPage } from './pages/AddressWorkPage';
import { LoanParametersPage } from './pages/LoanParametersPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import './App.css';

function App() {
  return (
    <FormProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<PersonalDataPage />} />
            <Route path="/address-work" element={<AddressWorkPage />} />
            <Route path="/loan-parameters" element={<LoanParametersPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </FormProvider>
  );
}

export default App;