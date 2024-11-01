/* eslint-disable @typescript-eslint/consistent-type-imports */
export { };

declare global {
  interface Window {
    $api: import('./src/preload/index').$Api;
  }
}
