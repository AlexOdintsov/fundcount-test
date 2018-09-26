import { History } from 'history';
import { CalcStore } from './CalcStore';
import { STORE_CALC } from 'app/constants';

export function createStores(history: History) {
  const calcStore = new CalcStore();
  return {
    [STORE_CALC]: calcStore
  };
}
