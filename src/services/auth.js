const AUTH_ENDPOINT = 'http://localhost:3001/api/auth';

// O iFood usa client_credentials, então não precisamos de SCOPES nem redirect_uri
export const getAuthToken = async (clientId, clientSecret) => {
  try {
    const response = await fetch(AUTH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clientId, clientSecret })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resposta da API:', data);
      throw new Error(data.message || 'Erro na autenticação');
    }

    console.log('Resposta bem-sucedida:', {
      status: response.status,
      statusText: response.statusText
    });

    return data.access_token;
  } catch (error) {
    console.error('Erro detalhado:', error);
    throw error;
  }
}; 