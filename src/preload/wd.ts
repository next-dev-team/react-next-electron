import type { Capabilities } from '@wdio/types';
const wd = require('webdriverio') as typeof import('webdriverio');
let driverInstance = null as unknown as WebdriverIO.Browser;

export async function startWebdriverSession(
  cap: WebdriverIO.Capabilities = {},
  opt = {} as Capabilities.WebdriverIOConfig,
) {
  if (driverInstance) return driverInstance;

  try {
    const capabilities = {
      'appium:platformName': 'Android',
      'appium:automationName': 'UiAutomator2',
      ...cap,
    } as WebdriverIO.Capabilities;

    const wdOpts = {
      // hostname: '192.168.83.1',
      // Your WebDriverIO client can now connect to this embedded server at localhost:4723
      port: 4723,
      logLevel: 'info',
      ...opt,
      capabilities,
    } as Capabilities.WebdriverIOConfig;

    if (
      !capabilities['appium:platformName'] ||
      !capabilities['appium:automationName']
    ) {
      throw new Error(
        'Missing required capabilities: platformName or automationName',
      );
    }

    driverInstance = await wd.remote(wdOpts);

    if (!driverInstance) {
      throw new Error('Failed to initialize Appium driver');
    }

    return driverInstance;
  } catch (error) {
    console.error('Error starting Appium session:', error);
    throw error; // rethrow the error after logging
  }
}

export async function stopWebdriverSession() {
  if (driverInstance) {
    await driverInstance.deleteSession();
    driverInstance = null as unknown as WebdriverIO.Browser;
    console.log('Webdriver session stopped');
  }
  return driverInstance;
}
