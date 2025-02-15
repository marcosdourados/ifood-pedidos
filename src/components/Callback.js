import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccessToken } from '../services/auth';

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (code) {
        try {
          const tokenData = await getAccessToken(code);
          // Armazene o token no localStorage ou em um estado global
          localStorage.setItem('access_token', tokenData.access_token);
          localStorage.setItem('refresh_token', tokenData.refresh_token);
          navigate('/'); // Redireciona para a página principal
        } catch (error) {
          console.error('Erro na autenticação:', error);
          navigate('/login');
        }
      }
    };

    handleCallback();
  }, [navigate]);

  return <div>Autenticando...</div>;
}

export default Callback; 