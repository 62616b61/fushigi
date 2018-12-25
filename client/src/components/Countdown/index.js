import React from 'react';

class Countdown extends React.Component {
  constructor(props) {
    super(props);

    const { seconds, onFinish } = props;

    this.countdownInterval = null;
    this.state = {
      seconds: seconds > 0 ? seconds : null,
    }
  }

  componentDidMount() {
    const { onFinish } = this.props;

    if (this.state.seconds) {
      this.countdownInterval = setInterval(() => {
        this.setState({ seconds: this.state.seconds - 1 });

        if (this.state.seconds === 0) {
          clearInterval(this.countdownInterval);

          if (typeof(onFinish) === 'function') onFinish();
        }
      }, 1000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.countdownInterval);
  }

  render() {
    return String(this.state.seconds);
  }
}

export default Countdown;
