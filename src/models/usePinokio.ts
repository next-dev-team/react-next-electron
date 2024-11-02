export default function usePinokio() {
  const apiApps = useRequest(_pinokioGetApps);

  return { ...apiApps };
}
