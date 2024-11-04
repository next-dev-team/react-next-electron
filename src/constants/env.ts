// UMI_ENV are set in packages.json and config/..
/**
 * App dev local
 */
export const isAppEnvDev = UMI_ENV === 'dev';
export const isAppEnvProd = UMI_ENV === 'prod' || !UMI_ENV;
/**
 * NODE_ENV development
 */
export const isNodeEnvDev = process.env.NODE_ENV === 'development';
/**
 * NODE_ENV productions
 */
export const isNodeEnvProd = process.env.NODE_ENV === 'productions';
