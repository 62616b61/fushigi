import { UNKNOWN } from './shapes';

export const STATUS_DISCONNECTED = 1;
export const STATUS_CONNECTED = 2;
export const STATUS_PLAYING = 3;
export const STATUS_CHOSE_SHAPE = 4;

export class Player {
  constructor({ id, score, shape, status, lost }) {
    console.log('SHAPE', shape)
    this.id = id;
    this.score = score ? score : 0;
    this.shape = shape ? shape : UNKNOWN;
    this.status = status;
    this.lost = lost;
  }
}
