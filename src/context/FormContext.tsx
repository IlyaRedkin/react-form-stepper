import { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { FormData, PersonalData, AddressAndWork, LoanParameters } from '../types';

// Начальное состояние
const initialState: FormData = {
  personalData: {
    phone: '',
    firstName: '',
    lastName: '',
    gender: '',
  },
  addressAndWork: {
    workplace: '',
    address: '',
  },
  loanParameters: {
    amount: 200,
    term: 10,
  },
};

// Типы действий
type FormAction =
  | { type: 'UPDATE_PERSONAL_DATA'; payload: Partial<PersonalData> }
  | { type: 'UPDATE_ADDRESS_AND_WORK'; payload: Partial<AddressAndWork> }
  | { type: 'UPDATE_LOAN_PARAMETERS'; payload: Partial<LoanParameters> }
  | { type: 'RESET_FORM' };

// Редьюсер
function formReducer(state: FormData, action: FormAction): FormData {
  switch (action.type) {
    case 'UPDATE_PERSONAL_DATA':
      return {
        ...state,
        personalData: { ...state.personalData, ...action.payload },
      };
    case 'UPDATE_ADDRESS_AND_WORK':
      return {
        ...state,
        addressAndWork: { ...state.addressAndWork, ...action.payload },
      };
    case 'UPDATE_LOAN_PARAMETERS':
      return {
        ...state,
        loanParameters: { ...state.loanParameters, ...action.payload },
      };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
}

// Контекст
interface FormContextType {
  formData: FormData;
  updatePersonalData: (data: Partial<PersonalData>) => void;
  updateAddressAndWork: (data: Partial<AddressAndWork>) => void;
  updateLoanParameters: (data: Partial<LoanParameters>) => void;
  resetForm: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

// Провайдер
interface FormProviderProps {
  children: ReactNode;
}

export function FormProvider({ children }: FormProviderProps) {
  const [formData, dispatch] = useReducer(formReducer, initialState);

  const updatePersonalData = (data: Partial<PersonalData>) => {
    dispatch({ type: 'UPDATE_PERSONAL_DATA', payload: data });
  };

  const updateAddressAndWork = (data: Partial<AddressAndWork>) => {
    dispatch({ type: 'UPDATE_ADDRESS_AND_WORK', payload: data });
  };

  const updateLoanParameters = (data: Partial<LoanParameters>) => {
    dispatch({ type: 'UPDATE_LOAN_PARAMETERS', payload: data });
  };

  const resetForm = () => {
    dispatch({ type: 'RESET_FORM' });
  };

  const value: FormContextType = {
    formData,
    updatePersonalData,
    updateAddressAndWork,
    updateLoanParameters,
    resetForm,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

// Хук для использования контекста
export function useFormContext() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
}
