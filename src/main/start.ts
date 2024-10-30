import child_process, { exec } from 'child_process';
import killPort from 'kill-port';
import path from 'path';
import { isAvailablePromise } from 'portfinder-cp';
import kill from 'tree-kill';
const pythonShell = require('python-shell');
const waitOn = require('wait-on') as typeof import('wait-on');

let python: Record<string, any> = {};

const appPath = path.resolve(__dirname, '..', '..', '../api');

/**
 * Runs a Python script asynchronously and resolves upon successful execution.
 * Uses a child process to spawn the Python interpreter and run the script.
 *
 * @returns {Promise<void>} A promise that resolves when the Python script is successfully executed.
 */
export function runPython() {
  return new Promise<void>((resolve, reject) => {
    const appFile = path.join(appPath, 'main.py');

    python = child_process.spawn('env\\scripts\\python.exe', ['main.py'], {
      cwd: appPath,
    });

    python.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    python.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
      if (data.includes('Application startup complete.')) {
        resolve();
      } else {
        reject(new Error(`Python error: ${data}`));
      }
    });

    console.log('appFile', appFile);
  });
}

const apiPort = 8100;

export async function killPython(pid: any = apiPort) {
  // Usage with promises
  // waitOn({
  //   resources: ['tcp:8100'],
  // })
  //   .then(function () {
  //     console.log('Port 8100 is available');
  //   })
  //   .catch(function (err) {
  //     console.log('Port 8100 is not available', err);
  //   });

  // isAvailable({ port: 8100 }, (s) => {
  //   console.log('s', s);
  //   if (s) {
  //     killPort(8100);
  //   }
  // })

  if (!pid) {
    return;
  }

  return killPort(pid).catch(() => {
    kill(python?.id || pid);
  });
}

export const startApi = () => {

  console.log('API is starting...', apiPort);

  return new Promise<void>((resolve, reject) => {
    const appFile = path.join(appPath, 'dist', 'main.exe');

    isAvailablePromise({ port: apiPort }).then((apiReady) => {
      waitOn({
        resources: [`tcp:${apiPort}`],
      }).then(() => {
        console.log('API is ready');
        resolve();
      }).catch((err) => {
        console.log('API is not ready', err);
      })

      if (apiReady) {
        console.log('API is ready');

        resolve();
      } else {
        console.log('API is not ready');
        python = exec(appFile, (err, stdout, stderr) => {
          if (err) {
            console.error('Failed to start FastAPI server:', err);
            reject(err);
            return;
          }
          if (stderr) {
            console.error(`stderr: ${stderr}`);
          }
          console.log(`stdout: ${stdout}`);
          resolve();
        });
      }

    });

  });
};

export const _runPy = async ({
  cwd,
  isResolve,
  pyFile,
  executeFile,
}: {
  cwd: string;
  isResolve?: (
    data: string,
    opts: { resolve: () => void; reject: () => void },
  ) => Promise<boolean> | boolean;
  pyFile: string;
  executeFile: string;
}) => {
  return new Promise<void>((resolve, reject) => {
    pythonShell.PythonShell.run(pyFile, {
      cwd,
      pythonPath: executeFile,
      // detached: true,
      shell: 'cmd',
      encoding: 'utf8',
      env: {
        ...process.env,
        PYTHONIOENCODING: 'utf8',
      },
      parser(param) {
        console.log('parser', param);
      },
      async stderrParser(param) {
        console.log('stderrParser', param);
        const willResolve = isResolve?.(param, { resolve, reject });
        if (willResolve) {
          // await _asyncSleep(1000)
          resolve();
        }
      },
      formatter(param) {
        console.log('formatter', param);
      },
    });
  });
};
