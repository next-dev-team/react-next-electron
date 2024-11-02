
export const getCounterApi = () => {
  return $request<unknown>('/api/counter');
};
