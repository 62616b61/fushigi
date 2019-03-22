import { useState, useEffect } from 'react';


export default function useSocket({ name, url, handlers }) {
  const [ socket, setSocket ] = useState(null);
  const [ isConnected, setIsConnected ] = useState(false);
  const [ connectionErrors, setConnectionErrors ] = useState(0);

  useEffect(() => {
    try {
      if (!isConnected) {
          const socket = new WebSocket(url);

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

          const messageHandler = (message) => {
            const { data } = message;
            const parsedData = JSON.parse(data);

            const handler = handlers[parsedData.type];

            handler({
              socket,
              data: parsedData.data,
            });
          };

          socket.addEventListener('open', openHandler);
          socket.addEventListener('close', closeHandler);
          socket.addEventListener('error', errorHandler);
          socket.addEventListener('message', messageHandler);

          setSocket(socket);

          return () => {
            socket.close();
            socket.removeEventListener('open', openHandler);
            socket.removeEventListener('close', closeHandler);
            socket.removeEventListener('error', errorHandler);
            socket.removeEventListener('message', messageHandler);
          };
      }
    } catch(e) {
      console.error('Most probably provided REACT_APP_SERVER_URL is invalid.\nEither minikube is stopeed or something unexpected happened.');
      console.error(e);
    }
  }, [connectionErrors]);

  return [isConnected, socket];
}
