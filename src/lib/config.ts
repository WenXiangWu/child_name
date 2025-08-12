/**
 * 应用配置管理
 * 统一管理所有环境变量和配置项
 */

export interface AppConfig {
  baseUrl: string;
  apiUrl: string;
  staticUrl: string;
  env: 'development' | 'production' | 'test';
  port: number;
}

/**
 * 获取基础URL
 * 优先级：环境变量 > 运行时检测 > 默认值
 */
function getBaseUrl(): string {
  // 优先使用环境变量
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // 客户端运行时检测
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // 服务端默认值
  const port = process.env.PORT || '3000';
  return `http://localhost:${port}`;
}

/**
 * 获取应用配置
 */
export function getAppConfig(): AppConfig {
  const baseUrl = getBaseUrl();
  const env = (process.env.NODE_ENV || 'development') as AppConfig['env'];
  const port = parseInt(process.env.PORT || '3000');

  return {
    baseUrl,
    apiUrl: `${baseUrl}/api`,
    staticUrl: `${baseUrl}/data`,
    env,
    port
  };
}

/**
 * 构建静态资源URL
 */
export function getStaticUrl(path: string): string {
  const config = getAppConfig();
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${config.staticUrl}/${cleanPath}`;
}

/**
 * 构建API URL
 */
export function getApiUrl(path: string): string {
  const config = getAppConfig();
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${config.apiUrl}/${cleanPath}`;
}

/**
 * 检查是否为开发环境
 */
export function isDevelopment(): boolean {
  return getAppConfig().env === 'development';
}

/**
 * 检查是否为生产环境
 */
export function isProduction(): boolean {
  return getAppConfig().env === 'production';
}

/**
 * 获取环境特定的配置
 */
export function getEnvConfig() {
  const config = getAppConfig();
  
  return {
    ...config,
    // 开发环境特定配置
    debug: isDevelopment(),
    // API超时配置
    apiTimeout: isDevelopment() ? 30000 : 10000,
    // 缓存配置
    enableCache: !isDevelopment(),
    // 日志级别
    logLevel: isDevelopment() ? 'debug' : 'warn'
  };
}