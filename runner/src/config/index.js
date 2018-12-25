const {
  PLAYER_ONE_ID,
  PLAYER_TWO_ID,
} = process.env;

module.exports = {
  PLAYER_ONE_ID: PLAYER_ONE_ID ? PLAYER_ONE_ID : 'player-ONE-id-placeholder',
  PLAYER_TWO_ID: PLAYER_TWO_ID ? PLAYER_TWO_ID : 'player-TWO-id-placeholder',
}
