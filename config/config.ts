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
  mfsu: false,
  antd: {},
  access: {},
  // mfsu: {
  //   shared: {
  //     react: {
  //       singleton: true,
  //     },
  //   },

  //   exclude: [],
  // },
  tailwindcss: {},
  request: {
    dataField: 'data',
  },
  locale: {
    title: true,
  },
  // dva: {
  //   immer: {},
  // },
  valtio: {},
  initialState: {},
  mock: {},
  model: {},
  // chainWebpack(config, {}) {
  //   // when need to import outside src
  //   config.module.rule('ts-in-node_modules').include.clear();
  //   config.plugin('unplugin-auto-import').use(autoImportPlugin());

  //   return config;
  // },
});
