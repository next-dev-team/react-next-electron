module.exports = {
  version: "1.0",
  title: "app-mmo",
  description: "MMO app",
  icon: "icon.png",
  menu: async (kernel, info) => {
    let installed = info.exists("env")
    let running = {
      install: info.running("install.js"),
      start: info.running("start.js"),
      update: info.running("update.js"),
      reset: info.running("reset.js")
    }
    return [{
      default: true,
      icon: "fa-solid fa-rocket",
      text: "NEXT MMO",
      href: 'http://localhost:8000',
    }]
  }
}
