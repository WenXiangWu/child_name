/**
 * 插件化取名系统演示
 */

import { 
  NamingPipelineIntegrated,
  NamingRequest,
  NamingResponse
} from '../core/plugins/core/NamingPipelineIntegrated';
import { CertaintyLevel } from '../core/plugins/interfaces/NamingPlugin';

async function demonstrateNamingSystem() {
  console.log('🚀 启动插件化取名系统演示\n');

  // 创建取名系统实例
  const namingSystem = new NamingPipelineIntegrated({
    version: '1.0.0-demo',
    enableHealthChecks: false,
    autoLevelSelection: true
  });

  try {
    // 初始化系统
    console.log('⏳ 初始化取名系统...');
    await namingSystem.initialize();
    console.log('✅ 系统初始化完成\n');

    // 展示可用的确定性等级
    console.log('📊 可用的确定性等级:');
    const levels = namingSystem.getAvailableCertaintyLevels();
    levels.forEach((level, index) => {
      console.log(`  ${index + 1}. ${level.description}`);
      console.log(`     启用插件数: ${level.enabledPlugins}`);
      console.log(`     必需数据: ${level.requiredData.join(', ')}\n`);
    });

    // 演示场景1：完整出生信息
    console.log('🎯 场景1: 完整出生信息取名');
    const fullRequest: NamingRequest = {
      familyName: '张',
      gender: 'male',
      birthInfo: {
        year: 2024,
        month: 3,
        day: 15,
        hour: 10,
        minute: 30
      },
      characters: ['明', '德'],
      preferences: {
        parallelExecution: true
      }
    };

    console.log('📝 请求信息:');
    console.log(`   姓氏: ${fullRequest.familyName}`);
    console.log(`   性别: ${fullRequest.gender}`);
    console.log(`   出生时间: ${fullRequest.birthInfo?.year}-${fullRequest.birthInfo?.month}-${fullRequest.birthInfo?.day} ${fullRequest.birthInfo?.hour}:${fullRequest.birthInfo?.minute}`);
    console.log(`   候选字符: ${fullRequest.characters?.join('、')}`);

    const fullResponse = await namingSystem.processNamingRequest(fullRequest);
    displayResults('完整信息分析', fullResponse);

    // 演示场景2：预产期取名
    console.log('\n🎯 场景2: 预产期取名');
    const predueRequest: NamingRequest = {
      familyName: '李',
      gender: 'female',
      predueDate: {
        year: 2024,
        month: 12,
        weekOffset: 3
      },
      characters: ['雅', '欣']
    };

    console.log('📝 请求信息:');
    console.log(`   姓氏: ${predueRequest.familyName}`);
    console.log(`   性别: ${predueRequest.gender}`);
    console.log(`   预产期: ${predueRequest.predueDate?.year}年${predueRequest.predueDate?.month}月 (±${predueRequest.predueDate?.weekOffset}周)`);
    console.log(`   候选字符: ${predueRequest.characters?.join('、')}`);

    const predueResponse = await namingSystem.processNamingRequest(predueRequest);
    displayResults('预产期分析', predueResponse);

    // 演示场景3：基础信息取名
    console.log('\n🎯 场景3: 基础信息取名');
    const basicRequest: NamingRequest = {
      familyName: '王',
      gender: 'male',
      characters: ['智', '慧']
    };

    console.log('📝 请求信息:');
    console.log(`   姓氏: ${basicRequest.familyName}`);
    console.log(`   性别: ${basicRequest.gender}`);
    console.log(`   候选字符: ${basicRequest.characters?.join('、')}`);

    const basicResponse = await namingSystem.processNamingRequest(basicRequest);
    displayResults('基础信息分析', basicResponse);

    // 显示系统统计
    console.log('\n📈 系统状态统计:');
    const status = namingSystem.getSystemStatus();
    console.log(`   系统版本: ${status.version}`);
    console.log(`   初始化状态: ${status.initialized ? '✅' : '❌'}`);
    console.log(`   插件统计: ${JSON.stringify(status.statistics, null, 2)}`);

  } catch (error) {
    console.error('❌ 演示过程中出现错误:', error);
  } finally {
    // 清理资源
    console.log('\n🧹 清理系统资源...');
    await namingSystem.destroy();
    console.log('✅ 演示完成');
  }
}

function displayResults(title: string, response: NamingResponse) {
  console.log(`\n📋 ${title}结果:`);
  console.log(`   处理状态: ${response.success ? '✅ 成功' : '❌ 失败'}`);
  console.log(`   确定性等级: ${getCertaintyLevelName(response.analysis.certaintyLevel)}`);
  console.log(`   置信度: ${(response.analysis.confidence * 100).toFixed(1)}%`);
  console.log(`   执行策略: ${response.analysis.strategy}`);
  console.log(`   处理时间: ${response.metadata.processingTime}ms`);
  console.log(`   执行插件: ${response.metadata.executedPlugins.length}个`);
  console.log(`   跳过插件: ${response.metadata.skippedPlugins.length}个`);

  if (response.recommendations.length > 0) {
    console.log('   主要建议:');
    response.recommendations.slice(0, 3).forEach(rec => {
      console.log(`     • ${rec}`);
    });
  }

  if (response.warnings.length > 0) {
    console.log('   警告信息:');
    response.warnings.forEach(warning => {
      console.log(`     ⚠️ ${warning}`);
    });
  }

  if (response.errors && response.errors.length > 0) {
    console.log('   错误信息:');
    response.errors.forEach(error => {
      console.log(`     ❌ ${error.message}`);
    });
  }

  // 显示层级结果概要
  const layerSummary = [];
  if (response.layer1Results && Object.keys(response.layer1Results).length > 0) {
    layerSummary.push(`L1基础(${Object.keys(response.layer1Results).length})`);
  }
  if (response.layer2Results && Object.keys(response.layer2Results).length > 0) {
    layerSummary.push(`L2命理(${Object.keys(response.layer2Results).length})`);
  }
  if (response.layer3Results && Object.keys(response.layer3Results).length > 0) {
    layerSummary.push(`L3字符(${Object.keys(response.layer3Results).length})`);
  }
  if (response.layer4Results && Object.keys(response.layer4Results).length > 0) {
    layerSummary.push(`L4组合(${Object.keys(response.layer4Results).length})`);
  }
  
  if (layerSummary.length > 0) {
    console.log(`   层级结果: ${layerSummary.join(', ')}`);
  }
}

function getCertaintyLevelName(level: CertaintyLevel): string {
  switch (level) {
    case CertaintyLevel.FULLY_DETERMINED:
      return '完全确定';
    case CertaintyLevel.PARTIALLY_DETERMINED:
      return '部分确定';
    case CertaintyLevel.ESTIMATED:
      return '预估阶段';
    case CertaintyLevel.UNKNOWN:
      return '完全未知';
    default:
      return '未知等级';
  }
}

// 运行演示
if (require.main === module) {
  demonstrateNamingSystem().catch(console.error);
}

export { demonstrateNamingSystem };
