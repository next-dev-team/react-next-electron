import * as path from 'path';
import { IApi } from '@umijs/max';

export default (api: IApi) => {
  api.addApiMiddlewares(() => [
    {
      name: 'loggerMiddleware',
      path: path.resolve(__dirname, './loggerMiddleware.ts'),
    },
  ]);
};
