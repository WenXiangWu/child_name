import { NextApiRequest, NextApiResponse } from 'next';

// 导入两套系统的处理函数
async function callTraditionalSystem(requestBody: any) {
  // 模拟调用传统系统 API
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/generate-names-detailed`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });
  
  return await response.json();
}

async function callPluginSystem(requestBody: any) {
  // 调用真实插件系统 API
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/generate-names-plugin-real`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...requestBody,
      enableDetailedLogs: true,
      enableParallel: false // 对比时使用串行执行保证一致性
    }),
  });
  
  return await response.json();
}

// 系统对比分析器
class SystemComparator {
  
  // 对比名字生成结果
  compareNameGeneration(traditionalResult: any, pluginResult: any) {
    const traditionalNames = traditionalResult.data?.names || [];
    const pluginNames = pluginResult.data?.names || [];
    
    // 名字重叠分析
    const traditionalNameSet = new Set(traditionalNames.map((n: any) => n.fullName));
    const pluginNameSet = new Set(pluginNames.map((n: any) => n.fullName));
    
    const commonNames = [...traditionalNameSet].filter(name => pluginNameSet.has(name));
    const onlyTraditional = [...traditionalNameSet].filter(name => !pluginNameSet.has(name));
    const onlyPlugin = [...pluginNameSet].filter(name => !traditionalNameSet.has(name));
    
    return {
      totalTraditional: traditionalNames.length,
      totalPlugin: pluginNames.length,
      commonCount: commonNames.length,
      commonNames,
      onlyTraditional,
      onlyPlugin,
      overlapRate: traditionalNames.length > 0 ? 
        Math.round((commonNames.length / Math.max(traditionalNames.length, pluginNames.length)) * 100) : 0
    };
  }
  
  // 对比评分结果
  compareScoring(traditionalResult: any, pluginResult: any) {
    const traditionalNames = traditionalResult.data?.names || [];
    const pluginNames = pluginResult.data?.names || [];
    
    // 找到共同的名字进行评分对比
    const scoreComparisons = [];
    
    for (const tName of traditionalNames) {
      const pName = pluginNames.find((p: any) => p.fullName === tName.fullName);
      if (pName) {
        scoreComparisons.push({
          name: tName.fullName,
          traditionalScore: tName.score,
          pluginScore: pName.score,
          scoreDiff: Math.abs(tName.score - pName.score),
          traditional: tName,
          plugin: pName
        });
      }
    }
    
    // 计算平均分差
    const avgScoreDiff = scoreComparisons.length > 0 ?
      scoreComparisons.reduce((sum, comp) => sum + comp.scoreDiff, 0) / scoreComparisons.length : 0;
    
    return {
      comparableNames: scoreComparisons.length,
      avgScoreDiff: Math.round(avgScoreDiff * 100) / 100,
      scoreComparisons: scoreComparisons.slice(0, 5), // 只返回前5个详细对比
      consistency: avgScoreDiff < 5 ? 'high' : avgScoreDiff < 10 ? 'medium' : 'low'
    };
  }
  
  // 对比性能
  comparePerformance(traditionalResult: any, pluginResult: any) {
    const traditionalTime = traditionalResult.data?.generationProcess?.step8_qualityFiltering?.totalTime || 0;
    const pluginTime = pluginResult.data?.pluginSystem?.executionSummary?.totalTime || 0;
    
    const speedRatio = traditionalTime > 0 ? pluginTime / traditionalTime : 0;
    const speedDiff = pluginTime - traditionalTime;
    
    return {
      traditionalTime,
      pluginTime,
      speedRatio: Math.round(speedRatio * 100) / 100,
      speedDiff,
      fasterSystem: speedDiff < 0 ? 'plugin' : 'traditional',
      performanceGap: Math.abs(speedDiff)
    };
  }
  
  // 对比功能覆盖
  compareFeatureCoverage(traditionalResult: any, pluginResult: any) {
    const traditionalFeatures = this.extractFeatures(traditionalResult);
    const pluginFeatures = this.extractFeatures(pluginResult);
    
    return {
      traditional: traditionalFeatures,
      plugin: pluginFeatures,
      additionalInPlugin: pluginFeatures.filter((f: string) => !traditionalFeatures.includes(f)),
      missingInPlugin: traditionalFeatures.filter((f: string) => !pluginFeatures.includes(f))
    };
  }
  
