import { defineConfig } from '@umijs/max';
import pkg from '../package.json';

const allDeps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });

const external = [
  'glob',
  'kill-Port',
  'python-shell',
  'wait-on',
  'portfinder-cp',
  'pinokiod',
  'electron-store',
  'electron-window-state',
];

const externalDeps = external.filter((i) => allDeps.includes(i));

console.log('externalDeps', externalDeps);

// all UMI config here
export default defineConfig({
  clickToComponent: {},
  npmClient: 'yarn',
  plugins: ['@liangskyli/umijs-plugin-electron'],
  electron: {
    routerMode: 'memory',
    externals: externalDeps,
    outputDir: 'build',
    builderOptions: {
      // directories: {
      //   buildResources: 'resources',
      //   output: 'release',
      // },
      // files: [
      //   'api/',
      // ],
      extraResources: [
        // {
        //   from: 'api/',
        //   to: 'resources/api',
        // },
      ],
    },
  },
  mako: {},
  fastRefresh: true,
  mfsu: false,
  antd: {},
  access: {},
  tailwindcss: {},
  request: {
    dataField: 'data',
  },
  locale: {
    title: true,
  },
  valtio: {},
  initialState: {},
  mock: {},
  model: {},
});
