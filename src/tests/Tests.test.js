import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import Register from '../pages/Register';
import App, { AuthContext } from '../App';
import userEvent from '@testing-library/user-event';
import axiosInstance from '../utils/axiosConfig';

jest.mock('../utils/axiosConfig', () => {
    const mockAxiosInstance = {
        interceptors: {
            request: { use: jest.fn() },
            response: { use: jest.fn() },
        },
        post: jest.fn(),
        get: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
    };

    let hasStudent = false; // Controla si el estudiante ha sido registrado
    let matriculaRechazada = false; // Controla si la matrícula fue rechazada

    // Mock específico para las diferentes rutas de tu aplicación
    mockAxiosInstance.post.mockImplementation((url, data) => {
        if (url === '/api/matriculas/registro/') {
            // Registro de usuario
            return Promise.resolve({ status: 201 });
        }
        if (url === '/api/matriculas/estudiante/crear/') {
            // Registro del estudiante
            hasStudent = true; // Simula que el estudiante ha sido registrado
            return Promise.resolve({
                data: { client_secret: 'mock-client-secret' },
            });
        }
        if (url === '/api/auth/login/') {
            // Login del usuario
            return Promise.resolve({
                status: 200,
                data: { token: 'mock-token' },
            });
        }
        return Promise.reject(new Error(`Unhandled POST request to ${url}`));
    });

    mockAxiosInstance.get.mockImplementation((url) => {
        if (url === '/api/matriculas/check-student/') {
            // Verificación del estado del estudiante
            return Promise.resolve({
                data: {
                    has_student: hasStudent,
                    matricula_rechazada: matriculaRechazada,
                    payment_completed: false,
                },
            });
        }
        if (url === '/api/user/profile/') {
            // Datos del usuario para el Navbar
            return Promise.resolve({
                data: { username: 'testuser', notifications: [] },
            });
        }
        return Promise.reject(new Error(`Unhandled GET request to ${url}`));
    });

    mockAxiosInstance.get.mockImplementation((url) => {
        if (url === '/api/matriculas/check-student/') {
            return Promise.resolve({
                data: {
                    has_student: hasStudent,
                    matricula_rechazada: matriculaRechazada,
                    payment_completed: false,
                },
            });
        }
        if (url === '/api/user/profile/' || url === '/api/matriculas/perfil/') {
            return Promise.resolve({
                data: { username: 'testuser', notifications: [] },
            });
        }
        return Promise.reject(new Error(`Unhandled GET request to ${url}`));
    });

    return mockAxiosInstance;
});



// TESTS UNITARIOS

test('muestra el formulario de registro', () => {
    render(
        <AuthContext.Provider value={{ toggleTheme: jest.fn(), darkMode: false }}>
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        </AuthContext.Provider>
    );

    // Selecciona el botón de 'Crear Cuenta' de forma específica
    const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
    expect(submitButton).toBeInTheDocument();

    // Selecciona el encabezado
    const header = screen.getByRole('heading', { name: /crear cuenta/i });
    expect(header).toBeInTheDocument();

    // Verifica los campos
    expect(screen.getByLabelText(/nombre de usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
});


test('actualizacion de los inputs correctamente del formulario de registro', async () => {
    render(
        <AuthContext.Provider value={{ toggleTheme: jest.fn(), darkMode: false }}>
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        </AuthContext.Provider>
    );

    const usernameInput = screen.getByLabelText(/nombre de usuario/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);

    await userEvent.type(usernameInput, 'testuser');
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');

    expect(usernameInput).toHaveValue('testuser');
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
});

// TESTS DE INTEGRACION


test('submits registration form successfully', async () => {
    axiosInstance.post.mockResolvedValueOnce({ status: 201 });

    render(
        <AuthContext.Provider value={{ toggleTheme: jest.fn(), darkMode: false }}>
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        </AuthContext.Provider>
    );

    const usernameInput = screen.getByLabelText(/nombre de usuario/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /crear cuenta/i });

    await userEvent.type(usernameInput, 'testuser');
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');

    await userEvent.click(submitButton);

    // Simula el FormData esperado en la solicitud
    const formData = new FormData();
    formData.append('username', 'testuser');
    formData.append('email', 'test@example.com');
    formData.append('password', 'password123');

    expect(axiosInstance.post).toHaveBeenCalledWith('/api/matriculas/registro/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
});

test('muestra un mensaje de error en caso de fallo en el registro', async () => {
    axiosInstance.post.mockRejectedValueOnce(new Error('Error en registro'));

    render(
        <AuthContext.Provider value={{ toggleTheme: jest.fn(), darkMode: false }}>
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        </AuthContext.Provider>
    );

    const usernameInput = screen.getByLabelText(/nombre de usuario/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /crear cuenta/i });

    await userEvent.type(usernameInput, 'testuser');
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');

    await userEvent.click(submitButton);

    expect(await screen.findByText(/error en registro/i)).toBeInTheDocument();
});

// TESTS DE SISTEMA 

test('user can register, log in, and access the MatriculaForm page', async () => {
    axiosInstance.post.mockResolvedValueOnce({ status: 201 }); // Registro
    axiosInstance.post.mockResolvedValueOnce({ status: 200, data: { token: 'testtoken' } }); // Login
    axiosInstance.get.mockResolvedValueOnce({ // Check student status
        data: { has_student: false, matricula_rechazada: false, payment_completed: false },
    });
    axiosInstance.post.mockResolvedValueOnce({ // Crear estudiante
        data: { client_secret: 'mock-client-secret' },
    });

    render(
        <AuthContext.Provider value={{ toggleTheme: jest.fn(), darkMode: false }}>
            <App />
        </AuthContext.Provider>
    );

    // Registro de usuario
    await userEvent.click(screen.getByText(/crear cuenta/i));
    await userEvent.type(screen.getByLabelText(/nombre de usuario/i), 'testuser');
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));

    await waitFor(() => {
        expect(screen.getByText(/cuenta creada con éxito/i)).toBeInTheDocument();
    });

    // Inicio de sesión
    await userEvent.type(screen.getByLabelText(/nombre de usuario/i), 'testuser');
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    // Formulario de matrícula
    await waitFor(() => {
        expect(screen.getByText(/formulario de matrícula/i)).toBeInTheDocument();
    });

    await userEvent.type(screen.getByLabelText(/nombre completo/i), 'Estudiante Test');
    await userEvent.type(screen.getByLabelText(/dni/i), '12345678');
    await userEvent.type(screen.getByLabelText(/fecha de nacimiento/i), '2000-01-01');
    await userEvent.type(screen.getByLabelText(/grado/i), 'Primaria');
    await userEvent.type(screen.getByLabelText(/dirección/i), 'Av. Prueba 123');
    await userEvent.click(screen.getByRole('button', { name: /registrar estudiante/i }));

    // Verificar que se muestre el paso de pago
    await waitFor(() => {
        expect(screen.getByTestId('payment-step')).toBeInTheDocument();
    });
});