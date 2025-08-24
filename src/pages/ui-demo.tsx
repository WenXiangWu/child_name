import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button, Input, Card, Loading, useToast, ToastProvider } from '@/components/ui';

const UIDemo: React.FC = () => {
  return (
    <ToastProvider>
      <UIDemoContent />
    </ToastProvider>
  );
};

const UIDemoContent: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleShowToast = (type: 'success' | 'error' | 'warning' | 'info') => {
    const messages = {
      success: { title: '操作成功', message: '名字已成功生成并保存到收藏夹' },
      error: { title: '操作失败', message: '请检查网络连接后重试' },
      warning: { title: '注意', message: '该名字可能与他人重名，建议谨慎选择' },
      info: { title: '提示', message: '您还可以查看更多相关的名字推荐' }
    };
    
    addToast({
      type,
      ...messages[type],
      duration: 4000
    });
  };

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <Layout 
      title="UI组件演示 - 宝宝取名专家"
      description="展示重构后的UI组件库"
      showMobileNav={false}
    >
      <div className="min-h-screen bg-cultural-gradient py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-heading text-cultural-ink mb-4">
              UI组件演示
            </h1>
            <p className="text-xl text-gray-600">
              展示重构后的传统文化风格UI组件
            </p>
          </div>

          <div className="space-y-12">
            {/* 按钮组件 */}
            <Card variant="cultural" padding="lg">
              <h2 className="text-2xl font-bold font-heading text-cultural-ink mb-6">按钮组件</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">按钮变体</h3>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="primary">主要按钮</Button>
                    <Button variant="secondary">次要按钮</Button>
                    <Button variant="cultural">文化按钮</Button>
                    <Button variant="ghost">幽灵按钮</Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">按钮尺寸</h3>
                  <div className="flex flex-wrap items-center gap-4">
                    <Button size="sm">小按钮</Button>
                    <Button size="md">中按钮</Button>
                    <Button size="lg">大按钮</Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">按钮状态</h3>
                  <div className="flex flex-wrap gap-4">
                    <Button>正常状态</Button>
                    <Button disabled>禁用状态</Button>
                    <Button loading>加载状态</Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* 输入组件 */}
            <Card variant="cultural" padding="lg">
              <h2 className="text-2xl font-bold font-heading text-cultural-ink mb-6">输入组件</h2>
              <div className="space-y-6 max-w-md">
                <Input
                  label="基础输入框"
                  placeholder="请输入内容"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                
                <Input
                  label="必填输入框"
                  placeholder="请输入姓氏"
                  required
                  leftIcon={<span>👤</span>}
                />
                
                <Input
                  label="日期输入框"
                  type="date"
                  helperText="选择宝宝的出生日期"
                />
                
                <Input
                  label="错误状态"
                  placeholder="输入内容"
                  error="请输入有效的姓氏"
                />
              </div>
            </Card>

            {/* 卡片组件 */}
            <Card variant="cultural" padding="lg">
              <h2 className="text-2xl font-bold font-heading text-cultural-ink mb-6">卡片组件</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card variant="default" padding="md">
                  <h3 className="font-semibold mb-2">默认卡片</h3>
                  <p className="text-gray-600 text-sm">这是一个默认样式的卡片</p>
                </Card>
                
                <Card variant="cultural" padding="md">
                  <h3 className="font-semibold mb-2">文化卡片</h3>
                  <p className="text-gray-600 text-sm">带有传统文化风格的卡片</p>
                </Card>
                
                <Card variant="elevated" padding="md">
                  <h3 className="font-semibold mb-2">悬浮卡片</h3>
                  <p className="text-gray-600 text-sm">具有更强阴影效果的卡片</p>
                </Card>
                
                <Card variant="bordered" padding="md" hover>
                  <h3 className="font-semibold mb-2">边框卡片</h3>
                  <p className="text-gray-600 text-sm">带边框和悬停效果的卡片</p>
                </Card>
              </div>
            </Card>

            {/* 加载组件 */}
            <Card variant="cultural" padding="lg">
              <h2 className="text-2xl font-bold font-heading text-cultural-ink mb-6">加载组件</h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">加载样式</h3>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                      <Loading variant="spinner" text="加载中..." />
                    </div>
                    <div className="text-center">
                      <Loading variant="dots" text="处理中..." />
                    </div>
                    <div className="text-center">
                      <Loading variant="cultural" text="正在生成名字" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Button onClick={handleLoadingDemo} disabled={isLoading}>
                    {isLoading ? '加载中...' : '演示加载效果'}
                  </Button>
                  {isLoading && (
                    <div className="mt-4">
                      <Loading variant="cultural" text="正在生成名字" />
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* 提示组件 */}
            <Card variant="cultural" padding="lg">
              <h2 className="text-2xl font-bold font-heading text-cultural-ink mb-6">提示组件</h2>
              <div className="space-y-4">
                <p className="text-gray-600 mb-4">点击按钮查看不同类型的提示消息</p>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    variant="primary" 
                    onClick={() => handleShowToast('success')}
                  >
                    成功提示
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={() => handleShowToast('error')}
                  >
                    错误提示
                  </Button>
                  <Button 
                    variant="cultural" 
                    onClick={() => handleShowToast('warning')}
                  >
                    警告提示
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleShowToast('info')}
                  >
                    信息提示
                  </Button>
                </div>
              </div>
            </Card>

            {/* 设计系统说明 */}
            <Card variant="cultural" padding="lg">
              <h2 className="text-2xl font-bold font-heading text-cultural-ink mb-6">设计系统特色</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">传统文化色彩</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-cultural-red rounded-full"></div>
                      <span>中国红 - 热情喜庆</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-cultural-gold rounded-full"></div>
                      <span>金黄色 - 富贵吉祥</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-cultural-jade rounded-full"></div>
                      <span>翡翠绿 - 生机盎然</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-cultural-ink rounded-full"></div>
                      <span>墨色 - 深沉内敛</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">设计原则</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• 传统与现代的完美融合</li>
                    <li>• 高对比度确保可访问性</li>
                    <li>• 一致的视觉语言</li>
                    <li>• 优雅的动画过渡</li>
                    <li>• 响应式设计适配</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UIDemo;
