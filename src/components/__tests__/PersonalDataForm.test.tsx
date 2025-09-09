import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { FormProvider } from '../../context/FormContext';
import { PersonalDataForm } from '../PersonalDataForm';

// Обертка для тестов
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <FormProvider>
      {children}
    </FormProvider>
  </BrowserRouter>
);

describe('PersonalDataForm', () => {
  it('должен отображать форму с полями', () => {
    render(<PersonalDataForm />, { wrapper: TestWrapper });

    expect(screen.getByText('Личные данные')).toBeInTheDocument();
    expect(screen.getByText('Пожалуйста, заполните ваши личные данные')).toBeInTheDocument();
    expect(screen.getByLabelText('Телефон *')).toBeInTheDocument();
    expect(screen.getByLabelText('Имя *')).toBeInTheDocument();
    expect(screen.getByLabelText('Фамилия *')).toBeInTheDocument();
    expect(screen.getByLabelText('Пол *')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Далее' })).toBeInTheDocument();
  });

  it('должен форматировать номер телефона', async () => {
    render(<PersonalDataForm />, { wrapper: TestWrapper });

    const phoneInput = screen.getByLabelText('Телефон *');
    
    fireEvent.change(phoneInput, { target: { value: '0123456789' } });
    
    await waitFor(() => {
      expect(phoneInput).toHaveValue('0123 456 789');
    });
  });

  it('должен показывать ошибки валидации при пустых полях', async () => {
    render(<PersonalDataForm />, { wrapper: TestWrapper });

    const submitButton = screen.getByRole('button', { name: 'Далее' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Телефон обязателен для заполнения')).toBeInTheDocument();
      expect(screen.getByText('Имя обязательно для заполнения')).toBeInTheDocument();
      expect(screen.getByText('Фамилия обязательна для заполнения')).toBeInTheDocument();
      expect(screen.getByText('Пол обязателен для выбора')).toBeInTheDocument();
    });
  });

  it('должен показывать ошибку при неверном формате телефона', async () => {
    render(<PersonalDataForm />, { wrapper: TestWrapper });

    const phoneInput = screen.getByLabelText('Телефон *');
    const submitButton = screen.getByRole('button', { name: 'Далее' });

    fireEvent.change(phoneInput, { target: { value: '123456789' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Телефон должен быть в формате 0XXX XXX XXX')).toBeInTheDocument();
    });
  });

  it('должен показывать ошибку при коротком имени', async () => {
    render(<PersonalDataForm />, { wrapper: TestWrapper });

    const firstNameInput = screen.getByLabelText('Имя *');
    const submitButton = screen.getByRole('button', { name: 'Далее' });

    fireEvent.change(firstNameInput, { target: { value: 'И' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Имя должно содержать минимум 2 символа')).toBeInTheDocument();
    });
  });

  it('должен очищать ошибки при изменении полей', async () => {
    render(<PersonalDataForm />, { wrapper: TestWrapper });

    const submitButton = screen.getByRole('button', { name: 'Далее' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Телефон обязателен для заполнения')).toBeInTheDocument();
    });

    const phoneInput = screen.getByLabelText('Телефон *');
    fireEvent.change(phoneInput, { target: { value: '0123 456 789' } });

    await waitFor(() => {
      expect(screen.queryByText('Телефон обязателен для заполнения')).not.toBeInTheDocument();
    });
  });

  it('должен иметь правильные атрибуты доступности', () => {
    render(<PersonalDataForm />, { wrapper: TestWrapper });

    const phoneInput = screen.getByLabelText('Телефон *');
    expect(phoneInput).toHaveAttribute('type', 'tel');
    expect(phoneInput).toHaveAttribute('required');
    expect(phoneInput).toHaveAttribute('aria-invalid', 'false');

    const firstNameInput = screen.getByLabelText('Имя *');
    expect(firstNameInput).toHaveAttribute('type', 'text');
    expect(firstNameInput).toHaveAttribute('required');

    const genderSelect = screen.getByLabelText('Пол *');
    expect(genderSelect).toHaveAttribute('required');
  });
});
