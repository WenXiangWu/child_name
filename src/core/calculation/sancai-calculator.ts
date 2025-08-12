/**
 * 三才五格计算器
 * 完全复现qiming/helper.py中的核心算法
 */

import { 
  GridCalculation, 
  SancaiResult, 
  StrokeCombination, 
  NameValidationResult,
  WuxingElement 
} from '../common/types';
import { getStaticUrl } from '../../lib/config';
import { 
  GOOD_NUM_SET, 
  BAD_NUM_SET, 
  BEST_NUM_SET,
  getNumberWuxing,
  evaluateNumber,
  getNumberCategories,
  isLuckyNumber 
} from '../common/constants';
import { QimingDataLoader } from '../common/data-loader';

export class SancaiWugeCalculator {

  private dataLoader: QimingDataLoader;

  constructor() {
    this.dataLoader = QimingDataLoader.getInstance();
  }





  /**
   * 获取汉字笔画数
   * 直接使用已预加载的数据，无需重复加载
   */
  async getStrokes(char: string, useTraditional: boolean = false): Promise<number> {
    // 1. 首先尝试从已预加载的xinhua字典获取
    const xinhuaDict = this.dataLoader.getXinhuaDict();
    if (xinhuaDict && xinhuaDict.has(char)) {
      const xinhuaInfo = xinhuaDict.get(char)!;
      return useTraditional ? xinhuaInfo.strokes.traditional : xinhuaInfo.strokes.simplified;
    }
    
    // 2. 回退到word-chunks获取笔画信息（按需加载）
    try {
      const charInfo = await this.dataLoader.getCharacterInfo(char);
      if (charInfo && charInfo.strokes) {
        // word-chunks中的strokes是字符串，例如："8" 或可能包含其他格式
        const strokesStr = String(charInfo.strokes);
        
        // 尝试解析数字
        const strokeCount = parseInt(strokesStr.replace(/[^\d]/g, ''));
        if (!isNaN(strokeCount) && strokeCount > 0) {
          return strokeCount;
        }
      }
    } catch (error) {
      console.debug(`从word-chunks获取"${char}"笔画数据失败:`, error);
    }
    
    // 3. 最后使用估算值
    console.warn(`未找到字符 "${char}" 的笔画数据，使用估算值`);
    return this.getEstimatedStrokes(char);
  }
  
  /**
   * 基于字符编码估算笔画数
   */
  private getEstimatedStrokes(char: string): number {
    // 基于常见汉字笔画分布的简单估算
    const code = char.charCodeAt(0);
    
    // 常见汉字Unicode范围的笔画估算
    if (code >= 0x4e00 && code <= 0x9fff) {
      // 基于字符编码的更合理估算
      const offset = code - 0x4e00;
      // 大部分汉字笔画在5-15画之间，按比例分布
      return Math.floor((offset % 15) + 5);
    }
    
    // 其他字符的简单估算
    return (code % 20) + 1;
  }

  /**
   * 计算五格
   * 完全复现qiming的计算逻辑
   */
  async calculateGrids(
    familyName: string, 
    firstName: string, 
    lastName: string, 
    useTraditional: boolean = false
  ): Promise<GridCalculation> {
    const familyStrokes = await this.getStrokes(familyName, useTraditional);
    const firstStrokes = await this.getStrokes(firstName, useTraditional);
    const lastStrokes = await this.getStrokes(lastName, useTraditional);

    return {
      tiange: familyStrokes + 1,  // 天格 = 姓氏笔画 + 1
      renge: familyStrokes + firstStrokes,  // 人格 = 姓氏笔画 + 名字第一字笔画
      dige: firstStrokes + lastStrokes,     // 地格 = 名字第一字笔画 + 名字第二字笔画
      zongge: familyStrokes + firstStrokes + lastStrokes,  // 总格 = 所有笔画之和
      waige: familyStrokes + firstStrokes + lastStrokes - (familyStrokes + firstStrokes) + 1  // 外格 = 总格 - 人格 + 1
    };
  }

