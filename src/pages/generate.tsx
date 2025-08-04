import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NameCard from '@/components/NameCard';
import Layout from '@/components/Layout';
import { useNameGenerator } from '@/hooks/useNameGenerator';

export default function Generate() {
  const router = useRouter();
  const { gender, familyName } = router.query;
  
  const [lastName, setLastName] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('male');
  
  // 初始化状态
  useEffect(() => {
    if (gender && (gender === 'male' || gender === 'female')) {
      setSelectedGender(gender as 'male' | 'female');
    }
    
    if (familyName && typeof familyName === 'string') {
      setLastName(familyName);
    } else {
      setLastName('张'); // 默认姓氏
    }
  }, [gender, familyName]);
  
  // 使用自定义Hook获取名字
  const { 
    names, 
    loading, 
    error, 
    regenerateNames 
  } = useNameGenerator({
    gender: selectedGender,
    familyName: lastName,
    count: 6
  });
  
  // 处理姓氏变更
  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };
  
  // 处理性别变更
  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGender(e.target.value as 'male' | 'female');
  };
  
  const handleNameClick = (name: any) => {
    // 跳转到名字详情页
    router.push(`/name/${name.familyName}-${name.firstName}-${name.secondName}`);
  };
  
  return (
    <Layout
      title={`${selectedGender === 'male' ? '男' : '女'}宝宝名字推荐 - 宝宝取名网`}
      description={`为您的${selectedGender === 'male' ? '男' : '女'}宝宝生成独特而美好的名字`}
    >
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center text-primary-700 mb-8">
          为您的{selectedGender === 'male' ? '男' : '女'}宝宝推荐的名字
        </h1>
        
        <div className="mb-8 flex justify-center space-x-4">
          <div className="flex items-center">
            <span className="mr-2 text-gray-700">姓氏:</span>
            <input
              type="text"
              value={lastName}
              onChange={handleLastNameChange}
              className="border border-gray-300 rounded px-3 py-1 w-16 text-center"
              maxLength={2}
            />
          </div>
          
          <div className="flex items-center">
            <span className="mr-2 text-gray-700">性别:</span>
            <select
              value={selectedGender}
              onChange={handleGenderChange}
              className="border border-gray-300 rounded px-3 py-1"
            >
              <option value="male">男孩</option>
              <option value="female">女孩</option>
            </select>
          </div>
          
          <button
            onClick={regenerateNames}
            disabled={loading}
            className={`px-4 py-1 rounded bg-primary-600 text-white hover:bg-primary-700 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? '生成中...' : '重新生成'}
          </button>
        </div>
        
        {error && (
          <div className="text-center text-red-500 mb-6">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {names.map((name, index) => (
              <NameCard
                key={index}
                familyName={name.familyName}
                givenName={`${name.firstName}${name.secondName}`}
                meaning={name.meaning}
                popularity={name.popularity}
                onClick={() => handleNameClick(name)}
              />
            ))}
          </div>
        )}
        
        <div className="mt-12 text-center">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 rounded-lg border border-primary-600 text-primary-600 hover:bg-primary-50"
          >
            返回首页
          </button>
        </div>
      </div>
    </Layout>
  );
}