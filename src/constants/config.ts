export const _xpath = {
  gpsAppXpath: ``,
  gpsId: 'com.lexa.fakegps:id/action_start',
  startGpsXpath:
    '//android.widget.ImageButton[@resource-id="com.lexa.fakegps:id/action_start"]',
  folderSystemId: 'com.ldmnq.launcher3:id/preview_background',
  fbId: 'Facebook',
  homeXpath: `//android.view.ViewGroup[@resource-id="com.ldmnq.launcher3:id/workspace"]/android.view.ViewGroup/android.view.ViewGroup`,
} as const;

export const _wdConfigs = {
  fbPkg: 'com.facebook.katana',
  fbMainActivity: '.LoginActivity',
} as const;
