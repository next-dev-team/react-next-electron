import { AhooksPresent } from './ahooks-present';
// import { antdIconPresent } from './antd-icons-present';
import { antdPresent } from './antd-present';
import { umiPresent } from './umi-presents';

export const autoImportPlugin = () =>
  require('unplugin-auto-import/webpack').default({
    dts: './auto-import.d.ts',
    include: [
      /\.[t]sx?$/, // .ts, .tsx,
    ],
    imports: [
      'react',
      {
        'antd/es': antdPresent,
        ahooks: AhooksPresent,
        // '@ant-design/icons': antdIconPresent,
        '@umijs/max': umiPresent,
        // 'next-dev-utils/dist': nextDevPresent,
      },
    ],
    vueTemplate: false,

    // Auto import for all module exports under directories
    // when using in file names mostly use prefixes _ and $ to avoid conflicts
    dirs: [
      // './xx/**', // all nested modules
      './src/utils/**',
      './src/hooks',
      './src/services',
      './src/constants/**',
      './src/components',
    ],
    resolvers: [],
  });
