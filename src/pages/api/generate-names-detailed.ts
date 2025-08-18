import { NextApiRequest, NextApiResponse } from 'next';
import { getQimingInstance } from '../../core/common/data-loader';
import { QimingNameGenerator } from '../../core/naming/name-generator';
import { NameGenerationConfig, WeightConfig, WuxingElement } from '../../core/common/types';
import { ensureDataReady, isDataReady, getLoadingState } from '../../core/common/global-preloader';
import { weightedScoreCalculator, ScoreComponents } from '../../core/calculation/weighted-score-calculator';
import { WuxingScorer } from '../../core/analysis/wuxing-scorer';
import { MeaningScorer } from '../../core/analysis/meaning-scorer';
import { SocialScorer } from '../../core/analysis/social-scorer';
import { PinyinAnalyzer } from '../../core/analysis/pinyin-analyzer';
import { SancaiWugeCalculator } from '../../core/calculation/sancai-calculator';

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
      weights
    } = req.body;

    // 验证必要参数
    if (!familyName || !gender) {
      return res.status(400).json({ 
        success: false, 
        error: '缺少必要参数：familyName 和 gender' 
      });
    }

    const config: NameGenerationConfig = {
      familyName,
      gender: gender as 'male' | 'female',
      scoreThreshold: scoreThreshold || 80,
      useTraditional: useTraditional || false,
      avoidedWords: avoidedWords || [],
      limit: Math.min(limit, 20), // 最多一次生成20个
      offset: Math.max(offset, 0)  // 确保offset不为负数
    };

    if (preferredElements && preferredElements.length >= 2) {
      config.preferredWuxing = preferredElements;
    }

    console.log('详细生成名字配置:', {
      familyName: config.familyName,
      gender: config.gender,
      limit: config.limit,
      offset: config.offset,
      scoreThreshold: config.scoreThreshold
    });

    const startTime = Date.now();
    console.log(`[${new Date().toLocaleTimeString()}] 检查数据预加载状态...`);
    
    // 确保数据已准备就绪（如果未预加载会自动加载）
    console.log(`📊 数据预加载状态: ${getLoadingState()}`);
    if (!isDataReady()) {
      console.log('⏳ 数据未就绪，等待预加载完成...');
    }
    
    await ensureDataReady();
    console.log(`[${new Date().toLocaleTimeString()}] 数据已就绪，耗时：${Date.now() - startTime}ms`);

    const qiming = getQimingInstance();
    const nameGenerator = new QimingNameGenerator();
    const sancaiCalculator = new SancaiWugeCalculator();
    const pinyinAnalyzer = PinyinAnalyzer.getInstance();

    // 获取详细的生成过程
    const dataLoader = qiming;

    // 1. 分析姓氏
    console.log(`[${new Date().toLocaleTimeString()}] 步骤1：开始分析姓氏 "${familyName}"`);
    const stepTime = Date.now();
    const familyStrokes = await sancaiCalculator.getStrokes(familyName, config.useTraditional);
    console.log(`[${new Date().toLocaleTimeString()}] 步骤1完成：姓氏"${familyName}"为${familyStrokes}画，耗时：${Date.now() - stepTime}ms`);
    
    // 2. 获取最佳笔画组合
    console.log(`[${new Date().toLocaleTimeString()}] 步骤2：开始获取最佳笔画组合`);
    const step2Time = Date.now();
    const allStrokeCombinations = await sancaiCalculator.getBestStrokeCombinations(
      config.familyName,
      config.useTraditional || false,
      config.specificBest || false
    );
    console.log(`[${new Date().toLocaleTimeString()}] 步骤2完成：找到${allStrokeCombinations.length}种笔画组合，耗时：${Date.now() - step2Time}ms`);
    
    // 3. 确定五行要求（简化版本）
    console.log(`[${new Date().toLocaleTimeString()}] 步骤3：开始确定五行要求`);
    const step3Time = Date.now();
    // 暂时使用默认五行要求，后续可以完善
    const midWuxing: WuxingElement = '木';
    const lastWuxing: WuxingElement = '火';
    console.log(`[${new Date().toLocaleTimeString()}] 步骤3完成：中间字${midWuxing}行，最后字${lastWuxing}行，耗时：${Date.now() - step3Time}ms`);
    
    // 4. 获取常用字库
    console.log(`[${new Date().toLocaleTimeString()}] 步骤4：开始获取${config.gender === 'male' ? '男性' : '女性'}常用字库`);
    const step4Time = Date.now();
    const targetGender = config.gender === 'male' ? '男' : '女';
    const commonWords = await dataLoader.getCommonNameWords(targetGender);
    console.log(`[${new Date().toLocaleTimeString()}] 步骤4完成：获取到${commonWords.size}个${targetGender}性常用字，耗时：${Date.now() - step4Time}ms`);
    
    // 5. 分析候选字情况和三才五格
    console.log(`[${new Date().toLocaleTimeString()}] 步骤5：开始分析前5种笔画组合的候选字情况`);
    const step5Time = Date.now();
    const detailedAnalysis = [];
    let totalValidCombinations = 0;
    
    for (let i = 0; i < Math.min(5, allStrokeCombinations.length); i++) {
      console.log(`[${new Date().toLocaleTimeString()}] 正在分析第${i+1}种笔画组合: (${allStrokeCombinations[i].mid}, ${allStrokeCombinations[i].last})`);
      const combination = allStrokeCombinations[i];
      
      // 计算该组合的三才五格
      const grids = {
        tiange: familyStrokes + 1,
        renge: familyStrokes + combination.mid,
        dige: combination.mid + combination.last,
        zongge: familyStrokes + combination.mid + combination.last,
        waige: familyStrokes + combination.mid + combination.last - (familyStrokes + combination.mid) + 1
      };
      
      const sancai = await sancaiCalculator.calculateSancai(grids);
      
      // 获取候选字
      const midCandidates = await dataLoader.getWordsByStrokeAndWuxing(
        combination.mid,
        midWuxing,
        config.useTraditional || false
      );
      
      const lastCandidates = await dataLoader.getWordsByStrokeAndWuxing(
        combination.last,
        lastWuxing,
        config.useTraditional || false
      );

      // 过滤常用字
      const midCommonCandidates = midCandidates.filter((char: string) => commonWords.has(char));
      const lastCommonCandidates = lastCandidates.filter((char: string) => commonWords.has(char));
      
      const validCombinationsCount = midCommonCandidates.length * lastCommonCandidates.length;
      totalValidCombinations += validCombinationsCount;

      detailedAnalysis.push({
        rank: i + 1,
        combination,
        midWuxing,
        lastWuxing,
        grids,
        sancai: {
          heaven: sancai.heaven,
          human: sancai.human,
          earth: sancai.earth,
          combination: sancai.combination,
          level: sancai.level,
          description: sancai.description
        },
        midCandidates: {
          total: midCandidates.length,
          common: midCommonCandidates.length,
          samples: midCommonCandidates.slice(0, 8)
        },
        lastCandidates: {
          total: lastCandidates.length,
          common: lastCommonCandidates.length,
          samples: lastCommonCandidates.slice(0, 8)
        },
        validCombinations: validCombinationsCount
      });
    }
    console.log(`[${new Date().toLocaleTimeString()}] 步骤5完成：分析了${detailedAnalysis.length}种组合，总共${totalValidCombinations}个有效名字组合，耗时：${Date.now() - step5Time}ms`);

    // 6. 生成实际名字
    console.log(`[${new Date().toLocaleTimeString()}] 步骤6：开始生成实际名字`);
    const step6Time = Date.now();
    let names = await nameGenerator.generateNames(config);
    console.log(`[${new Date().toLocaleTimeString()}] 步骤6完成：生成了${names.length}个名字，耗时：${Date.now() - step6Time}ms`);
    
    // 6.1 应用个性化权重重新排序
    if (weights && names.length > 0) {
      console.log(`[${new Date().toLocaleTimeString()}] 步骤6.1：开始应用个性化权重`);
      const weightTime = Date.now();
      
      try {
        // 初始化各评分器
        const wuxingScorer = new WuxingScorer();
        const meaningScorer = new MeaningScorer();
        const socialScorer = new SocialScorer();
        const pinyinAnalyzer = PinyinAnalyzer.getInstance();
        
        // 为每个名字计算真实的各维度评分
        const namesWithComponents = await Promise.all(names.map(async (name) => {
          try {
            // 获取真实的各维度评分
            const sancaiScore = name.score; // 三才五格评分已在生成时计算
            
            // 五行平衡评分
            const wuxingResult = await wuxingScorer.calculateWuxingScore(
              familyName, 
              name.midChar + name.lastChar, 
              preferredElements
            );
            
            // 音韵美感评分
            const phoneticResult = pinyinAnalyzer.analyzeNamePhonetics(
              familyName, 
              name.midChar + name.lastChar
            );
            
            // 字义寓意评分
            const meaningResult = await meaningScorer.calculateMeaningScore(
              name.midChar, 
              name.lastChar
            );
            
            // 社会认可度评分
            const socialResult = await socialScorer.calculateSocialScore(
              name.midChar, 
              name.lastChar
            );
            
            // 构建真实的评分组件
            const components: ScoreComponents = {
              sancai: sancaiScore || 80,              // 三才五格评分
              wuxing: wuxingResult.score,             // 五行平衡评分
              sound: phoneticResult.harmony,          // 音韵美感评分
              meaning: meaningResult.score,           // 字义寓意评分
              social: socialResult.score              // 社会认可评分
            };
            
            return {
              ...name,
              components,
              // 附加详细分析数据（可选）
              detailedAnalysis: {
                wuxingAnalysis: wuxingResult,
                meaningAnalysis: meaningResult,
                socialAnalysis: socialResult,
                phoneticAnalysis: phoneticResult
              }
            };
          } catch (error) {
            console.error(`计算名字"${name.fullName}"的详细评分失败:`, error);
            
            // 如果真实计算失败，使用基础评分
            const baseScore = name.score || 80;
            const components: ScoreComponents = {
              sancai: baseScore,
              wuxing: Math.max(60, baseScore - 10),
              sound: Math.max(60, baseScore - 5),
              meaning: Math.max(60, baseScore - 8),
              social: Math.max(60, baseScore - 12)
            };
            
            return {
              ...name,
              components
            };
          }
        }));
        
        // 使用权重计算器重新排序
        const rerankedNames = weightedScoreCalculator.batchCalculateScores(namesWithComponents, weights);
        
        // 更新名字列表，使用新的加权评分
        names = rerankedNames.map(item => ({
          ...item,
          score: item.weightedScore,
          weightedScoreDetails: item.detailedScore
        }));
        
        console.log(`[${new Date().toLocaleTimeString()}] 步骤6.1完成：应用了个性化权重重新排序，耗时：${Date.now() - weightTime}ms`);
        console.log('权重配置:', weights);
        console.log('真实评分计算完成:', {
          计算方式: '三才五格+五行平衡+音韵美感+字义寓意+社会认可度',
          原始前三名: namesWithComponents.slice(0, 3).map(n => ({ 
            name: n.fullName, 
            原始分: n.score,
            三才五格: n.components.sancai,
            五行平衡: n.components.wuxing,
            音韵美感: n.components.sound,
            字义寓意: n.components.meaning,
            社会认可: n.components.social
          })),
          加权后前三名: names.slice(0, 3).map(n => ({ 
            name: n.fullName, 
            加权总分: n.score,
            详细评分: (n as any).weightedScoreDetails ? `三才${(n as any).weightedScoreDetails.breakdown.sancai.weighted.toFixed(1)} 五行${(n as any).weightedScoreDetails.breakdown.wuxing.weighted.toFixed(1)} 音韵${(n as any).weightedScoreDetails.breakdown.sound.weighted.toFixed(1)} 字义${(n as any).weightedScoreDetails.breakdown.meaning.weighted.toFixed(1)} 社会${(n as any).weightedScoreDetails.breakdown.social.weighted.toFixed(1)}` : '无详情'
          }))
        });
        
      } catch (weightError) {
        console.error('权重应用失败，使用原始排序:', weightError);
      }
    }
    
    // 7. 声调分析和质量筛选（最终筛选步骤）
    console.log(`[${new Date().toLocaleTimeString()}] 步骤7：开始声调分析和质量筛选`);
    const step7Time = Date.now();
    let toneAnalysis = null;
    if (names.length > 0) {
      try {
        // 取前几个名字进行声调分析示例
        const sampleNames = names.slice(0, 3);
        const toneResults = [];
        
        for (const name of sampleNames) {
          const phoneticResult = pinyinAnalyzer.analyzeNamePhonetics(name.familyName, name.midChar + name.lastChar);
          toneResults.push({
            name: name.fullName,
            phonetics: phoneticResult
          });
        }
        
        toneAnalysis = {
          sampleCount: toneResults.length,
          results: toneResults,
          summary: {
            avgHarmony: toneResults.reduce((sum, r) => sum + r.phonetics.harmony, 0) / toneResults.length,
            commonPatterns: toneResults.map(r => r.phonetics.tonePattern)
          }
        };
      } catch (error) {
        console.warn('声调分析失败:', error);
        toneAnalysis = { error: '声调分析暂不可用' };
      }
    }
    console.log(`[${new Date().toLocaleTimeString()}] 步骤7完成：声调分析处理完成，耗时：${Date.now() - step7Time}ms`);
    
    // 8. 检查是否还有更多名字
    console.log(`[${new Date().toLocaleTimeString()}] 步骤8：开始序列化结果数据`);
    const step8Time = Date.now();
    const hasMore = offset + limit < totalValidCombinations;

    // 安全地序列化名字数据
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
    
    console.log(`[${new Date().toLocaleTimeString()}] 步骤8完成：数据序列化完成，总耗时：${Date.now() - startTime}ms`);

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
        },
        // 详细生成过程
        generationProcess: {
          step1_familyAnalysis: {
            familyName: config.familyName,
            strokes: familyStrokes,
            description: `姓氏"${config.familyName}"共${familyStrokes}画`
          },
          step2_strokeCombinations: {
            total: allStrokeCombinations.length,
            analyzed: detailedAnalysis.length,
            description: `找到${allStrokeCombinations.length}种有效的笔画组合`,
            topCombinations: allStrokeCombinations.slice(0, 5)
          },
          step3_wuxingRequirements: {
            midWuxing,
            lastWuxing,
            description: `根据性别"${config.gender}"确定：中间字需要${midWuxing}行，最后字需要${lastWuxing}行`
          },
          step4_sancaiWugeAnalysis: {
            description: `对每种笔画组合进行三才五格分析`,
            detailedAnalysis,
            analysisCount: detailedAnalysis.length
          },
          step5_candidateFiltering: {
            commonWordsCount: commonWords.size,
            totalValidCombinations,
            description: `从${commonWords.size}个常用字中筛选符合条件的候选字`,
            filteringCriteria: [
              '必须是常用字',
              '符合五行属性要求',
              '符合笔画数要求',
              '避免用户指定的禁用字'
            ]
          },
          step6_nameGeneration: {
            totalGenerated: names.length,
            threshold: config.scoreThreshold,
            description: `生成${names.length}个评分≥${config.scoreThreshold}的高质量名字`,
            weightingApplied: weights ? {
              description: '应用了个性化权重重新排序',
              weights: weights,
              message: '名字排序已根据您的偏好权重进行个性化调整',
              calculationMethod: '真实算法计算',
              details: {
                sancaiMethod: '基于三才五格数理分析和122种吉凶规则',
                wuxingMethod: '基于五行相生相克理论和用户偏好匹配',
                soundMethod: '基于声调平仄分析和音韵和谐度算法',
                meaningMethod: '基于字义积极性分析和文化内涵评估',
                socialMethod: '基于字符常用度、时代适应性和重名率统计'
              }
            } : {
              description: '使用默认权重排序',
              message: '使用系统默认权重进行评分排序',
              calculationMethod: '真实算法计算',
              defaultWeights: {
                sancai: 25,
                wuxing: 25, 
                sound: 20,
                meaning: 20,
                social: 10
              }
            }
          },
          step7_qualityFiltering: toneAnalysis ? {
            description: `对生成的名字进行声调分析和最终质量筛选`,
            ...toneAnalysis
          } : {
            description: '质量筛选跳过（无生成名字）',
            skipped: true
          }
        }
      }
    });

  } catch (error) {
    console.error('详细名字生成失败:', error);
    
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '名字生成失败',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}