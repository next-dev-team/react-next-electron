import { getCounterApi } from '@/services';
import { proxy } from '@umijs/max';

const s = proxy({
  count: 0,
  loading: false,
  counterAsync: 0,
  inc() {
    s.count += 1;
  },
  dec() {
    s.count += 1;
  },

  // async
  async getAsyncCounter() {
    return getCounterApi().then((res) => {
      s.counterAsync = res?.data?.counter || 1;
    })
  },
});


export const counterStore = s
