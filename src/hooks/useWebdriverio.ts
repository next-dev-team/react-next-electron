import { useCallback, useEffect, useState } from 'react';
import type { Browser } from 'webdriverio';

const { stopWebdriverSession, startWebdriverSession } = window.$api || {};

export function useWebdriverio() {
  const [driver, setDriver] = useState<Browser | null>(null);

  useEffect(() => {
    let isMounted = true;

    const startDriver = async () => {
      try {
        const wdDriver = await startWebdriverSession();
        if (isMounted) {
          setDriver(wdDriver);
        }
      } catch (error) {
        console.error('Error initializing WebDriverIO:', error);
      }
    };

    if (!driver) {
      startDriver();
    }

    return () => {
      isMounted = false;
      stopWebdriverSession();
    };
  }, []);

  const clickElement = useCallback(
    async (selector: string) => {
      if (driver) {
        try {
          const element = await driver.$(selector);
          await element.click();
        } catch (error) {
          console.error(`Error clicking element ${selector}:`, error);
        }
      }
    },
    [driver],
  );

  const setValue = useCallback(
    async (selector: string, value: string) => {
      if (driver) {
        try {
          const element = driver.$(selector);
          await element.setValue(value);
        } catch (error) {
          console.error(`Error setting value on element ${selector}:`, error);
        }
      }
    },
    [driver],
  );

  return { driver, clickElement, setValue };
}
