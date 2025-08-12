/**
 * qiming名字生成引擎
 * 完全复现qiming/2generate_name.py的核心逻辑
 */

import { 
  NameGenerationConfig, 
  GeneratedName, 
  StrokeCombination,
  WuxingElement,
  Gender 
} from '../common/types';
import { SancaiWugeCalculator } from '../calculation/sancai-calculator';
import { QimingDataLoader } from '../common/data-loader';
import { StandardCharactersValidator } from '../analysis/standard-characters-validator';
import { isDataReady } from '../common/global-preloader';
import { DEFAULT_CONFIG } from '../common/constants';

export class QimingNameGenerator {
  private sancaiCalculator: SancaiWugeCalculator;
  private dataLoader: QimingDataLoader;
  private standardValidator: StandardCharactersValidator;

  constructor() {
    this.sancaiCalculator = new SancaiWugeCalculator();
    this.dataLoader = QimingDataLoader.getInstance();
    this.standardValidator = StandardCharactersValidator.getInstance();
  }

  /**
   * 生成名字 - 主要接口
   * 完全复现qiming/2generate_name.py的主逻辑
   */
  async generateNames(config: NameGenerationConfig): Promise<GeneratedName[]> {
    console.log('开始生成名字，配置:', config);
    
    // 确保数据已加载（只检查不重复加载）
    if (!isDataReady()) {
      await this.dataLoader.preloadCoreData();
    }

    // 初始化标准字符验证器
    await this.standardValidator.initialize();

    // 1. 获取最佳笔画组合 - 对应get_best_ge_bihua
    const strokeCombinations = await this.sancaiCalculator.getBestStrokeCombinations(
      config.familyName,
      config.useTraditional || false,
      config.specificBest || false
    );

    console.log(`找到 ${strokeCombinations.length} 个有效笔画组合`);

    // 2. 获取常用名字用字 - 对应get_common_name_words
    // 根据性别获取对应的常用字（与qiming保持一致）
    const targetGender = config.gender === 'male' ? '男' : '女';
    const commonWords = await this.dataLoader.getCommonNameWords(targetGender);
    console.log(`${targetGender}性常用名字字数量: ${commonWords.size}`);

    // 3. 根据配置确定五行要求
    const { midWuxing, lastWuxing } = this.determineWuxingRequirements(config);

    const generatedNames: GeneratedName[] = [];
    let totalCombinations = 0;

    // 4. 遍历有效的笔画组合生成名字
    for (const combination of strokeCombinations) {
      console.log(`处理笔画组合: 中字${combination.mid}画，末字${combination.last}画`);
      
      // 获取符合笔画和五行要求的候选字
      const midCandidates = await this.dataLoader.getWordsByStrokeAndWuxing(
        combination.mid,
        midWuxing,
        config.useTraditional || false
      );
      console.log(`中字候选(${midWuxing}行${combination.mid}画): ${midCandidates.length}个`);

      const lastCandidates = await this.dataLoader.getWordsByStrokeAndWuxing(
        combination.last,
        lastWuxing,
        config.useTraditional || false
      );
      console.log(`末字候选(${lastWuxing}行${combination.last}画): ${lastCandidates.length}个`);

      // 5. 生成名字组合
      for (const midChar of midCandidates) {
        // 🎯 新增：过滤非通用规范汉字表字符
        if (!this.standardValidator.isStandardCharacter(midChar)) continue;
        
        // 过滤非常用字
        if (!commonWords.has(midChar)) continue;
        
        // 过滤不需要的字
        if (config.avoidedWords?.includes(midChar)) continue;

        for (const lastChar of lastCandidates) {
          // 🎯 新增：过滤非通用规范汉字表字符
          if (!this.standardValidator.isStandardCharacter(lastChar)) continue;
          
          // 过滤非常用字
          if (!commonWords.has(lastChar)) continue;
          
          // 过滤不需要的字
          if (config.avoidedWords?.includes(lastChar)) continue;

          const fullName = config.familyName + midChar + lastChar;
          totalCombinations++;

          // 6. 验证名字的三才五格
          const validation = await this.sancaiCalculator.checkSancaiWuge(
            fullName,
            config.useTraditional || false
          );

          // 7. 应用评分阈值过滤
          const threshold = config.scoreThreshold || DEFAULT_CONFIG.THRESHOLD_SCORE;
          if (validation.score >= threshold) {
            generatedNames.push({
              fullName,
              familyName: config.familyName,
              midChar,
              lastChar,
              grids: validation.grids,
              sancai: validation.sancai,
              score: validation.score,
              explanation: validation.explanation
            });
          }
        }
      }
    }

    console.log(`生成名字总数量：${totalCombinations}`);
    console.log(`符合条件的名字数量：${generatedNames.length}`);

    // 8. 按评分排序
    const sortedNames = generatedNames.sort((a, b) => b.score - a.score);

    // 9. 应用分页配置
    const limit = config.limit || 5; // 默认5个
    const offset = config.offset || 0; // 默认从第0个开始
    
    console.log(`应用分页配置: offset=${offset}, limit=${limit}, 总数=${sortedNames.length}`);
    
    const pagedNames = sortedNames.slice(offset, offset + limit);

    // 10. 生成HTML结果（可选，对应原qiming的功能）
    // 注释掉自动下载功能，避免测试时的困扰
    // if (process.env.NODE_ENV === 'development') {
    //   await this.generateHtmlResult(pagedNames, config);
    // }

    return pagedNames;
  }

