// Jest测试设置文件

// 全局测试配置
global.console = {
  ...console,
  // 在测试中静默某些console输出
  warn: jest.fn(),
  error: jest.fn(),
};
