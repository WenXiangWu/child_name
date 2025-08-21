import { NextApiRequest, NextApiResponse } from 'next';
import { getQimingInstance } from '../../core/common/data-loader';
import { QimingNameGenerator } from '../../core/naming/name-generator';
import { NameGenerationConfig } from '../../core/common/types';
import { ensureDataReady, isDataReady, getLoadingState } from '../../core/common/global-preloader';

import { truePluginEngine } from '../../core/plugins/core/TruePluginEngine';

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
      // 新增：插件系统支持
      usePluginSystem = false,
      enableDetailedLogs = false,
      certaintyLevel
    } = req.body;

    // 验证必要参数
    if (!familyName || !gender) {
      return res.status(400).json({ 
        success: false, 
        error: '缺少必要参数：familyName 和 gender' 
      });
    }

    console.log('📊 生成名字API调用:', {
      familyName,
      gender,
      birthDate,
      birthTime,
      usePluginSystem,
      enableDetailedLogs,
      limit
    });

    // 如果使用插件系统
    if (usePluginSystem) {
      return handlePluginSystemRequest(req, res, {
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
        enableDetailedLogs,
        certaintyLevel
      });
    }

    // 传统模式：构建配置
    const config: NameGenerationConfig = {
      familyName,
      gender: gender as 'male' | 'female',
      scoreThreshold: scoreThreshold || 80,
      useTraditional: useTraditional || false,
      avoidedWords: avoidedWords || [],
      limit: Math.min(limit, 20), // 最多一次生成20个
      offset: Math.max(offset, 0)  // 确保offset不为负数
    };

    // 如果有五行偏好，设置五行要求
    if (preferredElements && preferredElements.length >= 2) {
      // 这里需要根据实际需求映射五行
      config.preferredWuxing = preferredElements;
    }

    console.log('传统模式生成名字配置:', {
      familyName: config.familyName,
      gender: config.gender,
      limit: config.limit,
      offset: config.offset,
      scoreThreshold: config.scoreThreshold
    });

    // 确保数据已准备就绪（如果未预加载会自动加载）
    console.log(`📊 数据预加载状态: ${getLoadingState()}`);
    if (!isDataReady()) {
      console.log('⏳ 数据未就绪，等待预加载完成...');
    }
    
    await ensureDataReady();
    console.log('✅ 数据已就绪，开始传统模式生成名字');

    const qiming = getQimingInstance();
    const nameGenerator = new QimingNameGenerator();
    const names = await nameGenerator.generateNames(config);

    // 检查是否还有更多名字
    const hasMore = offset + limit < 100; // 假设最多有100个候选名字

    // 安全地序列化名字数据，避免循环引用
    const safeNames = names.map(name => ({
      fullName: name.fullName,
      familyName: name.familyName,
      midChar: name.midChar,
      lastChar: name.lastChar,
      grids: {
        tiange: name.grids.tiange,
        renge: name.grids.renge,
        dige: name.grids.dige,
        zongge: name.grids.zongge,
        waige: name.grids.waige
      },
      sancai: {
        heaven: name.sancai.heaven,
        human: name.sancai.human,
        earth: name.sancai.earth,
        combination: name.sancai.combination,
        level: name.sancai.level,
        description: name.sancai.description
      },
      score: name.score,
      explanation: name.explanation
    }));

    res.status(200).json({
      success: true,
      mode: 'traditional',
      data: {
        names: safeNames,
        pagination: {
          limit: config.limit,
          offset: config.offset,
          total: safeNames.length,
          hasMore
        },
        config: {
          familyName: config.familyName,
          gender: config.gender,
          scoreThreshold: config.scoreThreshold
        }
      }
    });

  } catch (error) {
    console.error('名字生成失败:', error);
    
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '名字生成失败',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}

/**
 * 处理插件系统请求
 */
