# Electron starter

- Electron JS
- Typescript
- ReactJs / UmiJs
- Antd Design UI / Antd Pro
- Tailwind CSS

## Installation

use yarn for package manager if don't have

```bash
# install yarn if not exist
npm i -g yarn
# install package
yarn install

# Run development
yarn dev

```

### Example

```tsx
export default function HomePage() {
  const { clickElement, setValue } = useWebdriverio();

  const interactWithElements = async () => {
    await clickElement('[data-testid="my-button"]');
    await setValue('[data-testid="my-input"]', 'Hello, WebdriverIO!');
  };

  return (
    <ProCard title={'Configs'} bordered headerBordered>
      <Button onClick={interactWithElements}>Test interaction</Button>
      <button type="button" data-testid="my-button">
        Click Me
      </button>
      <input data-testid="my-input" />
    </ProCard>
  );
}
```

## Reference and Credit

<https://github.com/goosewobbler/wdio-electron-service-example> <https://medium.com/@anna972606/write-a-test-with-javascript-appium-9db2fee47712> [<https://webdriver.io/docs/wdio-electron-service/>](https://github.com/webdriverio/appium-boilerplate)

<https://github.com/dieharders/ai-text-server> <https://github.com/cba85/electron-webview> <https://github.com/hokein/electron-sample-apps>
