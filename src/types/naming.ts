/**
 * 名字相关类型定义
 */

import { Character, FiveElement } from './character';

// 性别类型
export type Gender = 'male' | 'female' | 'neutral';

// 名字长度类型（单字、双字、三字）
export type NameLength = 1 | 2 | 3;

// 名字偏好类型
export interface NamingPreference {
  // 性别
  gender: Gender;
  // 名字长度（不包括姓）
  nameLength: NameLength;
  // 期望的五行属性
  desiredFiveElements?: FiveElement[];
  // 避免的五行属性
  avoidFiveElements?: FiveElement[];
  // 期望的字义关键词
  meaningKeywords?: string[];
  // 避免的字或字音
  avoidChars?: string[];
  // 出生信息
  birthInfo?: {
    // 出生年份
    year: number;
    // 出生月份
    month: number;
    // 出生日期
    day: number;
    // 出生时辰（可选）
    hour?: number;
  };
  // 姓氏
  familyName: string;
  // 名字风格
  style?: 'traditional' | 'modern' | 'literary' | 'unique' | 'common';
  // 音律偏好
  soundPreference?: 'pingze' | 'alliteration' | 'rhyme' | 'none';
}

// 名字分析维度
export interface NameAnalysis {
  // 五行分析
  fiveElements: {
    // 各字五行
    chars: FiveElement[];
    // 整体五行组合评分
    score: number;
    // 分析说明
    description: string;
  };
  // 音律分析
  pronunciation: {
    // 平仄
    tones: ('平' | '仄')[];
    // 音律评分
    score: number;
    // 分析说明
    description: string;
  };
  // 字义分析
  meaning: {
    // 整体寓意
    overall: string;
    // 寓意评分
    score: number;
    // 详细解释
    details: string[];
  };
  // 五格分析（可选）
  wugeScore?: {
    // 天格
    heaven: number;
    // 人格
    human: number;
    // 地格
    earth: number;
    // 外格
    outer: number;
    // 总格
    total: number;
    // 总体评分
    score: number;
    // 分析说明
    description: string;
  };
  // 生肖喜忌分析（可选）
  zodiacAnalysis?: {
    // 生肖
    zodiac: string;
    // 喜用字分析
    favorableChars: boolean[];
    // 评分
    score: number;
    // 分析说明
    description: string;
  };
  // 八字喜忌分析（如果提供了出生信息）
  bazi?: {
    // 八字
    baziChars: string[];
    // 喜用五行
    favorableElements: FiveElement[];
    // 评分
    score: number;
    // 分析说明
    description: string;
  };
  // 整体评分（满分100）
  overallScore: number;
}

// 生成的名字结果
export interface GeneratedName {
  // 姓氏
  familyName: string;
  // 名字（不含姓）
  givenName: string;
  // 完整名字
  fullName: string;
  // 名字中的汉字信息
  characters: Character[];
  // 名字分析
  analysis: NameAnalysis;
  // 创建时间
  createTime: number;
  // 唯一ID
  id: string;
}

// 名字生成参数
export interface NameGenerationParams extends NamingPreference {
  // 生成数量
  count: number;
  // 最低评分要求（0-100）
  minScore?: number;
  // 是否包含详细分析
  includeAnalysis: boolean;
}
