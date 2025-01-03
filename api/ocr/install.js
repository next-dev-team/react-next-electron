const APP_NAME = "";
const ENV_PATH = "env";

module.exports = ({ appName = APP_NAME, envName = ENV_PATH }) => ({
  run: [
    // Delete this step if your project does not use torch
    // {
    //   method: "script.start",
    //   params: {
    //     uri: "torch.js",
    //     params: {
    //       venv: envName,
    //       path: appName,
    //       // xformers: true   // uncomment this line if your project requires xformers
    //     },
    //   },
    // },
    {
      method: "shell.run",
      params: {
        venv: envName, // Edit this to customize the venv folder path
        path: appName,
        message: ["pip install -r requirements.txt"],
      },
    },
    {
      method: "fs.link",
      params: {
        path: appName,
      },
    },

    //  Uncomment this step to add automatic venv deduplication (Experimental)
    // {
    //   method: "fs.link",
    //   params: {
    //     venv: envName,
    //   },
    // },
    {
      method: "notify",
      params: {
        html: `Click the 'start ${APP_NAME}' tab to get started!`,
      },
    },
  ],
});
