import { proxy } from '@umijs/max';

const state = proxy({
  count: 0,
  inc() {
    state.count += 1;
  },
  dec() {
    state.count += 1;
  },
});

export default state;
