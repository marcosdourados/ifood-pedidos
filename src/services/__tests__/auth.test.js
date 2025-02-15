import { getAuthUrl, getAccessToken } from '../auth';

describe('Serviço de Autenticação', () => {
  beforeEach(() => {
    // Simula as variáveis de ambiente
    process.env.REACT_APP_CLIENT_ID = 'test-client-id';
    process.env.REACT_APP_CLIENT_SECRET = 'test-client-secret';
    process.env.REACT_APP_REDIRECT_URI = 'http://localhost:3000/callback';
  });

  test('getAuthUrl deve retornar URL correta com parâmetros', () => {
    const url = getAuthUrl();
    console.log('URL gerada:', url);

    expect(url).toContain('https://accounts.spotify.com/authorize');
    expect(url).toContain('client_id=test-client-id');
    expect(url).toContain('redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback');
    expect(url).toContain('response_type=code');
    expect(url).toContain('scope=');
  });

  test('getAccessToken deve fazer chamada POST correta', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ access_token: 'test-token' }),
      })
    );

    const code = 'test-code';
    const result = await getAccessToken(code);

    expect(fetch).toHaveBeenCalledWith(
      'https://accounts.spotify.com/api/token',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/x-www-form-urlencoded',
        }),
      })
    );

    expect(result).toHaveProperty('access_token', 'test-token');
  });
}); 