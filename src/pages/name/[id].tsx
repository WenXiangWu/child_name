import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { nameRecommendations } from '@/data/names';
import { getFiveElements, getPersonalityTraits, getStrokeCount } from '@/utils/nameAnalysis';

interface NameDetail {
  familyName: string;
  firstName: string;
  secondName: string;
  fullName: string;
  meaning: string;
  gender: 'male' | 'female';
  popularity: number;
  strokes?: number;
  fiveElements?: string[];
  characteristics?: string[];
}

export default function NameDetail() {
  const router = useRouter();
  const { id } = router.query;
  
  const [nameDetail, setNameDetail] = useState<NameDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    if (!id) return;
    
    // 模拟从API获取名字详情
    // 实际项目中应该从后端API获取
    setTimeout(() => {
      // 解析ID格式：familyName-firstName-secondName
      const parts = (id as string).split('-');
      if (parts.length !== 3) {
        router.push('/404');
        return;
      }
      
      const [familyName, firstName, secondName] = parts;
      
      // 查找名字组合
      const nameCombo = nameRecommendations.find(
        name => name.firstName === firstName && name.secondName === secondName
      );
      
      if (!nameCombo) {
        router.push('/404');
        return;
      }
      
      const fullName = `${familyName}${firstName}${secondName}`;
      
      setNameDetail({
        familyName,
        firstName,
        secondName,
        fullName,
        meaning: nameCombo.meaning,
        gender: nameCombo.gender,
        popularity: nameCombo.popularity,
        strokes: getStrokeCount(fullName),
        fiveElements: getFiveElements(fullName),
        characteristics: getPersonalityTraits(fullName, nameCombo.gender)
      });
      
      setLoading(false);
    }, 1000);
  }, [id, router]);
  
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }
  
  if (!nameDetail) {
    return null;
  }
  
  const getPopularityText = (score: number) => {
    if (score < 30) return '较为少见，独特有个性';
    if (score < 60) return '常见度适中，既不会太大众也不会太小众';
    return '较为常见，典型且易于接受';
  };
  
  return (
    <Layout
      title={`${nameDetail.fullName} - 名字详情 | 宝宝取名网`}
      description={`${nameDetail.fullName}名字详情解析，${nameDetail.meaning}`}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link href="/generate" className="text-primary-600 hover:text-primary-800">
              ← 返回名字列表
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className={`py-8 px-6 text-center ${
              nameDetail.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'
            }`}>
              <h1 className="text-4xl font-bold text-white mb-2">
                {nameDetail.familyName}
                <span className="text-yellow-200">{nameDetail.firstName}</span>
                <span className="text-yellow-200">{nameDetail.secondName}</span>
              </h1>
              <p className="text-white text-opacity-90">{nameDetail.meaning}</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">名字分析</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-700">名字含义</h3>
                      <p className="text-gray-600">{nameDetail.meaning}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-700">流行度</h3>
                      <div className="flex items-center mt-1">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              nameDetail.gender === 'male' ? 'bg-blue-600' : 'bg-pink-500'
                            }`} 
                            style={{ width: `${nameDetail.popularity}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-600">{nameDetail.popularity}%</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{getPopularityText(nameDetail.popularity)}</p>
                    </div>
                    
                    {nameDetail.strokes && (
                      <div>
                        <h3 className="font-medium text-gray-700">总笔画</h3>
                        <p className="text-gray-600">{nameDetail.strokes}画</p>
                      </div>
                    )}
                    
                    {nameDetail.fiveElements && (
                      <div>
                        <h3 className="font-medium text-gray-700">五行属性</h3>
                        <div className="flex space-x-2 mt-1">
                          {nameDetail.fiveElements.map((element, index) => (
                            <span 
                              key={index}
                              className={`px-2 py-1 rounded text-sm ${
                                element === '金' ? 'bg-yellow-100 text-yellow-800' :
                                element === '木' ? 'bg-green-100 text-green-800' :
                                element === '水' ? 'bg-blue-100 text-blue-800' :
                                element === '火' ? 'bg-red-100 text-red-800' :
                                'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {element}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">性格特点</h2>
                  
                  {nameDetail.characteristics && (
                    <ul className="space-y-2">
                      {nameDetail.characteristics.map((trait, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-primary-500 mr-2">•</span>
                          <span className="text-gray-600">{trait}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  <div className="mt-8">
                    <h3 className="font-medium text-gray-700 mb-2">适合的职业方向</h3>
                    <div className="flex flex-wrap gap-2">
                      {nameDetail.gender === 'male' ? (
                        <>
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">管理</span>
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">科技</span>
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">金融</span>
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">教育</span>
                        </>
                      ) : (
                        <>
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">艺术</span>
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">教育</span>
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">医疗</span>
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">设计</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 pt-6 border-t border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">名人同名</h2>
                <p className="text-gray-600">暂无相关名人信息</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link 
              href="/generate" 
              className="px-6 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700"
            >
              查看更多名字
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}