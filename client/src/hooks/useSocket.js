import { useState, useEffect } from 'react';

const { NODE_ENV, REACT_APP_MINIKUBE_IP } = process.env;

export default function useSocket({ name, wsUrl, handlers }) {
  const [ socket, setSocket ] = useState(null);
  const [ isConnected, setIsConnected ] = useState(false);
  const [ connectionErrors, setConnectionErrors ] = useState(0);

  const serverUrl = NODE_ENV === 'development' ? `${REACT_APP_MINIKUBE_IP}:31380` : window.location.host;
  const socketUrl = `ws://${serverUrl}/${wsUrl}`;

  const openHandler = () => {
    console.log(`${name} socket connection is open.`);

    setIsConnected(true);
  };

  const closeHandler = () => {
    console.log(`${name} socket connection is closed.`);

    setIsConnected(false);
  };

  const errorHandler = () => {
    console.log(`Retrying ${name} socket connection in 2s`);

    setIsConnected(false);
    setTimeout(() => setConnectionErrors(connectionErrors + 1), 2000);
  };

  useEffect(() => {
    if (!isConnected) {
      const socket = new WebSocket(socketUrl);

      socket.addEventListener('open', openHandler);
      socket.addEventListener('close', closeHandler);
      socket.addEventListener('error', errorHandler);

      socket.onmessage = (message) => {
        const { data } = message;
        const parsedData = JSON.parse(data);

        const handler = handlers[parsedData.type];

        handler({
          socket,
          data: parsedData.data,
        });
      };

      setSocket(socket);

      return () => {
        socket.close();
        socket.removeEventListener('open', openHandler);
        socket.removeEventListener('close', closeHandler);
        socket.removeEventListener('error', errorHandler);
      };
    }
  }, [connectionErrors]);

  return [isConnected, socket];
}