  /**
   * 确定五行要求
   * 完全复现qiming/2generate_name.py中的固定五行配置
   */
  private determineWuxingRequirements(config: NameGenerationConfig): {
    midWuxing: WuxingElement;
    lastWuxing: WuxingElement;
  } {
    // 如果有明确的五行偏好，使用偏好设置
    if (config.preferredWuxing && config.preferredWuxing.length >= 2) {
      return {
        midWuxing: config.preferredWuxing[0],
        lastWuxing: config.preferredWuxing[1]
      };
    }

    // 否则使用qiming的固定配置
    // 在qiming/2generate_name.py第28-29行固定设置：
    // mid_wuxing = 'shui'
    // last_wuxing = 'jin'
    return {
      midWuxing: 'shui', // 水
      lastWuxing: 'jin'  // 金
    };
  }

  /**
   * 根据特定五行生成小名
   * 对应qiming/6xiaoming.py的功能
   */
  async generateXiaoming(wuxingSpec: WuxingElement): Promise<string[]> {
    const biHuaMax = 16;
    const wuxingData = await this.dataLoader.loadWuxingDataSimplified();
    
    const wordList: string[] = [];
    
    // 获取指定五行属性的字
    const wuxingChars = wuxingData[wuxingSpec];
    if (wuxingChars) {
      for (const [strokeStr, chars] of Object.entries(wuxingChars)) {
        const strokes = parseInt(strokeStr);
        if (strokes < biHuaMax) {
          wordList.push(...chars);
        }
      }
    }

    // 过滤常用字并加上"小"前缀（小名使用女性常用字，因为更温和亲昵）
    const commonWords = await this.dataLoader.getCommonNameWords('女');
    const nameList: string[] = [];
    
    for (const word of wordList) {
      // 🎯 新增：确保小名用字也符合通用规范汉字表
      if (this.standardValidator.isStandardCharacter(word) && commonWords.has(word)) {
        nameList.push('小' + word);
      }
    }

    console.log(`生成小名数量: ${nameList.length}`);
    return nameList;
  }

