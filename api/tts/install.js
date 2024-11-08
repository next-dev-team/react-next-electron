const APP_NAME = "";
const ENV_PATH = "env";

module.exports = {
  run: [

    {
      method: "shell.run",
      params: {
        venv: ENV_PATH, // Edit this to customize the venv folder path
        path: APP_NAME,
        message: ["pip install devicetorch", "pip install -r requirements.txt"],
      },
    },
    {
      method: "fs.link",
      params: {
        path: APP_NAME,
      },
    },

    //  Uncomment this step to add automatic venv deduplication (Experimental)
    {
      method: "fs.link",
      params: {
        venv: ENV_PATH,
      },
    },
    {
      method: "notify",
      params: {
        html: `Click the 'start ${APP_NAME}' tab to get started!`,
      },
    },
  ],
};
