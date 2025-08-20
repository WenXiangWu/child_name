/**
 * 插件系统测试脚本
 * 
 * 用于测试重构后的6层插件架构是否正常工作
 */

import { UnifiedNamingExecutor } from './core/UnifiedNamingExecutor.js';
import { StandardInput } from './interfaces/NamingPlugin.js';

async function testPluginSystem() {
  console.log('🎯 开始测试6层插件架构系统');
  console.log('=====================================');
  console.log('');

  // 创建测试输入 - 基于文档示例
  const testInput: StandardInput = {
    familyName: '吴',
    gender: 'male' as const,
    birthInfo: {
      year: 2025,
      month: 10,
      day: 31,
      hour: 10,
      minute: 0
    },
    preferences: {
      includeTraditionalAnalysis: true,
      skipOptionalFailures: false
    }
  };

  console.log('📋 测试输入信息:');
  console.log(`   姓氏: ${testInput.familyName}`);
  console.log(`   性别: ${testInput.gender}`);
  console.log(`   出生时间: ${testInput.birthInfo?.year}-${testInput.birthInfo?.month}-${testInput.birthInfo?.day} ${testInput.birthInfo?.hour}:${testInput.birthInfo?.minute}`);
  console.log('');

  try {
    // 创建执行器并执行
    const executor = new UnifiedNamingExecutor();
    const result = await executor.executeNaming(testInput);

    console.log('📊 测试结果汇总:');
    console.log('=====================================');
    console.log(`✅ 执行状态: ${result.success ? '成功' : '失败'}`);
    console.log(`⏱️  总执行时间: ${result.executionTime}ms`);
    console.log(`🔧 执行插件数: ${result.pluginResults.size}个`);
    console.log(`❌ 错误数量: ${result.errors.length}个`);

    if (result.errors.length > 0) {
      console.log('');
      console.log('⚠️  错误详情:');
      result.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }

    console.log('');
    console.log('🔍 插件执行详情:');
    result.pluginResults.forEach((pluginResult, pluginId) => {
      const status = pluginResult.success ? '✅' : '❌';
      const confidence = pluginResult.confidence ? ` (置信度: ${pluginResult.confidence})` : '';
      console.log(`   ${status} ${pluginId}${confidence}`);
    });

    if (result.finalRecommendation) {
      console.log('');
      console.log('🏆 最终推荐结果:');
      console.log('=====================================');
      console.log(`   推荐名字: ${result.finalRecommendation.fullName}`);
      if (result.finalRecommendation.comprehensiveScore) {
        console.log(`   综合评分: ${result.finalRecommendation.comprehensiveScore}分`);
      }
      if (result.finalRecommendation.recommendation) {
        console.log(`   推荐说明: ${result.finalRecommendation.recommendation}`);
      }
    }

    // 测试各层的数据流转
    console.log('');
    console.log('🔄 数据流转检查:');
    console.log('=====================================');
    
    const surnameResult = result.results.get('surname');
    if (surnameResult) {
      console.log(`✅ Layer 1 姓氏分析: ${surnameResult.familyName} (${surnameResult.characterInfo?.wuxing}五行)`);
    }

    const genderResult = result.results.get('gender');
    if (genderResult) {
      console.log(`✅ Layer 1 性别偏好: ${genderResult.gender} (典籍偏好: ${genderResult.literarySourcePreference?.preferred?.join(', ')})`);
    }

    const birthTimeResult = result.results.get('birth-time');
    if (birthTimeResult) {
      console.log(`✅ Layer 1 出生时间: 确定性等级 ${birthTimeResult.certaintyLevel}`);
    }

    const xiyongshenResult = result.results.get('xiyongshen');
    if (xiyongshenResult) {
      console.log(`✅ Layer 2 喜用神: ${xiyongshenResult.analysis?.yongShen?.join(', ')} (方法: ${xiyongshenResult.analysis?.method})`);
    }

    const filterResult = result.results.get('character-filter');
    if (filterResult) {
      console.log(`✅ Layer 4 字符筛选: ${filterResult.filteringSummary?.totalCandidates}个候选字符`);
    }

    const scoringResult = result.results.get('comprehensive-scoring');
    if (scoringResult) {
      console.log(`✅ Layer 6 综合评分: ${scoringResult.summaryReport?.recommendationCount}个推荐名字`);
    }

    console.log('');
    console.log('🎉 测试完成!');
    
    if (result.success && result.errors.length === 0) {
      console.log('✅ 所有插件正常工作，6层架构执行成功！');
    } else if (result.success && result.errors.length > 0) {
      console.log('⚠️  插件执行基本成功，但存在一些非致命错误');
    } else {
      console.log('❌ 插件执行失败，需要检查错误并修复');
    }

  } catch (error) {
    console.error('💥 测试过程中发生异常:');
    console.error(error);
  }
}

// 执行测试
if (require.main === module) {
  testPluginSystem().catch(console.error);
}

export { testPluginSystem };
