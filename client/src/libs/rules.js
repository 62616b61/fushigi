import { ROCK, PAPER, SCISSORS } from './shapes';

export const RULES = {
  [ ROCK ]: SCISSORS,
  [ PAPER ]: ROCK,
  [ SCISSORS ]: PAPER,
}
