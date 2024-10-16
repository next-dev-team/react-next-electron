import { getCounterApi } from '@/services';
import type { DvaModel } from '@umijs/max';

export interface CountModelState {
  count: number;
}

export default {
  namespace: 'count',
  state: {
    count: 0,
    counterAsync: 0,
  },
  reducers: {
    increment(state) {
      return {
        ...state,
        count: state.count + 1,
      };
    },
    decrement(state) {
      return {
        ...state,
        count: state.count - 1,
      };
    },
    setAsyncCount(state, { payload }) {
      return {
        ...state,
        counterAsync: payload
      }
    }
  },
  effects: {
    *getAsyncCounter(_, { call, put }) {
      const { data } = yield call(getCounterApi);
      yield put({
        type: 'setAsyncCount',
        payload: data?.counter || 1,
      })
    }
  },
  subscriptions: {
    setup(opts: any) {
      console.log('dva model setup', opts);
    },
  },
} as DvaModel<CountModelState>;
