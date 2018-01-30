import { ICounter } from 'models/counter';
import { IStars } from 'models/stars';
import { IPeople } from 'models/people';

export interface IStore {
  counter: ICounter;
  stars: IStars;
  people: IPeople;
};
