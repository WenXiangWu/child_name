import { useState } from 'react';
import Layout from '@/components/Layout';
import { getPoetryNamerInstance } from '@/lib/poetry-namer';

export default function TestPoetry() {
  const [results, setResults] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testPoetryNamer = async () => {
    setLoading(true);
    setResults('开始测试...\n');
    
    try {
      // 测试诗词取名器
      const poetryNamer = getPoetryNamerInstance();
      
      setResults(prev => prev + '✅ 诗词取名器实例创建成功\n');
      
      // 测试生成名字
      const names = await poetryNamer.generateNames({
        familyName: '李',
        gender: 'male',
        nameCount: 3,
        books: ['shijing']
      });
      
      setResults(prev => prev + `✅ 成功生成 ${names.length} 个名字:\n`);
      
      names.forEach((name, index) => {
        setResults(prev => prev + 
          `${index + 1}. ${name.fullName} - 来自《${name.title}》: "${name.sentence}"\n`
        );
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setResults(prev => prev + `❌ 测试失败: ${errorMessage}\n`);
      console.error('测试错误:', error);
    } finally {
      setLoading(false);
    }
  };

  const testAPI = async () => {
    setLoading(true);
    setResults('开始测试API...\n');
    
    try {
      const response = await fetch('/api/generate-poetry-names', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          familyName: '王',
          gender: 'female',
          nameCount: 2,
          books: ['chuci']
        }),
      });
      
      setResults(prev => prev + `📡 API响应状态: ${response.status}\n`);
      
      const data = await response.json();
      
      if (data.success) {
        setResults(prev => prev + `✅ API调用成功，生成 ${data.data.names.length} 个名字:\n`);
        data.data.names.forEach((name: any, index: number) => {
          setResults(prev => prev + 
            `${index + 1}. ${name.fullName} - ${name.meaning.substring(0, 50)}...\n`
          );
        });
      } else {
        setResults(prev => prev + `❌ API调用失败: ${data.error}\n`);
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setResults(prev => prev + `❌ API测试失败: ${errorMessage}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="诗词取名功能测试">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">诗词取名功能测试</h1>
          
          <div className="space-y-4 mb-8">
            <button
              onClick={testPoetryNamer}
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '测试中...' : '测试诗词取名器'}
            </button>
            
            <button
              onClick={testAPI}
              disabled={loading}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? '测试中...' : '测试API接口'}
            </button>
          </div>
          
          <div className="bg-gray-100 rounded-lg p-4">
            <h3 className="font-semibold mb-2">测试结果:</h3>
            <pre className="whitespace-pre-wrap text-sm">
              {results || '点击上方按钮开始测试...'}
            </pre>
          </div>
        </div>
      </div>
    </Layout>
  );
}