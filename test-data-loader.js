// 测试UnifiedCharacterLoader的脚本
const path = require('path');

// 设置当前工作目录
process.chdir('/Users/dz0400857/cursor_projects/child_name');

async function testDataLoader() {
  try {
    console.log('🔄 开始测试UnifiedCharacterLoader...');
    console.log('📁 当前工作目录:', process.cwd());
    
    // 动态导入ES模块
    const { UnifiedCharacterLoader } = await import('./src/core/plugins/data/UnifiedCharacterLoader.ts');
    
    console.log('✅ UnifiedCharacterLoader导入成功');
    
    const loader = UnifiedCharacterLoader.getInstance();
    console.log('✅ 获取实例成功');
    
    await loader.initialize();
    console.log('✅ 初始化完成');
    
    const status = loader.getSystemStatus();
    console.log('📊 系统状态:', status);
    
    const charInfo = await loader.getCharacterInfo('吴');
    console.log('🔍 "吴"字信息:', JSON.stringify(charInfo, null, 2));
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

testDataLoader();
