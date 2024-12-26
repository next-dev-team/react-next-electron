import { request } from '@umijs/max';

export const getCounterApi = () => {
  return request<unknown>('/api/counter');
};
