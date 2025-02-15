import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';

// Mock do useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('Componente Login', () => {
  beforeEach(() => {
    // Limpa o localStorage antes de cada teste
    localStorage.clear();
    
    // Mock das variáveis de ambiente
    process.env.REACT_APP_CLIENT_ID = 'test-client-id';
    process.env.REACT_APP_REDIRECT_URI = 'http://localhost:3000/callback';
  });

  test('deve renderizar corretamente', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByText('Sistema de Gerenciamento de Pedidos')).toBeInTheDocument();
    expect(screen.getByText('Entrar com Bistrô')).toBeInTheDocument();
  });

  test('deve redirecionar quando clicar no botão de login', () => {
    // Mock da função window.location.href
    const originalLocation = window.location;
    delete window.location;
    window.location = { href: jest.fn() };

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const loginButton = screen.getByText('Entrar com Bistrô');
    fireEvent.click(loginButton);

    expect(window.location.href).toHaveBeenCalledWith(expect.stringContaining('accounts.spotify.com/authorize'));

    // Restaura window.location
    window.location = originalLocation;
  });
}); 