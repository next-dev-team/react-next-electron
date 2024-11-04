import type { AppiumServer } from 'appium/build/lib/appium';

const appium = require('appium') as typeof import('appium');

let appiumInstance = null as unknown as AppiumServer;

export async function startAppiumServer() {
  try {
    appiumInstance = await appium.main({
      port: 4723,
      loglevel: 'info',
      address: '127.0.0.1',
      allowCors: true,
    });
    console.log('Appium server started on port 4723');
    return appiumInstance;
  } catch (error) {
    console.error('Error starting Appium server:', error);
  }
}

export async function stopAppiumServer() {
  if (appiumInstance) {
    await appiumInstance.close();
    console.log('Appium server stopped');
    appiumInstance = null as unknown as AppiumServer;
  }
}
