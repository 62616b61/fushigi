const {
  RUNNER_ID,
  PLAYER_ONE_ID,
  PLAYER_TWO_ID,
  RUNTIME,
} = process.env;

const runsInKubernetes = RUNTIME === 'kubernetes';

module.exports = {
  RUNNER_ID,
  PLAYER_ONE_ID: PLAYER_ONE_ID ? PLAYER_ONE_ID : 'player-ONE-id-placeholder',
  PLAYER_TWO_ID: PLAYER_TWO_ID ? PLAYER_TWO_ID : 'player-TWO-id-placeholder',
  runsInKubernetes,
}
