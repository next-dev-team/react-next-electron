import { useRequest } from '@umijs/max';
import { useCallback, useState } from 'react';

export default function useCounter() {
  const [counter, setCounter] = useState(0);
  const { data } = useRequest('/api/counter');
  const counterAsync = data?.counter || 0;

  const increment = useCallback(() => {
    setCounter((c) => c + 1)
  }, []);

  const decrement = useCallback(() => {
    setCounter((c) => c - 1)
  }, []);

  console.log('useCounter', counter);

  return { counter, increment, decrement, counterAsync };
}
