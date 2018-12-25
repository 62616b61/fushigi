const { ROCK, PAPER, SCISSORS } = require('./shapes');

const RULES = {
  [ ROCK ]: SCISSORS,
  [ PAPER ]: ROCK,
  [ SCISSORS ]: PAPER,
}

module.exports = { RULES };
