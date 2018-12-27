const MSG_TYPE_JOIN = 'join';
const MSG_TYPE_ASSIGNED_PLAYER_ID = 'assigned-player-id';
const MSG_TYPE_OPPONENT_FOUND = 'opponent-found';
const MSG_TYPE_RUNNER_READY = 'runner-ready';

class HubWebsocket {
  constructor({ onAssignedPlayerId, onOpponentFound, onRunnerReady }) {
    this.onAssignedPlayerId = onAssignedPlayerId;
    this.onOpponentFound = onOpponentFound;
    this.onRunnerReady = onRunnerReady;

    this.connect();
  }

  connect() {
    this.socket = new WebSocket('ws://192.168.99.100:31380/ws');

    this.socket.addEventListener('open', () => {
      console.log('Hub socket connection is open.')
    });

    this.socket.addEventListener('message', message => this.handleMessage(message.data));
  }

  disconnect() {
    if (!this.socket) return;

    try {
      this.socket.close();
      console.log('Hub socket connection has been closed.')
    } catch (err) {
      console.log('Error closing socket:', err);
    }
  }

  handleMessage(data) {
    const message = JSON.parse(data);
    console.log('Incoming message', message)

    if (message.type === MSG_TYPE_ASSIGNED_PLAYER_ID) {
      this.onAssignedPlayerId(message.data);
    }

    if (message.type === MSG_TYPE_OPPONENT_FOUND) {
      this.onOpponentFound(message.data);
    }

    if (message.type === MSG_TYPE_RUNNER_READY) {
      this.onRunnerReady(message.data);
    }
  }

  sendJoinMessage(data) {
    const message = JSON.stringify({
      type: MSG_TYPE_JOIN,
      data,
    });

    this.socket.send(message);
  }
}

export default HubWebsocket;
