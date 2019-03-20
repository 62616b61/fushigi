import { useState, useEffect } from 'react';

const Countdown = ({ seconds: secondsToCount, onFinish }) => {
  const [ seconds, setSeconds ] = useState(secondsToCount);
  const [ timer, setTimer ] = useState(null);

  useEffect(() => {
    if (seconds > 0) {
      setTimer(setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000));
    }

    return () => clearTimeout(timer);
  }, [seconds]);

  if (seconds === 0 && typeof(onFinish) === 'function') onFinish();

  return seconds;
};

export default Countdown;