  /**
   * 按声调筛选名字
   * 对应qiming/3analysis_name.py的功能
   */
  async filterByTone(
    names: string[],
    targetMidTone: number,
    targetLastTone: number
  ): Promise<{
    filteredNames: string[];
    midCharacters: Set<string>;
    lastCharacters: Set<string>;
  }> {
    const filteredNames: string[] = [];
    const midCharacters = new Set<string>();
    const lastCharacters = new Set<string>();

    console.log(`中间声调：${targetMidTone}，后面声调：${targetLastTone}`);
    console.log(`过滤前名字数量：${names.length}`);

    for (const name of names) {
      if (name.length >= 3) {
        const midChar = name[1];
        const lastChar = name[2];

        const midTone = await this.dataLoader.getTone(midChar);
        const lastTone = await this.dataLoader.getTone(lastChar);

        if (midTone === targetMidTone && lastTone === targetLastTone) {
          filteredNames.push(name);
          midCharacters.add(midChar);
          lastCharacters.add(lastChar);
        }
      }
    }

    console.log(`中间汉字：`, midCharacters);
    console.log(`后面汉字：`, lastCharacters);
    console.log(`过滤后名字数量：${filteredNames.length}`);

    return {
      filteredNames,
      midCharacters,
      lastCharacters
    };
  }

  /**
   * 批量验证名字列表
   * 对应qiming/4check_sancai_wuge.py的功能
   */
  async batchCheckNames(
    nameList: string[],
    useTraditional: boolean = false
  ): Promise<Map<string, any>> {
    const results = new Map();

    for (const name of nameList) {
      console.log(`\n检查名字: ${name}`);
      
              const simplifiedResult = await this.sancaiCalculator.checkSancaiWuge(name, false);
        const traditionalResult = await this.sancaiCalculator.checkSancaiWuge(name, true);

      results.set(name, {
        simplified: simplifiedResult,
        traditional: traditionalResult
      });

      // 输出详细信息（模拟qiming的输出格式）
      console.log(simplifiedResult.explanation);
      if (useTraditional) {
        console.log(traditionalResult.explanation);
      }
    }

    return results;
  }

  /**
   * 随机选择名字
   * 对应qiming/5get-by-god.py的功能
   */
  randomSelectNames(nameList: string[], count: number = 10): string[] {
    const selected: string[] = [];
    
    for (let i = 0; i < count && nameList.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * nameList.length);
      selected.push(nameList[randomIndex]);
    }