  /**
   * 计算三才
   * 对应qiming/helper.py中的getSancaiWuxing和calSancai函数
   */
  async calculateSancai(grids: GridCalculation): Promise<SancaiResult> {
    // 通过五格的个位数确定五行属性
    const heaven = getNumberWuxing(grids.tiange) as WuxingElement;
    const human = getNumberWuxing(grids.renge) as WuxingElement;
    const earth = getNumberWuxing(grids.dige) as WuxingElement;

    const combination = `${heaven}-${human}-${earth}`;
    
    // 直接使用已预加载的三才规则
    const sancaiRules = this.dataLoader.getSancaiRules();
    const rule = sancaiRules?.get(combination);

    // 严格按照qiming逻辑：如果没有找到规则，说明组合不吉利，应该被过滤
    if (!rule) {
      return {
        heaven,
        human,
        earth,
        combination: `${this.getWuxingChinese(heaven)}${this.getWuxingChinese(human)}${this.getWuxingChinese(earth)}`,
        level: 'unknown',
        description: '结果未知'
      };
    }

    return {
      heaven,
      human,
      earth,
      combination: `${this.getWuxingChinese(heaven)}${this.getWuxingChinese(human)}${this.getWuxingChinese(earth)}`,
      level: rule.level,
      description: rule.description
    };
  }

  /**
   * 五行转中文显示
   */
  private getWuxingChinese(wuxing: WuxingElement): string {
    const map = {
      jin: '金',
      mu: '木',
      shui: '水',
      huo: '火',
      tu: '土'
    };
    return map[wuxing] || '未知';
  }

  /**
   * 获取最佳笔画组合
   * 完全复现qiming/helper.py中的get_best_ge_bihua函数
   */
  async getBestStrokeCombinations(
    familyName: string, 
    useTraditional: boolean = false, 
    specificBest: boolean = false
  ): Promise<StrokeCombination[]> {
    const familyStrokes = await this.getStrokes(familyName, useTraditional);
    const validCombinations: StrokeCombination[] = [];


    // 遍历可能的笔画组合 (2-20画，与qiming保持一致)
    // 对应qiming的MIN_SINGLE_NUM=2, MAX_SINGLE_NUM=20
    console.log(`[SanCai] 开始遍历笔画组合，范围：2-20画，预计${19*19}种组合`);
    let checkedCount = 0;
    for (let midStrokes = 2; midStrokes <= 20; midStrokes++) {
      for (let lastStrokes = 2; lastStrokes <= 20; lastStrokes++) {
        checkedCount++;
        if (checkedCount % 50 === 0) {
          console.log(`[SanCai] 已检查${checkedCount}种组合，当前有效组合数：${validCombinations.length}`);
        }
        const grids = {
          tiange: familyStrokes + 1,
          renge: familyStrokes + midStrokes,
          dige: midStrokes + lastStrokes,
          zongge: familyStrokes + midStrokes + lastStrokes,
          waige: familyStrokes + midStrokes + lastStrokes - (familyStrokes + midStrokes) + 1
        };

        // 检查人格是否为吉数
        if (!isLuckyNumber(grids.renge)) continue;

        // 检查地格是否为吉数
        if (!isLuckyNumber(grids.dige)) continue;

        // 检查总格是否为吉数
        if (!isLuckyNumber(grids.zongge)) continue;

        // 检查外格是否为吉数
        if (!isLuckyNumber(grids.waige)) continue;

        // 检查三才是否为吉 - 完全复现qiming的筛选条件
        const sancai = await this.calculateSancai(grids);
        
        // 使用已预加载的三才规则
        const sancaiRules = this.dataLoader.getSancaiRules();
        const rule = sancaiRules?.get(`${sancai.heaven}-${sancai.human}-${sancai.earth}`);
        
        // 1. 不能包含'凶'字符 (对应 if '凶' in sancai_result)
        // 注意：应该检查result字段，不是description字段
        if (rule?.result && rule.result.includes('凶')) {
          continue;
        }
        
        // 2. 不能是结果未知 (对应 sancai_result == constants.RESULT_UNKNOWN)
        if (!rule || sancai.level === 'unknown') {
          continue;
        }
        
        // 3. 必须在指定的三才范围内 (对应 config.SELECTED_SANCAI = ['大吉', '中吉', '吉'])
        const selectedSancai = ['大吉', '中吉', '吉']; // 对应qiming的['大吉', '中吉', '吉']
        if (!selectedSancai.includes(rule.result)) {
          continue;
        }
        
        validCombinations.push({ mid: midStrokes, last: lastStrokes });
      }
    }
    
    console.log(`[SanCai] 笔画组合遍历完成，总共检查${checkedCount}种组合，找到${validCombinations.length}种有效组合`);
    return validCombinations;
  }

