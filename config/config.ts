import { defineConfig } from '@umijs/max';
import { autoImportPlugin } from './auto-import';

// all UMI config here
export default defineConfig({
  clickToComponent: {},
  npmClient: 'yarn',
  plugins: ['@liangskyli/umijs-plugin-electron'],
  electron: {
    routerMode: 'memory',
    externals: ['glob'],
  },
  mako: false,
  antd: {},
  access: {},
  mfsu: {
    shared: {
      react: {
        singleton: true,
      },
    },

    exclude: [],
  },
  tailwindcss: {},
  request: {},
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
  chainWebpack(config, { }) {
    // when need to import outside src
    config.module.rule('ts-in-node_modules').include.clear();
    config.plugin('unplugin-auto-import').use(autoImportPlugin());

    return config;
  },
});
