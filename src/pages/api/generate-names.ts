import { NextApiRequest, NextApiResponse } from 'next';
import { getQimingInstance } from '../../core/common/data-loader';
import { QimingNameGenerator } from '../../core/naming/name-generator';
import { NameGenerationConfig } from '../../core/common/types';
import { ensureDataReady, isDataReady, getLoadingState } from '../../core/common/global-preloader';

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
      offset = 0
    } = req.body;

    // 验证必要参数
    if (!familyName || !gender) {
      return res.status(400).json({ 
        success: false, 
        error: '缺少必要参数：familyName 和 gender' 
      });
    }

    // 构建配置
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

    console.log('生成名字配置:', {
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
    console.log('✅ 数据已就绪，开始生成名字');

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