  /**
   * 验证姓名的三才五格
   * 对应qiming中的check_sancai_wuge函数
   */
  async checkSancaiWuge(
    fullName: string, 
    useTraditional: boolean = false
  ): Promise<NameValidationResult> {
    if (fullName.length < 2 || fullName.length > 4) {
      return {
        isValid: false,
        grids: { tiange: 0, renge: 0, dige: 0, zongge: 0, waige: 0 },
        sancai: { 
          heaven: 'jin', 
          human: 'jin', 
          earth: 'jin', 
          combination: '', 
          level: 'xiong', 
          description: '名字长度不正确' 
        },
        score: 0,
        issues: ['名字长度必须是2-4个字符'],
        explanation: '无效姓名'
      };
    }

    const familyName = fullName[0];
    const firstName = fullName[1] || '';
    const lastName = fullName[2] || '';

    // 计算五格
    const grids = await this.calculateGrids(familyName, firstName, lastName, useTraditional);
    
    // 计算三才
    const sancai = await this.calculateSancai(grids);

    // 评估各格
    const issues: string[] = [];
    let score = 0;

    // 检查天格
    const tiangeEval = evaluateNumber(grids.tiange);
    if (tiangeEval === '大吉') score += 20;
    else if (tiangeEval === '次吉') score += 15;
    else if (tiangeEval === '凶') issues.push(`天格${grids.tiange}为凶数`);

    // 检查人格
    const rengeEval = evaluateNumber(grids.renge);
    if (rengeEval === '大吉') score += 25;
    else if (rengeEval === '次吉') score += 20;
    else if (rengeEval === '凶') {
      issues.push(`人格${grids.renge}为凶数`);
      score -= 10;
    }

    // 检查地格
    const digeEval = evaluateNumber(grids.dige);
    if (digeEval === '大吉') score += 25;
    else if (digeEval === '次吉') score += 20;
    else if (digeEval === '凶') {
      issues.push(`地格${grids.dige}为凶数`);
      score -= 10;
    }

    // 检查总格
    const zonggeEval = evaluateNumber(grids.zongge);
    if (zonggeEval === '大吉') score += 20;
    else if (zonggeEval === '次吉') score += 15;
    else if (zonggeEval === '凶') {
      issues.push(`总格${grids.zongge}为凶数`);
      score -= 5;
    }

    // 检查外格
    const waigeEval = evaluateNumber(grids.waige);
    if (waigeEval === '大吉') score += 10;
    else if (waigeEval === '次吉') score += 8;
    else if (waigeEval === '凶') {
      issues.push(`外格${grids.waige}为凶数`);
      score -= 5;
    }

    // 三才评分
    if (sancai.level === 'da_ji') score += 20;
    else if (sancai.level === 'zhong_ji') score += 15;
    else if (sancai.level === 'ji') score += 10;
    else if (sancai.level === 'xiong') {
      score -= 15;
      issues.push('三才配置不佳');
    }

    // 确保分数在合理范围内
    score = Math.max(0, Math.min(100, score));

    const explanation = this.generateExplanation(fullName, grids, sancai, useTraditional);

    return {
      isValid: issues.length === 0 && score >= 60,
      grids,
      sancai,
      score,
      issues,
      explanation
    };
  }

  /**
   * 生成详细解释
   */
  private generateExplanation(
    fullName: string, 
    grids: GridCalculation, 
    sancai: SancaiResult, 
    useTraditional: boolean
  ): string {
    const strokeType = useTraditional ? '繁体' : '简体';
    
    let explanation = `${fullName}-${strokeType}笔画计算：\n`;
    explanation += `天格：${grids.tiange} 【${evaluateNumber(grids.tiange)}】\n`;
    explanation += `人格：${grids.renge} 【${evaluateNumber(grids.renge)}】\n`;
    explanation += `地格：${grids.dige} 【${evaluateNumber(grids.dige)}】\n`;
    explanation += `总格：${grids.zongge} 【${evaluateNumber(grids.zongge)}】\n`;
    explanation += `外格：${grids.waige} 【${evaluateNumber(grids.waige)}】\n`;
    explanation += `${sancai.combination} ${this.getSancaiLevelText(sancai.level)} ${sancai.description}`;

    return explanation;
  }

  /**
   * 获取三才等级的中文描述
   */
  private getSancaiLevelText(level: string): string {
    const map: Record<string, string> = {
      'da_ji': '大吉',
      'zhong_ji': '中吉', 
      'ji': '吉',
      'xiong': '凶',
      'da_xiong': '大凶'
    };
    return map[level] || '未知';
  }



  /**
   * 批量检查名字
   * 对应qiming中的批量检查功能
   */
  async batchCheck(names: string[]): Promise<Map<string, NameValidationResult>> {
    const results = new Map<string, NameValidationResult>();
    
    for (const name of names) {
      const result = await this.checkSancaiWuge(name, false);
      results.set(name, result);
    }
    
    return results;
  }
}