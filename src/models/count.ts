import type { DvaModel } from '@umijs/max';

export interface CountModelState {
  count: number;
}

export default {
  namespace: 'count',
  state: {
    count: 0,
  },
  reducers: {
    increment(state) {
      return {
        count: state.count + 1,
      };
    },
    decrement(state) {
      return {
        count: state.count - 1,
      };
    },
  },
} as DvaModel<CountModelState>;
