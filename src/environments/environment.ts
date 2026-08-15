export const environment = {
  production: false,
  // URL do backend (proxy) responsável por assinar as requisições SP-API (SigV4 + LWA token).
  // O browser NUNCA deve chamar a Amazon SP-API diretamente (credenciais/segredos ficam no backend).
  apiUrl: 'http://localhost:3000/api',
  marketplaceId: 'ATVPDKIKX0DER',
  // Mantém o app usando o backend real para a tela de monitoramento.
  useMock: false
};