async function handlePluginSystemRequest(
  req: NextApiRequest, 
  res: NextApiResponse, 
  params: any
) {
  const {
    familyName, gender, birthDate, birthTime, 
    preferredElements, avoidedWords, scoreThreshold, 
    useTraditional, limit, offset, enableDetailedLogs, certaintyLevel
  } = params;

  try {
    console.log('🧩 切换到插件系统模式');

    // 构建插件系统请求
    const pluginRequest = {
      familyName,
      gender: gender as 'male' | 'female',
      birthInfo: birthDate ? {
        year: new Date(birthDate).getFullYear(),
        month: new Date(birthDate).getMonth() + 1,
        day: new Date(birthDate).getDate(),
        hour: birthTime ? parseInt(birthTime.split(':')[0]) : undefined,
        minute: birthTime ? parseInt(birthTime.split(':')[1]) : undefined
      } : undefined,
      characters: avoidedWords,
      scoreThreshold: scoreThreshold || 80,
      useTraditional: useTraditional || false,
      avoidedWords: avoidedWords || [],
      limit: Math.min(limit, 20),
      offset: Math.max(offset, 0),
      preferredElements,
      preferences: {
        certaintyLevel: certaintyLevel || undefined,
        parallelExecution: false,
        includeTraditionalAnalysis: useTraditional || false,
        skipOptionalFailures: true,
        nameCount: limit
      }
    };

    console.log('🚀 插件系统请求:', {
      familyName: pluginRequest.familyName,
      gender: pluginRequest.gender,
      birthInfo: pluginRequest.birthInfo,
      hasBirthInfo: !!pluginRequest.birthInfo,
      limit: pluginRequest.limit
    });

    const startTime = Date.now();

    // 调用真正的插件系统引擎
    console.log('🧩 使用真正的插件系统引擎');
    const result = await truePluginEngine.executeFullPipeline(pluginRequest);

    const executionTime = Date.now() - startTime;

    if (result.success) {
      // 转换插件系统结果为标准格式
      const safeNames = result.names.map(name => ({
        fullName: name.fullName,
        familyName: name.familyName,
        midChar: name.midChar,
        lastChar: name.lastChar,
        grids: {
          tiange: name.grids.tiange,
          renge: name.grids.renge,
          dige: name.grids.dige,
          zongge: name.grids.zongge,
          waige: name.grids.waige
        },
        sancai: {
          heaven: name.sancai.heaven,
          human: name.sancai.human,
          earth: name.sancai.earth,
          combination: name.sancai.combination,
          level: name.sancai.level,
          description: name.sancai.description
        },
        score: name.score,
        explanation: name.explanation
      }));

      const hasMore = offset + limit < result.names.length;

      console.log('✅ 真正插件系统执行成功:', {
        namesGenerated: result.names.length,
        executionTime: `${executionTime}ms`,
        pluginsExecuted: result.metadata.pluginsExecuted,
        layersProcessed: result.metadata.layersProcessed
      });

      res.status(200).json({
        success: true,
        mode: 'plugin',
        data: {
          names: safeNames,
          pagination: {
            limit,
            offset,
            total: safeNames.length,
            hasMore
          },
          config: {
            familyName: pluginRequest.familyName,
            gender: pluginRequest.gender,
            scoreThreshold: pluginRequest.scoreThreshold
          }
        },
        metadata: {
          executionTime,
          pluginsExecuted: result.metadata.pluginsExecuted,
          layersProcessed: result.metadata.layersProcessed,
          totalProcessingTime: result.totalTime,
          generationMethod: result.metadata.generationMethod,
          confidence: result.metadata.confidence,
          truePluginSystem: true
        },
        executionLogs: result.executionLogs
      });

    } else {
      console.error('❌ 插件系统执行失败');
      
      res.status(500).json({
        success: false,
        mode: 'plugin',
        error: '插件系统名字生成失败',
        metadata: {
          executionTime,
          pluginsExecuted: result.metadata.pluginsExecuted,
          truePluginSystem: true
        },
        executionLogs: result.executionLogs
      });
    }

  } catch (error) {
    console.error('❌ 插件系统请求处理失败:', error);
    
    res.status(500).json({
      success: false,
      mode: 'plugin',
      error: error instanceof Error ? error.message : '插件系统处理失败',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}