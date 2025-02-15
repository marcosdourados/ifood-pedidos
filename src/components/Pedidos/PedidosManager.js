import React, { useEffect, useState } from 'react';
import { ifoodService, isTokenExpired } from '../../services/ifood';

function PedidosManager() {
  const [pedidos, setPedidos] = useState([]);
  
  const pollPedidos = async () => {
    try {
      // Verifica se precisa renovar o token
      if (isTokenExpired()) {
        await ifoodService.authenticate(
          process.env.REACT_APP_IFOOD_CLIENT_ID,
          process.env.REACT_APP_IFOOD_CLIENT_SECRET
        );
      }

      // Busca novos eventos
      const events = await ifoodService.getPedidosEvents();
      
      if (events && events.length > 0) {
        // Processa os eventos
        const eventIds = events.map(event => event.id);
        
        // Busca detalhes dos pedidos
        const pedidosDetails = await Promise.all(
          events.map(event => ifoodService.getPedidoDetails(event.orderId))
        );
        
        // Atualiza a lista de pedidos
        setPedidos(prevPedidos => [...prevPedidos, ...pedidosDetails]);
        
        // Confirma o recebimento dos eventos
        await ifoodService.acknowledgeEvents(eventIds);
      }
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(pollPedidos, 30000); // Poll a cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Pedidos iFood</h2>
      {/* Renderização dos pedidos */}
    </div>
  );
}

export default PedidosManager; 