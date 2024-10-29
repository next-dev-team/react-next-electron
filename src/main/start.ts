import child_process from 'child_process';
import path from 'path';
const pythonShell = require('python-shell');

let python: any;

/**
 * Runs a Python script asynchronously and resolves upon successful execution.
 * Uses a child process to spawn the Python interpreter and run the script.
 *
 * @returns {Promise<void>} A promise that resolves when the Python script is successfully executed.
 */
export function runPython() {
  return new Promise<void>((resolve, reject) => {
    const appPath = path.resolve(__dirname, '..', '..', '../api');
    const appFile = path.join(appPath, 'main.py');

    python = child_process.spawn('env\\scripts\\python.exe', ['main.py'], {
      cwd: appPath,
    });

    python.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
      // reject();
    });

    python.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
      if (data.includes('Application startup complete.')) {
        resolve();
      }
    });

    console.log('appFile', appFile);
  });
}

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

export function killPython() {
  const kill = require('tree-kill');
  kill(python.pid);
}
