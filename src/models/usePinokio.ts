import { _pinokioGetApps } from '@/services';
import { useRequest } from '@umijs/max';

export default function usePinokio() {
  const apiApps = useRequest(_pinokioGetApps);

  return { ...apiApps };
}
