export const ws = new WebSocket('ws://192.168.99.100:31380/ws');
 
ws.onopen = () => {
  ws.send('something');
};
 
ws.onmessage = data => {
  console.log(data);
};
