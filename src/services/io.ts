import { cleanTitle, pinokioFs, pinokioStatus } from '@/utils';

const pinokioFsApi = pinokioFs('api', '.');

export const _pinokioGetApps = () => {
  //  get sub dirs
  const onGetSubDirs = async (apps) => {
    const promises = apps.map((app) => pinokioFsApi.readdir(app));
    const results = await Promise.all(promises);

    const appsData = results.map((app, i) => {
      const iconFile = app.find((f) => /^icon\.\w+$/.test(f));
      return {
        name: cleanTitle(apps[i]),
        title: apps[i],
        icon: iconFile ? `icon.${iconFile.split('.').pop()}` : undefined,
        sub: app,
      };
    });

    return {
      data: appsData,
    };
  };

  //  get first level
  return pinokioFsApi
    .readdir('.')
    .then(onGetSubDirs)
    .catch((err) => {
      console.error('Error in _pinokioGetApps', err);
      throw err;
    });
};

export const pinokioStatusApp = (app = []) => {
  return app.map(
    async (entity) => await pinokioStatus(`~/api/${entity.title}/start.js`),
  );
};
