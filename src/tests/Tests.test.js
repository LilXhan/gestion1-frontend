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

test('user can register and log in', async () => {
    axiosInstance.post.mockResolvedValueOnce({ status: 201 }); // Mock registro exitoso
    axiosInstance.post.mockResolvedValueOnce({ status: 200, data: { token: 'testtoken' } }); // Mock login exitoso

    render(
        <AuthContext.Provider value={{ toggleTheme: jest.fn(), darkMode: false }}>
            <App />
        </AuthContext.Provider>
    );

    // Simula la navegación al registro
    await userEvent.click(screen.getByText(/crear cuenta/i)); // Selecciona el link o botón de navegación
    await userEvent.type(screen.getByLabelText(/nombre de usuario/i), 'testuser');
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'password123');

    // Asegúrate de seleccionar específicamente el botón
    const createAccountButton = screen.getByRole('button', { name: /crear cuenta/i });
    await userEvent.click(createAccountButton);

    // Verifica si aparece el mensaje de éxito del registro
    await waitFor(() => {
        expect(screen.getByText(/cuenta creada con éxito/i)).toBeInTheDocument();
    });

    // Simula el inicio de sesión
    await userEvent.type(screen.getByLabelText(/nombre de usuario/i), 'testuser');
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'password123');
    const loginButton = screen.getByRole('button', { name: /iniciar sesión/i });
    await userEvent.click(loginButton);

    // Verifica si aparece el mensaje de bienvenida
    await waitFor(() => {
        expect(screen.getByText(/bienvenido/i)).toBeInTheDocument();
    });
});
