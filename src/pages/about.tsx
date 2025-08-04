import Layout from '@/components/Layout';

export default function About() {
  return (
    <Layout
      title="关于我们 - 宝宝取名网"
      description="了解宝宝取名网的理念、服务和团队"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-primary-700 mb-8">
            关于宝宝取名网
          </h1>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">我们的理念</h2>
              <p className="text-gray-700 mb-4">
                宝宝取名网致力于帮助父母为宝宝找到一个有意义、吉祥的好名字。我们相信，名字不仅仅是一个称呼，更是父母对孩子的期望和祝福，是孩子一生的精神印记。
              </p>
              <p className="text-gray-700">
                我们结合传统文化与现代审美，通过科学的分析方法，为每个宝宝提供独特而美好的名字选择，让宝宝的名字既有文化内涵，又符合当代社会的审美需求。
              </p>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">我们的服务</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-5 rounded-lg">
                  <h3 className="text-lg font-medium text-primary-700 mb-2">智能取名</h3>
                  <p className="text-gray-700">
                    根据宝宝的性别、姓氏等信息，智能生成符合音律和谐、寓意美好的名字选择。
                  </p>
                </div>
                
                <div className="bg-blue-50 p-5 rounded-lg">
                  <h3 className="text-lg font-medium text-primary-700 mb-2">名字分析</h3>
                  <p className="text-gray-700">
                    提供名字的含义解释、流行度分析、五行属性等多维度分析，帮助父母全面了解名字。
                  </p>
                </div>
                
                <div className="bg-blue-50 p-5 rounded-lg">
                  <h3 className="text-lg font-medium text-primary-700 mb-2">个性化定制</h3>
                  <p className="text-gray-700">
                    根据父母的特殊需求，提供个性化的名字定制服务，满足不同家庭的需求。
                  </p>
                </div>
                
                <div className="bg-blue-50 p-5 rounded-lg">
                  <h3 className="text-lg font-medium text-primary-700 mb-2">文化传承</h3>
                  <p className="text-gray-700">
                    融合中华传统文化元素，让名字既有现代感，又能传承文化精髓。
                  </p>
                </div>
              </div>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">我们的团队</h2>
              <p className="text-gray-700 mb-4">
                我们的团队由语言学专家、命名学研究者、数据分析师和软件工程师组成，致力于将传统文化与现代科技相结合，为父母提供专业的取名服务。
              </p>
              <p className="text-gray-700">
                团队成员均有丰富的行业经验，对中华文化有深入的研究，对现代命名趋势有敏锐的洞察力。
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">联系我们</h2>
              <p className="text-gray-700 mb-4">
                如果您有任何问题、建议或合作意向，欢迎随时与我们联系。
              </p>
              <div className="bg-gray-50 p-5 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">邮箱：</span> contact@babyname.example.com
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">电话：</span> 400-123-4567
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">地址：</span> 中国北京市海淀区科技园区88号
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}