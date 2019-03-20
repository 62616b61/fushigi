import { useState, useEffect } from 'react';

const { NODE_ENV, REACT_APP_MINIKUBE_IP } = process.env;

export default function useSocket({ name, wsUrl, handlers }) {
  const [ socket, setSocket ] = useState(null);
  const [ isConnected, setIsConnected ] = useState(false);
  const [ connectionErrors, setConnectionErrors ] = useState(0);

  const serverUrl = NODE_ENV === 'development' ? `${REACT_APP_MINIKUBE_IP}:31380` : window.location.host;
  const socketUrl = `ws://${serverUrl}/${wsUrl}`;

  useEffect(() => {
    if (!isConnected) {
      const socket = new WebSocket(socketUrl);

      socket.onopen = () => {
        console.log(`${name} socket connection is open.`);

        setIsConnected(true);
      };

      socket.onclose = () => {
        console.log(`${name} socket connection is closed.`);

        setIsConnected(false);
      };

      socket.onerror = (error) => {
        console.log(`Retrying ${name} socket connection in 2s`);

        setIsConnected(false);
        setTimeout(() => setConnectionErrors(connectionErrors + 1), 2000);
      };

      socket.onmessage = (message) => {
        const { data } = message;
        const parsedData = JSON.parse(data);

        const handler = handlers[parsedData.type];

        handler(parsedData.data);
      };

      setSocket(socket);

      return () => socket.close();
    }
  }, [connectionErrors]);

  return [isConnected, socket];
}
