/* eslint-disable @typescript-eslint/ban-types */

// @ts-nocheck

/* eslint-disable @typescript-eslint/no-use-before-define */

/**
 * @description
 * Scan and extract translate keys from phases
 * - Sync to server
 * - Ignore local phrases
 * - Filter out unnecessary keys
 */

const { promises: fs } = require('fs');
const glob = require('glob');
const path = require('path');

const argsOption = {
  '-a': [
    'Dynamic template',
    'scan all will include dynamic params or server translate',
  ],
  '-f': ['Overwrite with untranslated ', 'force overwrite file'],
  '-u': [
    'Untranslated',
    'untranslated phrases will ignore, dynamic translate, server translate, lasted saved file and ignore file',
  ],
};

type Options = Partial<{
  isForceOverwrite: boolean;
  i18nUrl: string;
  exts?: string[];
  isScanAll: boolean;
  cb: (value, error: unknown) => void;
}>;

const dfScanPath = path.resolve(__dirname, '../../src');

const i18nSync = async (scanPath = dfScanPath, options: Options = {}) => {
  if (!scanPath) throw new Error('Scan path is required!');
  const {
    isForceOverwrite = false,
    isScanAll = false,
    i18nUrl = '',
    cb,
  } = options;
  // CONFIGS
  const exts = '**/*.{ts,tsx}';
  const fullAppPath = path.resolve(scanPath, exts);

  const appPath = path.resolve(__dirname, scanPath);
  const rootDir = path.parse(appPath);
  const rootApp = path.resolve(rootDir.dir);
  console.log('appPath', appPath);

  const getLabel = () => {
    if (isForceOverwrite) return '-f';
    if (isScanAll) return '-a';
    return '-u';
  };

  const optionLabel = argsOption[getLabel()];

  const scanTranslateFile = async () => {
    const pattern = fullAppPath.replace(/(\.d\.ts)$/, '');
    const files = glob
      .sync(pattern)
      .filter((file: string) => !file.endsWith('.d.ts'));

    logger.info('Files', files);

    let filterKeys: any[] = [];

    const result = await files.reduce(async (accP: any, file: any) => {
      const acc = await accP;
      const content = await fs.readFile(file, 'utf8');

      const regexAll = isScanAll
        ? /(?<!\w)translate\([^)]*\)/g
        : /translate\(['`](.*?)['`]\)/g;

      const keyRegxAll = isScanAll
        ? /translate\(([^)]*)\)/
        : /translate\(([^)]*)\)/;

      const matches = [...content.matchAll(regexAll)];
      const keys = matches.map((match) => match[0].match(keyRegxAll)?.[1]);

      const obj = keys.reduce((acc2, cur) => {
        if (
          (cur && cur.startsWith('../')) ||
          (cur && cur.startsWith('//')) ||
          (cur && cur.includes('${'))
        ) {
          filterKeys.push(cur);
          return acc2;
        }

        let extractedText = cur;
        // dynamic translate pattern
        let index = cur.indexOf("', {");

        if (index !== -1) {
          extractedText = cur.substring(0, index);
        }

        // handle "Enter {0}-digits OTP code, [numDigit]"
        extractedText = extractedText.replace(/,\s*\[\w+\]/g, '');
        let cleanAcc = extractedText.trim().replace(/['"]/g, '');
        if (cleanAcc.endsWith(',')) {
          cleanAcc = cleanAcc.replace(/,$/, '');
        }
        acc2[cleanAcc] = cleanAcc;
        return acc2;
      }, {});

      return { ...acc, ...obj };
    }, Promise.resolve({}));

    logger.warn('Filter/Skip Key', filterKeys);

    return result;
  };

  const saveScanedFile = async (
    serverPhrashes: {},
    scanedResult: { [x: string]: any },
  ) => {
    const patternJson = path.resolve(__dirname, './**/*-locale.json');

    const prevPhrasesFile = glob
      .sync(patternJson)
      .filter((file: string) => file.endsWith('-locale.json'));

    const nextFilesPhrases = Array.isArray(prevPhrasesFile)
      ? prevPhrasesFile.filter((file) => !file.includes('ingore-locale.json'))
      : [];

    const lastPrevFile = Array.isArray(nextFilesPhrases)
      ? nextFilesPhrases[nextFilesPhrases.length - 1]
      : [];

    logger.info('Last Prev File', lastPrevFile);

    const lastPrevContent = lastPrevFile
      ? await fs.readFile(lastPrevFile, 'utf8')
      : '{}';

    const ingoreFile = [...prevPhrasesFile].find((phrases) =>
      phrases.includes('ingore-locale.json'),
    );

    const ignoreWordList = await fs
      .readFile(ingoreFile, 'utf8')
      .then((res: string) => JSON.parse(res))
      .catch(() => {});

    const ingoreKey = Object.keys(ignoreWordList || {});

    logger.warn(
      'ignore Word List',
      'Total:',
      ingoreKey.length,
      'worlds',
      ingoreFile,
    );

    const untranslated = Object.keys(scanedResult).reduce((acc, cur) => {
      const nextCur = cur.toLocaleLowerCase();

      const nextServerePhrashes = Object.keys(serverPhrashes).find(
        (phrases) => phrases.toLocaleLowerCase() === nextCur,
      );

      const nextPrev = Object.keys(JSON.parse(lastPrevContent || '{}')).find(
        (phrases) => phrases.toLocaleLowerCase() === nextCur,
      );

      const nextIngore = ingoreKey
        .map((word) => word.toLocaleLowerCase())
        .includes(nextCur);

      const skipPrev = !nextPrev || isForceOverwrite;
      if (!nextServerePhrashes && skipPrev && !nextIngore) {
        acc[cur] = scanedResult[cur];
      }
      return acc;
    }, {});

    const sortedUntranslated = Object.keys(untranslated)
      .sort((a, b) => {
        const aHasDollar = a.includes('{');
        const bHasDollar = b.includes('{');
        if (aHasDollar && !bHasDollar) return -1;
        if (!aHasDollar && bHasDollar) return 1;
        return a.localeCompare(b);
      })
      .reduce((obj, key) => {
        obj[key] = untranslated[key];
        return obj;
      }, {});

    const merged = JSON.stringify(sortedUntranslated, null, 2);

    if (Object.keys(sortedUntranslated).length === 0) {
      throw new Error(
        isForceOverwrite
          ? 'FILE OVERWRITED NO NEW WORD FOUND'
          : 'NO NEW WORD FOUND IT THE SAME PREVIOUS FILE, try -f',
      );
    }

    const now = new Date();

    const nowStr = `${String(now.getDate()).padStart(2, '0')}-${String(
      now.getMonth() + 1,
    ).padStart(2, '0')}-${now.getFullYear()}`;

    const timestampStr = now
      .toLocaleTimeString(undefined, { hour12: false })
      .replace(/:/g, '-');

    const filenameOutput =
      rootApp + `/${`${nowStr}-${timestampStr}-web-locale.json`}`;

    const outputPath =
      isForceOverwrite && lastPrevFile ? lastPrevFile : filenameOutput;

    fs.writeFile(outputPath, merged, 'utf8').then(() => {
      logger.success('Saved to', outputPath);
    });
    cb?.(outputPath);
  };

  // ===================== HELPER =====================

  const fetchServerPhrases = async () => {
    const response = await fetch(i18nUrl)
      .then((res) => res.json())
      .then((res) => res)
      .catch((err) => {
        const serverMessage = err?.message || 'Skip Server Phrases';
        logger.warn('Server Phrases', serverMessage);
        return {};
      });
    return response;
  };

  const colors = {
    black: '0;30',
    darkGray: '1;30',
    red: '0;31',
    lightRed: '1;31',
    green: '0;32',
    lightGreen: '1;32',
    orange: '0;33',
    yellow: '1;33',
    blue: '0;34',
    lightBlue: '1;34',
    purple: '0;35',
    lightPurple: '1;35',
    cyan: '0;36',
    lightCyan: '1;36',
    lightGray: '0;37',
    white: '1;37',
    reset: '0m',
  };

  const getColor = (color: string) => {
    return `\x1b[${colors[color]}m`;
  };

  const log = (
    level: string | number,
    message: string,
    ...optionalParams: any[]
  ) => {
    const levels = {
      error: getColor('red') + 'ERROR:' + getColor('reset'),
      info: getColor('blue') + 'INFO:' + getColor('reset'),
      warn: getColor('yellow') + 'WARN:' + getColor('reset'),
      success: getColor('green') + 'SUCCESS:' + getColor('reset'),
    };

    const colorPrefix = levels[level]
      ? levels[level].slice(0, -1)
      : getColor('white');

    const logPrefix = `${colorPrefix}["=========== ${message?.toUpperCase()} ==========="]: `;
    console.log(logPrefix, ...optionalParams);
  };

  const logger = {
    error: log.bind(null, 'error'),
    info: log.bind(null, 'info'),
    warn: log.bind(null, 'warn'),
    success: log.bind(null, 'success'),
  };

  //   START SCAN

  logger.info('START SCAN');
  logger.warn('OPTIONS', optionLabel);

  fetchServerPhrases().then((serverPhrashes) => {
    // start scan and write to file
    scanTranslateFile()
      .then(saveScanedFile.bind(null, serverPhrashes))
      .catch((error) => {
        logger.error('Save ERROR', error?.message);
        cb?.(undefined, error);
      });
  });
};

export default i18nSync;