  // 提取系统功能特性
  private extractFeatures(result: any): string[] {
    const features = [];
    
    if (result.data?.generationProcess) {
      // 传统系统特性
      if (result.data.generationProcess.step1_familyAnalysis) features.push('姓氏分析');
      if (result.data.generationProcess.step2_strokeCombinations) features.push('笔画组合');
      if (result.data.generationProcess.step3_wuxingRequirements) features.push('五行要求');
      if (result.data.generationProcess.step4_sancaiWugeAnalysis) features.push('三才五格');
      if (result.data.generationProcess.step5_candidateFiltering) features.push('候选字筛选');
      if (result.data.generationProcess.step6_nameGeneration) features.push('名字生成');
      if (result.data.generationProcess.step7_qualityFiltering) features.push('质量筛选');
    }
    
    if (result.data?.pluginSystem) {
      // 插件系统特性
      if (result.data.pluginSystem.layerResults.layer1) features.push('基础信息层');
      if (result.data.pluginSystem.layerResults.layer2) features.push('命理基础层');
      if (result.data.pluginSystem.layerResults.layer3) features.push('字符评估层');
      if (result.data.pluginSystem.layerResults.layer4) features.push('组合计算层');
      if (result.data.pluginSystem.detailedLogs) features.push('详细日志');
      if (result.data.pluginSystem.certaintyLevel) features.push('确定性等级');
      if (result.data.pluginSystem.executionStrategy) features.push('执行策略');
    }
    
    return features;
  }
  
  // 生成综合对比报告
  generateComparisonReport(traditionalResult: any, pluginResult: any) {
    const nameComparison = this.compareNameGeneration(traditionalResult, pluginResult);
    const scoreComparison = this.compareScoring(traditionalResult, pluginResult);
    const performanceComparison = this.comparePerformance(traditionalResult, pluginResult);
    const featureComparison = this.compareFeatureCoverage(traditionalResult, pluginResult);
    
    // 生成结论和建议
    const conclusions = [];
    const recommendations = [];
    
    // 名字重叠分析结论
    if (nameComparison.overlapRate >= 70) {
      conclusions.push('两系统生成的名字高度一致，说明核心算法稳定');
    } else if (nameComparison.overlapRate >= 40) {
      conclusions.push('两系统生成的名字有一定差异，插件系统提供了更多选择');
    } else {
      conclusions.push('两系统生成的名字差异较大，可能采用不同的筛选策略');
    }
    
    // 评分一致性结论
    if (scoreComparison.consistency === 'high') {
      conclusions.push('两系统的评分高度一致，评价标准相近');
    } else if (scoreComparison.consistency === 'medium') {
      conclusions.push('两系统的评分有一定差异，可能权重配置不同');
    } else {
      conclusions.push('两系统的评分差异较大，建议检查评分算法');
    }
    
    // 性能对比结论
    if (performanceComparison.fasterSystem === 'traditional') {
      conclusions.push(`传统系统速度更快，比插件系统快${performanceComparison.performanceGap}ms`);
      recommendations.push('如果追求速度，建议使用传统系统');
    } else {
      conclusions.push(`插件系统速度更快，比传统系统快${performanceComparison.performanceGap}ms`);
      recommendations.push('插件系统在性能上有优势');
    }
    
    // 功能覆盖建议
    if (featureComparison.additionalInPlugin.length > 0) {
      recommendations.push(`插件系统提供额外功能: ${featureComparison.additionalInPlugin.join(', ')}`);
    }
    
    if (featureComparison.missingInPlugin.length > 0) {
      recommendations.push(`插件系统缺少功能: ${featureComparison.missingInPlugin.join(', ')}`);
    }
    
    return {
      overview: {
        traditionalSuccess: traditionalResult.success,
        pluginSuccess: pluginResult.success,
        bothSucceeded: traditionalResult.success && pluginResult.success
      },
      nameComparison,
      scoreComparison,
      performanceComparison,
      featureComparison,
      conclusions,
      recommendations,
      timestamp: new Date().toISOString(),
      summary: {
        nameOverlap: `${nameComparison.overlapRate}%`,
        scoreConsistency: scoreComparison.consistency,
        fasterSystem: performanceComparison.fasterSystem,
        featureAdvantage: featureComparison.additionalInPlugin.length > 0 ? 'plugin' : 
                         featureComparison.missingInPlugin.length > 0 ? 'traditional' : 'equal'
      }
    };
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      familyName,
      gender,
      birthDate,
      birthTime,
      preferredElements,
      avoidedWords,
      scoreThreshold,
      useTraditional,
      limit = 5,
      offset = 0,
      weights,
      // 混合API特有参数
      usePluginSystem = false,
      showComparison = false,
      enableDetailedLogs = true
    } = req.body;

