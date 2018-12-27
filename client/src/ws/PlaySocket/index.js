const RECONNECT_INTERVAL = 1000;

const MSG_TYPE_PLAYER_AUTH = 'player-auth';
const MSG_TYPE_OPPONENT_JOINED = 'opponent-joined';
const MSG_TYPE_OPPONENT_LEFT = 'opponent-left';
const MSG_TYPE_CHOOSE_SHAPE = 'choose-shape';
const MSG_TYPE_OPPONENT_CHOSE = 'opponent-chose';
const MSG_TYPE_RESULTS = 'results';

class PlaySocket {
  constructor({ runner, onOpen, onOpponentJoined, onOpponentLeft, onOpponentChose, onResults }) {
    this.runner = runner;

    this.onOpen = onOpen;
    this.onOpponentJoined = onOpponentJoined;
    this.onOpponentLeft = onOpponentLeft;
    this.onOpponentChose = onOpponentChose;
    this.onResults = onResults;

    this.shouldTryReconnecting = true;

    this.connect();
  }

  connect() {
    this.socket = new WebSocket(`ws://192.168.99.100:31380/runner/${this.runner}`);

    this.socket.addEventListener('open', () => {
      this.onOpen();
    });

    this.socket.addEventListener('message', message => this.handleMessage(message.data));

    this.socket.addEventListener('error', () => {
      console.log('Retrying in', RECONNECT_INTERVAL);
      if (this.shouldTryReconnecting) {
        setTimeout(() => this.connect(), RECONNECT_INTERVAL);
      }
    });
  }

  disconnect() {
    this.shouldTryReconnecting = false;

    if (!this.socket) return;

    try {
      this.socket.close();
      console.log('Runner socket connection has been closed.')
    } catch (err) {
      console.log('Error closing socket:', err);
    }
  }

  handleMessage(data) {
    const message = JSON.parse(data);
    console.log('Incoming message', message)

    if (message.type === MSG_TYPE_OPPONENT_JOINED) {
      this.onOpponentJoined();
    }

    if (message.type === MSG_TYPE_OPPONENT_LEFT) {
      this.onOpponentLeft();
    }

    if (message.type === MSG_TYPE_OPPONENT_CHOSE) {
      this.onOpponentChose();
    }

    if (message.type === MSG_TYPE_RESULTS) {
      this.onResults(message.data);
    }
  }

  sendPlayerAuthMessage(data) {
    const message = JSON.stringify({
      type: MSG_TYPE_PLAYER_AUTH,
      data,
    });

    this.socket.send(message);
  }

  sendChooseShapeMessage(data) {
    const message = JSON.stringify({
      type: MSG_TYPE_CHOOSE_SHAPE,
      data,
    });

    this.socket.send(message);
  }
}

export default PlaySocket;
