// Типы для данных форм
export interface PersonalData {
  phone: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | '';
}

export interface AddressAndWork {
  workplace: string;
  address: string;
}

export interface LoanParameters {
  amount: number;
  term: number;
}

export interface FormData {
  personalData: PersonalData;
  addressAndWork: AddressAndWork;
  loanParameters: LoanParameters;
}

// Типы для валидации
export interface ValidationErrors {
  [key: string]: string;
}