    return selected;
  }

  /**
   * 生成HTML结果文件
   * 对应qiming中的HTML生成功能
   */
  private async generateHtmlResult(
    names: GeneratedName[],
    config: NameGenerationConfig
  ): Promise<void> {
    // 只在开发环境下生成，用于调试对比
    if (typeof window === 'undefined') return; // 只在浏览器环境下执行

    const fileName = `generated-names-${config.familyName}-${config.gender}-${Date.now()}`;
    
    // 生成桌面版HTML
    const desktopHtml = this.generateDesktopHtml(names, config);
    this.downloadFile(`${fileName}.html`, desktopHtml);

    // 生成移动版HTML
    const mobileHtml = this.generateMobileHtml(names, config);
    this.downloadFile(`${fileName}-mobile.html`, mobileHtml);

    // 生成CSV文件
    const csvContent = this.generateCsv(names);
    this.downloadFile(`${fileName}.csv`, csvContent);
  }

  /**
   * 生成桌面版HTML
   */
  private generateDesktopHtml(names: GeneratedName[], config: NameGenerationConfig): string {
    const nameRows = names.map(name => `
      <tr>
        <td>${name.fullName}</td>
        <td>${name.score}</td>
        <td>${name.sancai.combination}</td>
        <td>${name.grids.tiange}</td>
        <td>${name.grids.renge}</td>
        <td>${name.grids.dige}</td>
        <td>${name.grids.zongge}</td>
        <td>${name.grids.waige}</td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>生成的名字 - ${config.familyName}${config.gender}</title>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
          th { background-color: #f2f2f2; }
          .high-score { background-color: #e8f5e8; }
        </style>
      </head>
      <body>
        <h1>生成的名字列表</h1>
        <p>姓氏: ${config.familyName} | 性别: ${config.gender} | 总数: ${names.length}</p>
        <table>
          <thead>
            <tr>
              <th>姓名</th>
              <th>评分</th>
              <th>三才</th>
              <th>天格</th>
              <th>人格</th>
              <th>地格</th>
              <th>总格</th>
              <th>外格</th>
            </tr>
          </thead>
          <tbody>
            ${nameRows}
          </tbody>
        </table>
      </body>
      </html>
    `;
  }

  /**
   * 生成移动版HTML
   */
  private generateMobileHtml(names: GeneratedName[], config: NameGenerationConfig): string {
    const nameCards = names.slice(0, 50).map(name => `
      <div class="name-card">
        <h3>${name.fullName}</h3>
        <p>评分: ${name.score} | 三才: ${name.sancai.combination}</p>
        <p>五格: 天${name.grids.tiange} 人${name.grids.renge} 地${name.grids.dige} 总${name.grids.zongge} 外${name.grids.waige}</p>
      </div>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>名字推荐 - ${config.familyName}${config.gender}</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; margin: 10px; background: #f5f5f5; }
          .name-card { 
            background: white; 
            margin: 10px 0; 
            padding: 15px; 
            border-radius: 8px; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          h3 { margin: 0 0 10px 0; color: #333; }
          p { margin: 5px 0; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <h1>名字推荐</h1>
        <p>为 ${config.familyName} 家的 ${config.gender === 'female' ? '女宝宝' : '男宝宝'} 推荐 ${names.length} 个名字</p>
        ${nameCards}
      </body>
      </html>
    `;
  }

  /**
   * 生成CSV文件
   */
  private generateCsv(names: GeneratedName[]): string {
    const headers = ['姓名', '评分', '三才', '天格', '人格', '地格', '总格', '外格'];
    const rows = names.map(name => [
      name.fullName,
      name.score,
      name.sancai.combination,
      name.grids.tiange,
      name.grids.renge,
      name.grids.dige,
      name.grids.zongge,
      name.grids.waige
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  /**
   * 下载文件（浏览器环境）
   */
  private downloadFile(filename: string, content: string): void {
    if (typeof window === 'undefined') return;

    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * 获取生成器状态信息
   */
  getStatus(): Record<string, any> {
    return {
      dataLoaded: this.dataLoader.getLoadStatus(),
      calculatorReady: !!this.sancaiCalculator,
      standardValidator: this.standardValidator.getStats(),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 验证名字是否符合通用规范汉字表要求
   * 提供给外部调用的验证接口
   */
  async validateName(fullName: string): Promise<{
    isValid: boolean;
    invalidChars: string[];
    suggestions: string[];
  }> {
    await this.standardValidator.initialize();
    return this.standardValidator.validateName(fullName);
  }

  /**
   * 分析数据源的标准字符合规性
   * 用于调试和数据质量监控
   */
  async analyzeDataCompliance(): Promise<Record<string, any>> {
    await this.standardValidator.initialize();
    
    const reports: Record<string, any> = {};
    
    // 分析五行字典合规性
    try {
      const wuxingData = await this.dataLoader.loadWuxingDataSimplified();
      const allWuxingChars: string[] = [];
      
      for (const wuxingChars of Object.values(wuxingData)) {
        for (const chars of Object.values(wuxingChars)) {
          if (Array.isArray(chars)) {
            allWuxingChars.push(...chars);
          }
        }
      }
      
      reports.wuxingDict = await this.standardValidator.analyzeDataSource(
        '五行字典(简体)', 
        Array.from(new Set(allWuxingChars))
      );
    } catch (error) {
      console.error('分析五行字典失败:', error);
    }
    
    // 分析常用字合规性
    try {
      const maleCommon = await this.dataLoader.getCommonNameWords('男');
      const femaleCommon = await this.dataLoader.getCommonNameWords('女');
      
      reports.maleCommonWords = await this.standardValidator.analyzeDataSource(
        '男性常用字', 
        Array.from(maleCommon)
      );
      
      reports.femaleCommonWords = await this.standardValidator.analyzeDataSource(
        '女性常用字', 
        Array.from(femaleCommon)
      );
    } catch (error) {
      console.error('分析常用字失败:', error);
    }
    
    return reports;
  }
}