    // 验证必要参数
    if (!familyName || !gender) {
      return res.status(400).json({ 
        success: false, 
        error: '缺少必要参数：familyName 和 gender' 
      });
    }

    const requestBody = {
      familyName,
      gender,
      birthDate,
      birthTime,
      preferredElements,
      avoidedWords,
      scoreThreshold,
      useTraditional,
      limit,
      offset,
      weights
    };

    console.log('🔄 混合API处理开始:', {
      usePluginSystem,
      showComparison,
      familyName,
      gender
    });

    const startTime = Date.now();
    
    if (showComparison) {
      // 对比模式：同时运行两套系统
      console.log('🔍 对比模式：同时运行传统系统和插件系统');
      
      const [traditionalResult, pluginResult] = await Promise.allSettled([
        callTraditionalSystem(requestBody),
        callPluginSystem(requestBody)
      ]);
      
      const traditionalData = traditionalResult.status === 'fulfilled' ? traditionalResult.value : {
        success: false,
        error: traditionalResult.status === 'rejected' ? traditionalResult.reason?.message : '传统系统执行失败'
      };
      
      const pluginData = pluginResult.status === 'fulfilled' ? pluginResult.value : {
        success: false,
        error: pluginResult.status === 'rejected' ? pluginResult.reason?.message : '插件系统执行失败'
      };
      
      // 生成对比分析
      const comparator = new SystemComparator();
      const comparison = comparator.generateComparisonReport(traditionalData, pluginData);
      
      const totalTime = Date.now() - startTime;
      
      console.log('📊 系统对比完成:', {
        traditionalSuccess: traditionalData.success,
        pluginSuccess: pluginData.success,
        nameOverlap: comparison.summary.nameOverlap,
        fasterSystem: comparison.summary.fasterSystem,
        totalTime: `${totalTime}ms`
      });
      
      return res.status(200).json({
        success: true,
        mode: 'comparison',
        data: {
          traditional: traditionalData,
          plugin: pluginData,
          comparison,
          metadata: {
            totalTime,
            bothSucceeded: comparison.overview.bothSucceeded,
            executionStrategy: 'parallel_comparison'
          }
        }
      });
      
    } else if (usePluginSystem) {
      // 插件系统模式
      console.log('🧩 插件系统模式');
      
      const result = await callPluginSystem({
        ...requestBody,
        enableDetailedLogs
      });
      
      const totalTime = Date.now() - startTime;
      
      console.log('✅ 插件系统执行完成:', {
        success: result.success,
        totalTime: `${totalTime}ms`
      });
      
      return res.status(200).json({
        ...result,
        mode: 'plugin',
        metadata: {
          ...result.metadata,
          hybridApiTime: totalTime
        }
      });
      
    } else {
      // 传统系统模式
      console.log('⚡ 传统系统模式');
      
      const result = await callTraditionalSystem(requestBody);
      
      const totalTime = Date.now() - startTime;
      
      console.log('✅ 传统系统执行完成:', {
        success: result.success,
        totalTime: `${totalTime}ms`
      });
      
      return res.status(200).json({
        ...result,
        mode: 'traditional',
        metadata: {
          ...result.metadata,
          hybridApiTime: totalTime
        }
      });
    }

  } catch (error) {
    console.error('混合API执行失败:', error);
    
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '混合API执行失败',
      mode: 'error',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}

// 辅助函数：获取系统健康状态
export async function getSystemHealth() {
  try {
    const healthChecks = await Promise.allSettled([
      // 检查传统系统健康状态
      fetch('/api/generate-names-detailed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          familyName: '测试',
          gender: 'male',
          limit: 1
        })
      }).then(res => ({ system: 'traditional', healthy: res.ok })),
      
      // 检查插件系统健康状态
      fetch('/api/generate-names-plugin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          familyName: '测试',
          gender: 'male',
          limit: 1
        })
      }).then(res => ({ system: 'plugin', healthy: res.ok }))
    ]);
    
    return {
      traditional: healthChecks[0].status === 'fulfilled' && healthChecks[0].value.healthy,
      plugin: healthChecks[1].status === 'fulfilled' && healthChecks[1].value.healthy,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      traditional: false,
      plugin: false,
      error: error instanceof Error ? error.message : '健康检查失败',
      timestamp: new Date().toISOString()
    };
  }
}
