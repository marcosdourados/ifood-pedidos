import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../services/auth';

function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Se já estiver autenticado, redireciona para a página principal
    if (localStorage.getItem('access_token')) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    // Função para testar as variáveis de ambiente
    const testEnvVars = () => {
      console.log('=== Teste de Variáveis de Ambiente ===');
      console.log('IFOOD_CLIENT_ID:', process.env.REACT_APP_IFOOD_CLIENT_ID);
      console.log('IFOOD_CLIENT_SECRET:', process.env.REACT_APP_IFOOD_CLIENT_SECRET ? '[PRESENTE]' : '[AUSENTE]');
    };

    testEnvVars();
  }, []);

  useEffect(() => {
    console.log('Verificando credenciais:', {
      clientId: process.env.REACT_APP_IFOOD_CLIENT_ID,
      hasSecret: !!process.env.REACT_APP_IFOOD_CLIENT_SECRET,
      allEnv: process.env // para ver todas as variáveis de ambiente
    });
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    // Verificar se as credenciais estão presentes
    if (!process.env.REACT_APP_IFOOD_CLIENT_ID || !process.env.REACT_APP_IFOOD_CLIENT_SECRET) {
      setError('Credenciais do iFood não configuradas. Verifique o arquivo .env');
      setIsLoading(false);
      return;
    }
    
    try {
      console.log('Iniciando autenticação com:', {
        clientId: process.env.REACT_APP_IFOOD_CLIENT_ID,
        hasSecret: !!process.env.REACT_APP_IFOOD_CLIENT_SECRET
      });

      const token = await getAuthToken(
        process.env.REACT_APP_IFOOD_CLIENT_ID,
        process.env.REACT_APP_IFOOD_CLIENT_SECRET
      );
      
      localStorage.setItem('access_token', token);
      navigate('/');
    } catch (err) {
      const errorMessage = err.message || 'Erro desconhecido';
      setError(`Falha na autenticação: ${errorMessage}`);
      console.error('Erro completo de autenticação:', {
        message: err.message,
        stack: err.stack,
        error: err
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '40px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%'
      }}>
        <img 
          src="https://softwarebistro.com.br/images/logo.png" 
          alt="Software Bistrô Logo" 
          style={{
            width: '200px',
            marginBottom: '30px'
          }}
        />
        
        <h1 style={{
          color: '#ea1d2c',
          fontSize: '24px',
          marginBottom: '30px',
          fontWeight: '600'
        }}>
          Sistema de Gerenciamento de Pedidos
        </h1>

        <p style={{
          color: '#666',
          marginBottom: '30px',
          fontSize: '16px'
        }}>
          Faça login com sua conta Bistrô para continuar
        </p>

        {error && (
          <p style={{
            color: '#ea1d2c',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </p>
        )}

        <button 
          onClick={handleLogin}
          disabled={isLoading}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            cursor: isLoading ? 'wait' : 'pointer',
            backgroundColor: isLoading ? '#ccc' : '#ea1d2c',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            transition: 'all 0.3s ease',
            fontWeight: '500',
            boxShadow: '0 2px 4px rgba(234, 29, 44, 0.3)',
            opacity: isLoading ? 0.7 : 1
          }}
          onMouseOver={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = '#f52d43';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseOut={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = '#ea1d2c';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          {isLoading ? 'Autenticando...' : 'Entrar com Bistrô'}
        </button>

        <p style={{
          marginTop: '20px',
          fontSize: '14px',
          color: '#999'
        }}>
          © 2024 Software Bistrô. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}

export default Login; 