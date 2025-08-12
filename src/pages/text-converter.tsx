import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Converter } from 'opencc-js';

// OpenCC转换器配置
const converters = {
  't2s': { name: '繁体转简体', description: '将繁体中文转换为简体中文' },
  's2t': { name: '简体转繁体', description: '将简体中文转换为繁体中文' },
  't2tw': { name: '繁体转台湾正体', description: '将繁体中文转换为台湾地区惯用词汇' },
  's2tw': { name: '简体转台湾正体', description: '将简体中文转换为台湾地区惯用词汇' },
  't2hk': { name: '繁体转香港繁体', description: '将繁体中文转换为香港地区惯用词汇' },
  's2hk': { name: '简体转香港繁体', description: '将简体中文转换为香港地区惯用词汇' },
  't2jp': { name: '繁体转日式汉字', description: '将繁体中文转换为日式汉字' },
  's2jp': { name: '简体转日式汉字', description: '将简体中文转换为日式汉字' }
};

const TextConverterPage: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [selectedConverter, setSelectedConverter] = useState<string>('s2t');
  const [isLoading, setIsLoading] = useState(false);


  // 转换文本
  const convertText = async () => {
    if (!inputText.trim()) {
      setOutputText('');
      return;
    }

    setIsLoading(true);
    try {
      let result = '';
      
      // 根据选择的转换器进行转换
      switch (selectedConverter) {
        case 't2s':
          result = Converter({ from: 'tw', to: 'cn' })(inputText);
          break;
        case 's2t':
          result = Converter({ from: 'cn', to: 'tw' })(inputText);
          break;
        case 't2tw':
          result = Converter({ from: 'hk', to: 'tw' })(inputText);
          break;
        case 's2tw':
          result = Converter({ from: 'cn', to: 'tw' })(inputText);
          break;
        case 't2hk':
          result = Converter({ from: 'tw', to: 'hk' })(inputText);
          break;
        case 's2hk':
          result = Converter({ from: 'cn', to: 'hk' })(inputText);
          break;
        case 't2jp':
          result = Converter({ from: 'tw', to: 'jp' })(inputText);
          break;
        case 's2jp':
          result = Converter({ from: 'cn', to: 'jp' })(inputText);
          break;
        default:
          result = Converter({ from: 'cn', to: 'tw' })(inputText);
      }
      
      setOutputText(result);
    } catch (error) {
      console.error('转换失败:', error);
      setOutputText('转换失败，请检查输入文本');
    } finally {
      setIsLoading(false);
    }
  };

  // 实时转换
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      convertText();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputText, selectedConverter]);

  // 交换输入输出
  const swapTexts = () => {
    const temp = inputText;
    setInputText(outputText);
    setOutputText(temp);
    
    // 自动调整转换方向
    if (selectedConverter === 's2t') {
      setSelectedConverter('t2s');
    } else if (selectedConverter === 't2s') {
      setSelectedConverter('s2t');
    }
  };

  // 清空文本
  const clearTexts = () => {
    setInputText('');
    setOutputText('');
  };

  // 复制到剪贴板
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('已复制到剪贴板');
    } catch (error) {
      console.error('复制失败:', error);
      alert('复制失败，请手动复制');
    }
  };

  // 预设示例文本
  const exampleTexts = [
    { name: '经典诗句', text: '海内存知己，天涯若比邻。' },
    { name: '现代文学', text: '人生就像一场旅行，不在乎目的地，在乎的是沿途的风景。' },
    { name: '传统文化', text: '君子之交淡如水，小人之交甘若醴。' },
    { name: '现代科技', text: '人工智能将改变我们的生活方式。' }
  ];

  return (
    <>
      <Head>
        <title>简繁体转换 - 宝宝取名专家</title>
        <meta name="description" content="简繁体中文互相转换工具，支持简体中文、繁体中文、台湾正体、香港繁体等多种转换模式" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
        {/* 导航栏 */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-xl font-bold text-gray-800 flex items-center">
                <span className="mr-2">🔄</span>
                简繁体转换
              </Link>
              <Link href="/" className="text-gray-600 hover:text-gray-800 flex items-center">
                <span className="mr-1">🏠</span>
                返回主页
              </Link>
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              简繁体转换工具
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              支持简体中文、繁体中文、台湾正体、香港繁体等多种转换模式，为您的中文文本提供准确的转换服务。
            </p>
          </div>

          {/* 转换器选择 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">⚙️</span>
              转换模式选择
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
              {Object.entries(converters).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setSelectedConverter(key)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                    selectedConverter === key
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300 text-gray-700'
                  }`}
                >
                  <div className="font-medium">{config.name}</div>
                  <div className="text-sm text-gray-500 mt-1">{config.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 转换区域 */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* 输入区域 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">输入文本</h3>
                <div className="flex gap-2">
                  <button
                    onClick={clearTexts}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                  >
                    清空
                  </button>
                </div>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="请输入要转换的文本..."
                className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                style={{ fontFamily: 'serif' }}
              />
              <div className="text-sm text-gray-500 mt-2">
                字符数：{inputText.length}
              </div>
            </div>

            {/* 输出区域 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">转换结果</h3>
                <div className="flex gap-2">
                  <button
                    onClick={swapTexts}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                    title="交换输入输出"
                  >
                    ↔️ 交换
                  </button>
                  <button
                    onClick={() => copyToClipboard(outputText)}
                    disabled={!outputText}
                    className="px-3 py-1 text-sm bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors disabled:opacity-50"
                  >
                    📋 复制
                  </button>
                </div>
              </div>
              <textarea
                value={outputText}
                readOnly
                placeholder="转换结果将显示在这里..."
                className="w-full h-64 p-4 border border-gray-300 rounded-lg bg-gray-50 resize-none"
                style={{ fontFamily: 'serif' }}
              />
              <div className="text-sm text-gray-500 mt-2">
                字符数：{outputText.length}
                {isLoading && <span className="ml-2 text-blue-500">转换中...</span>}
              </div>
            </div>
          </div>

          {/* 示例文本 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📝</span>
              示例文本
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
              {exampleTexts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setInputText(example.text)}
                  className="p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                >
                  <div className="font-medium text-sm text-gray-700">{example.name}</div>
                  <div className="text-xs text-gray-500 mt-1 truncate">{example.text}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 使用说明 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <span className="mr-2">💡</span>
              使用说明
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-blue-800">
              <div>
                <h4 className="font-medium mb-2">转换模式说明：</h4>
                <ul className="space-y-1">
                  <li>• <strong>简体↔繁体：</strong>基础的简繁体转换</li>
                  <li>• <strong>台湾正体：</strong>使用台湾地区惯用词汇</li>
                  <li>• <strong>香港繁体：</strong>使用香港地区惯用词汇</li>
                  <li>• <strong>日式汉字：</strong>转换为日式汉字写法</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">功能特点：</h4>
                <ul className="space-y-1">
                  <li>• 实时转换，输入即转换</li>
                  <li>• 支持大段文本批量转换</li>
                  <li>• 一键复制转换结果</li>
                  <li>• 输入输出快速交换</li>
                  <li>• 提供常用示例文本</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 应用场景 */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🎯</span>
              应用场景
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="text-center">
                <div className="text-2xl mb-2">👶</div>
                <h4 className="font-medium text-gray-800 mb-2">宝宝取名</h4>
                <p className="text-gray-600">将简体名字转换为繁体，了解不同地区的写法</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">📚</div>
                <h4 className="font-medium text-gray-800 mb-2">文档处理</h4>
                <p className="text-gray-600">处理不同地区的中文文档，确保用词准确</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🌐</div>
                <h4 className="font-medium text-gray-800 mb-2">跨地区交流</h4>
                <p className="text-gray-600">适应不同地区的中文表达习惯</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TextConverterPage;
