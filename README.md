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
// access to electron
const { hello } = window.$api || {};

const Page = () => {
  // access to global react state
  const { counter } = useModel('counter');

  return <Button onClick={() => hello('ElectronJS')}>Hello </Button>;
};
```

## Reference and Credit

<https://github.com/dieharders/ai-text-server>
