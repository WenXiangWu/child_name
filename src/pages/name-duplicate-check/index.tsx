import React from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';

// 省份查询信息配置
const provinceData = [
  {
    id: 'national',
    name: '全国',
    url: 'https://zwfw.mps.gov.cn/login.html',
    features: ['需要注册', '每天限查10次', '分男女'],
    description: '公安部"互联网+政务服务"平台，权威全面的全国重名查询',
    icon: '🇨🇳',
    needsRegistration: true,
    needsCaptcha: false,
    separateByGender: true,
    external: true,
    type: 'national'
  },
  {
    id: 'beijing',
    name: '北京市',
    url: 'https://zwfw.gaj.beijing.gov.cn/rkgl/reserve/checkNameSexNum',
    features: ['无需注册', '需要验证码', '分男女'],
    description: '北京市同名查询系统',
    icon: '🏛️',
    needsRegistration: false,
    needsCaptcha: true,
    separateByGender: true,
    external: true,
    type: 'municipality',
    pinyin: 'beijing'
  },
  {
    id: 'shanghai',
    name: '上海市',
    url: 'https://rkglwx.gaj.sh.gov.cn/rkbyw/xsrcm/queryReq/0?flag=1',
    features: ['无需注册', '无需验证码', '不分男女'],
    description: '上海市公安局新生儿重名查询系统，为新生儿家长提供本市户籍人员同名同姓人数服务',
    icon: '🏙️',
    needsRegistration: false,
    needsCaptcha: false,
    separateByGender: false,
    external: true,
    type: 'municipality',
    pinyin: 'shanghai'
  },
  {
    id: 'chongqing',
    name: '重庆市',
    url: 'https://wsga.gaj.cq.gov.cn/webchat/#/name',
    features: ['无需注册', '无需验证码', '不分男女'],
    description: '重庆市重名查询系统',
    icon: '🌃',
    needsRegistration: false,
    needsCaptcha: false,
    separateByGender: false,
    external: true,
    type: 'municipality',
    pinyin: 'chongqing'
  },
  {
    id: 'tianjin',
    name: '天津市',
    url: 'http://wx.ga.tj.gov.cn/WeixinWebapp/Index/search.aspx',
    features: ['需要微信', '需要登录'],
    description: '天津市重名查询系统，必须在微信客户端打开',
    icon: '🌊',
    needsRegistration: true,
    needsCaptcha: false,
    separateByGender: false,
    external: true,
    type: 'municipality',
    pinyin: 'tianjin'
  },
  {
    id: 'anhui',
    name: '安徽省',
    url: 'http://www.ahga.gov.cn:8087/was2/ewt/m/za/uniqename.html',
    features: ['无需注册', '无需验证码', '不分男女'],
    description: '安徽省姓名重名查询系统',
    icon: '🏔️',
    needsRegistration: false,
    needsCaptcha: false,
    separateByGender: false,
    external: true,
    type: 'province',
    pinyin: 'anhui'
  },
  {
    id: 'fujian',
    name: '福建省',
    url: 'http://www.fujian.gov.cn/bmfw/',
    features: ['需要下载闽政通APP'],
    description: '福建省重名查询，需要通过闽政通APP使用',
    icon: '🌊',
    needsRegistration: true,
    needsCaptcha: false,
    separateByGender: false,
    external: true,
    type: 'province',
    pinyin: 'fujian'
  },
  {
    id: 'gansu',
    name: '甘肃省',
    url: 'http://wx.gat.gansu.gov.cn/f/mp/s_10012/h_10172',
    features: ['无需注册', '需要验证码', '分男女', '需要手机号'],
    description: '甘肃省新生儿重名查询系统',
    icon: '🐪',
    needsRegistration: false,
    needsCaptcha: true,
    separateByGender: true,
    external: true,
    type: 'province',
    pinyin: 'gansu'
  },
  {
    id: 'guangdong',
    name: '广东省',
    url: 'http://gdzaj.gd.gov.cn/gdza/web/xsecx/xseqmcx.ignore?type=cmcx',
    features: ['无需注册', '无需验证码', '分男女', '可同时查3个'],
    description: '广东省同名查询系统',
    icon: '🌴',
    needsRegistration: false,
    needsCaptcha: false,
    separateByGender: true,
    external: true,
    type: 'province',
    pinyin: 'guangdong'
  },
  {
    id: 'guangxi',
    name: '广西壮族自治区',
    url: 'http://gafw.gat.gxzf.gov.cn/was/hall/V1/jsp/st/cyc.jsp?type=hz&flag=2',
    features: ['无需注册', '需要验证码', '不分男女'],
    description: '广西公安网上办事服务',
    icon: '🏞️',
    needsRegistration: false,
    needsCaptcha: true,
    separateByGender: false,
    external: true,
    type: 'province',
    pinyin: 'guangxi'
  },
  {
    id: 'guizhou',
    name: '贵州省',
    url: 'https://zwfw.gzga.gov.cn/wechat/#/repeat-name-query',
    features: ['无需注册', '无需验证码', '结果分男女', '功能完善'],
    description: '贵州省重名查询系统，做得最好的省级系统！',
    icon: '⭐',
    needsRegistration: false,
    needsCaptcha: false,
    separateByGender: true,
    external: true,
    type: 'province',
    pinyin: 'guizhou'
  },
  {
    id: 'hainan',
    name: '海南省',
    url: '#',
    features: ['需要关注海南警方公众号'],
    description: '海南省重名查询，通过"海南警方"公众号查询',
    icon: '🏝️',
    needsRegistration: false,
    needsCaptcha: false,
    separateByGender: false,
    external: true,
    type: 'province',
    pinyin: 'hainan'
  },
  {
    id: 'hebei',
    name: '河北省',
    url: '#',
    features: ['暂无统一平台'],
    description: '河北省重名查询，需联系各地市公安部门',
    icon: '🌾',
    needsRegistration: false,
    needsCaptcha: false,
    separateByGender: false,
    external: true,
    type: 'province',
    pinyin: 'hebei'
  },
  {
    id: 'henan',
    name: '河南省',
    url: 'http://bsdt.henanga.gov.cn/MainPages/ChaXunZhongXin/SameNameQuery',
    features: ['无需注册', '需要验证码', '不分男女'],
    description: '河南省重名查询接口',
    icon: '🌾',
    needsRegistration: false,
    needsCaptcha: true,
    separateByGender: false,
    external: true,
    type: 'province',
    pinyin: 'henan'
  },
  {
    id: 'heilongjiang',
    name: '黑龙江省',
    url: 'http://zwfw.hlj.gov.cn/jmopen/webapp/html5/hljscmcx/index.html',
    features: ['无需注册', '需要验证码', '不分男女'],
    description: '黑龙江省重名查询系统',
    icon: '❄️',
    needsRegistration: false,
    needsCaptcha: true,
    separateByGender: false,
    external: true,
    type: 'province',
    pinyin: 'heilongjiang'
  },
  {
    id: 'hubei',
    name: '湖北省',
    url: 'https://wsgaj.chutianyun.gov.cn/weixin/#/renameQuery',
    features: ['湖北公安政务服务平台'],
    description: '湖北公安政务服务平台',
    icon: '🌊',
    needsRegistration: false,
    needsCaptcha: false,
    separateByGender: false,
    external: true,
    type: 'province',
    pinyin: 'hubei'
  },
  {
    id: 'hunan',
    name: '湖南省',
    url: 'https://fwpt.hnga.gov.cn/weixin/#/name',
    features: ['无需注册', '无需验证码', '不分男女'],
    description: '湖南省姓名重名查询系统',
    icon: '🌶️',
    needsRegistration: false,
    needsCaptcha: false,
    separateByGender: false,
    external: true,
    type: 'province',
    pinyin: 'hunan'
  },
  {
    id: 'jilin',
    name: '吉林省',
    url: 'https://gafw.jl.gov.cn/#/query_sear/name-query',
    features: ['无需注册', '需要验证码', '不分男女'],
    description: '吉林省重名查询系统',
    icon: '🌲',
    needsRegistration: false,
    needsCaptcha: true,
    separateByGender: false,
    external: true,
    type: 'province',
    pinyin: 'jilin'
  },
  {
    id: 'jiangsu',
    name: '江苏省',
    url: 'http://www.wjw.jsga.gov.cn/cname/index',
    features: ['无需注册', '无需验证码', '分男女'],
    description: '江苏省重名查询系统',
    icon: '🌊',
    needsRegistration: false,
    needsCaptcha: false,
    separateByGender: true,
    external: true,
    type: 'province',
    pinyin: 'jiangsu'
  },
  {
    id: 'jiangxi',
    name: '江西省',
    url: 'http://ganfutong.jiangxi.gov.cn/jmopen/webapp/html5/jxscmcx/index.html',
    features: ['无需注册', '需验证码', '不分男女'],
    description: '江西省重名查询系统',
    icon: '🍊',
    needsRegistration: false,
    needsCaptcha: true,
    separateByGender: false,
    external: true,
    type: 'province',
    pinyin: 'jiangxi'
  },
  {
    id: 'liaoning',
    name: '辽宁省',
    url: 'https://pc.zwfw.gat.ln.gov.cn/query/item/cm',
    features: ['可展示各地市重名人数'],
    description: '辽宁省重名查询系统，查询结果详细',
    icon: '🏭',
    needsRegistration: false,
    needsCaptcha: false,
    separateByGender: false,
    external: true,
    type: 'province',
    pinyin: 'liaoning'
  },
  {
    id: 'neimenggu',
    name: '内蒙古自治区',
    url: 'http://alipaynmg.nmgmhw.com/nmg/cm/',
    features: ['无需注册登录'],
    description: '内蒙古重名查询系统',
    icon: '🐎',
    needsRegistration: false,
    needsCaptcha: false,
    separateByGender: false,
    external: true,
    type: 'province',
    pinyin: 'neimenggu'
  },
  {
    id: 'ningxia',
    name: '宁夏回族自治区',
    url: 'https://zwfw.gat.nx.gov.cn/wechat/#/repeat-name-query',
    features: ['无需注册', '无需验证码', '不分男女'],
    description: '宁夏重名查询系统',
    icon: '🏜️',
    needsRegistration: false,
    needsCaptcha: false,
    separateByGender: false,
    external: true,
    type: 'province',
    pinyin: 'ningxia'
  },
  {
    id: 'qinghai',
    name: '青海省',
    url: 'http://gat.qinghai.gov.cn/stmhwz/bmfw/toCMCX',
    features: ['无需登录', '无需验证码'],
    description: '青海省阳光警务大厅重名查询',
    icon: '🏔️',
    needsRegistration: false,
    needsCaptcha: false,
    separateByGender: false,
    external: true,
    type: 'province',
    pinyin: 'qinghai'
  },
  {
    id: 'shaanxi',
    name: '陕西省',
    url: 'http://wsbs.shxga.gov.cn/webjjbus/cxzx.jsp?tb_style=4###',
    features: ['需要登录', '需要验证码'],
    description: '陕西"互联网+公安政务服务"平台',
    icon: '🏛️',
    needsRegistration: true,
    needsCaptcha: true,
    separateByGender: false,
    external: true,
    type: 'province',
    pinyin: 'shaanxi'
  },
  {
    id: 'shandong',
    name: '山东省',
    url: 'https://www.sdmsjw.gov.cn/populationclient/search.shtml',
    features: ['无需注册', '需要验证码', '不分男女', '显示地市分布'],
    description: '山东省重名查询系统，功能完善，有各个地市的数量分布',
    icon: '⛰️',
    needsRegistration: false,
    needsCaptcha: true,
    separateByGender: false,
    external: true,
    type: 'province',
    pinyin: 'shandong'
  },
  {
    id: 'shanxi',
    name: '山西省',
    url: 'http://gat.shanxi.gov.cn/#/home',
    features: ['需要登录', '需要验证码'],
    description: '山西省公安厅审批服务"一网通办"平台',
    icon: '⛰️',
    needsRegistration: true,
    needsCaptcha: true,
    separateByGender: false,
    external: true,
    type: 'province',
    pinyin: 'shanxi'
  },
  {
    id: 'sichuan',
    name: '四川省',
    url: 'http://scgazwfw.sczwfw.gov.cn/?convenientService=xinshenger',
    features: ['无需注册', '无需验证码', '不分男女'],
    description: '四川公安政务服务网',
    icon: '🐼',
    needsRegistration: false,
    needsCaptcha: false,
    separateByGender: false,
    external: true,
    type: 'province',
    pinyin: 'sichuan'
  },
  {
    id: 'xinjiang',
    name: '新疆维吾尔自治区',
    url: 'http://puser.xjgat.gov.cn:9001/login',
    features: ['需要登录'],
    description: '新疆重名查询系统',
    icon: '🍇',
    needsRegistration: true,
    needsCaptcha: false,
    separateByGender: false,
    external: true,
    type: 'province',
    pinyin: 'xinjiang'
  },
  {
    id: 'xizang',
    name: '西藏自治区',
    url: '#',
    features: ['暂无统一平台'],
    description: '西藏重名查询，需联系当地公安部门',
    icon: '🏔️',
    needsRegistration: false,
    needsCaptcha: false,
    separateByGender: false,
    external: true,
    type: 'province',
    pinyin: 'xizang'
  },
  {
    id: 'yunnan',
    name: '云南省',
    url: 'http://gazwfw.yn.gov.cn/webchat/#/name',
    features: ['无需注册', '无需验证码', '区分男女'],
    description: '云南省重名查询系统',
    icon: '🌸',
    needsRegistration: false,
    needsCaptcha: false,
    separateByGender: true,
    external: true,
    type: 'province',
    pinyin: 'yunnan'
  },
  {
    id: 'zhejiang',
    name: '浙江省',
    url: 'http://www.hzpolice.gov.cn/weixinWX/Renamecx.aspx',
    features: ['部分地市可查', '如杭州'],
    description: '浙江省重名查询，部分地市提供查询服务',
    icon: '🌊',
    needsRegistration: false,
    needsCaptcha: false,
    separateByGender: false,
    external: true,
    type: 'province',
    pinyin: 'zhejiang'
  },
  {
    id: 'hongkong',
    name: '香港特别行政区',
    url: '#',
    features: ['一国两制', '独立系统'],
    description: '香港特别行政区实行不同的户籍管理制度，需联系香港相关部门查询',
    icon: '🏙️',
    needsRegistration: false,
    needsCaptcha: false,
    separateByGender: false,
    external: false,
    type: 'sar',
    pinyin: 'xianggang'
  },
  {
    id: 'macau',
    name: '澳门特别行政区',
    url: '#',
    features: ['一国两制', '独立系统'],
    description: '澳门特别行政区实行不同的户籍管理制度，需联系澳门相关部门查询',
    icon: '🎰',
    needsRegistration: false,
    needsCaptcha: false,
    separateByGender: false,
    external: false,
    type: 'sar',
    pinyin: 'aomen'
  },
  {
    id: 'taiwan',
    name: '台湾省',
    url: '#',
    features: ['特殊情况', '暂不可查'],
    description: '台湾地区重名查询，需联系台湾相关部门或机构',
    icon: '🏝️',
    needsRegistration: false,
    needsCaptcha: false,
    separateByGender: false,
    external: false,
    type: 'province',
    pinyin: 'taiwan'
  }
];

const NameDuplicateCheckPage: React.FC = () => {
  const handleProvinceClick = (province: typeof provinceData[0]) => {
    if (province.external && province.url !== '#') {
      window.open(province.url, '_blank');
    } else if (province.url === '#') {
      // 对于没有查询链接的区域，显示提示信息
      alert(`${province.name}暂无统一的在线重名查询服务，${province.description}`);
    }
  };

  const getFeatureColor = (feature: string) => {
    if (feature.includes('无需')) return 'text-green-600 bg-green-50';
    if (feature.includes('需要') || feature.includes('需')) return 'text-orange-600 bg-orange-50';
    if (feature.includes('暂无') || feature.includes('特殊')) return 'text-gray-600 bg-gray-50';
    return 'text-blue-600 bg-blue-50';
  };

  // 获取直辖市数据，按拼音排序
  const getMunicipalities = () => {
    return provinceData
      .filter(p => p.type === 'municipality')
      .sort((a, b) => a.pinyin!.localeCompare(b.pinyin!));
  };

  // 获取省份/自治区数据，按拼音排序
  const getProvinces = () => {
    return provinceData
      .filter(p => p.type === 'province')
      .sort((a, b) => a.pinyin!.localeCompare(b.pinyin!));
  };

  // 获取特别行政区数据，按拼音排序
  const getSpecialAdministrativeRegions = () => {
    return provinceData
      .filter(p => p.type === 'sar')
      .sort((a, b) => a.pinyin!.localeCompare(b.pinyin!));
  };

  return (
    <Layout 
      title="重名查询 - 宝宝取名专家"
      description="查询全国及各省份姓名重名情况，为宝宝取名提供参考"
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              全国重名查询
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              选择您的户籍省份，查询姓名重名情况。建议优先使用全国级查询服务，包括重名查询和规范汉字查询，为宝宝取名提供权威参考。
            </p>
          </div>

          {/* 使用说明 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8 border border-blue-100">
            <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
              <span className="mr-2">💡</span>
              使用说明
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h3 className="font-medium mb-2">查询建议：</h3>
                <ul className="space-y-1">
                  <li>• <strong>首选：</strong>国家规范汉字查询（确保用字合规）</li>
                  <li>• <strong>权威：</strong>全国重名查询</li>
                  <li>• <strong>补充：</strong>户籍省份查询</li>
                  <li>• 选择重名较少且规范的名字</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">注意事项：</h3>
                <ul className="space-y-1">
                  <li>• 规范汉字查询：确保取名用字符合国家标准</li>
                  <li>• 全国查询需要注册且有次数限制</li>
                  <li>• 部分省份需要验证码验证</li>
                  <li>• 少于10人的姓名可能不显示具体数量</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 全国级推荐查询 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="mr-2">⭐</span>
              全国级推荐查询
            </h2>
            <div className="grid gap-4">
              {/* 全国重名查询 */}
              <div
                onClick={() => handleProvinceClick(provinceData.find(p => p.id === 'national')!)}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6 cursor-pointer border-2 border-blue-200 hover:border-blue-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-3">🇨🇳</span>
                      <h3 className="text-xl font-semibold text-gray-800">全国重名查询</h3>
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        权威
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">公安部"互联网+政务服务"平台，权威全面的全国重名查询</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 rounded-full text-xs text-orange-600 bg-orange-50">需要注册</span>
                      <span className="px-2 py-1 rounded-full text-xs text-orange-600 bg-orange-50">每天限查10次</span>
                      <span className="px-2 py-1 rounded-full text-xs text-blue-600 bg-blue-50">分男女</span>
                    </div>
                  </div>
                  <div className="text-blue-600 hover:text-blue-800 ml-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 国家规范汉字查询 */}
              <div
                onClick={() => window.open('https://ywtb.mps.gov.cn/newhome/portal/gfhzcx', '_blank')}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6 cursor-pointer border-2 border-amber-200 hover:border-amber-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-3">📝</span>
                      <h3 className="text-xl font-semibold text-gray-800">国家规范汉字查询</h3>
                      <span className="ml-2 px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                        推荐
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">公安部官方平台，查询汉字是否为国家规范汉字，确保取名用字合规</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 rounded-full text-xs text-green-600 bg-green-50">官方权威</span>
                      <span className="px-2 py-1 rounded-full text-xs text-green-600 bg-green-50">免费查询</span>
                      <span className="px-2 py-1 rounded-full text-xs text-blue-600 bg-blue-50">规范用字</span>
                    </div>
                  </div>
                  <div className="text-blue-600 hover:text-blue-800 ml-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 直辖市列表 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="mr-2">🏛️</span>
              直辖市查询
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {getMunicipalities().map((municipality) => (
                <div
                  key={municipality.id}
                  onClick={() => handleProvinceClick(municipality)}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-4 cursor-pointer hover:border-blue-200 border border-gray-100"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-xl mr-2">{municipality.icon}</span>
                        <h3 className="text-lg font-semibold text-gray-800">{municipality.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>{municipality.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {municipality.features.slice(0, 2).map((feature, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 rounded-full text-xs ${getFeatureColor(feature)}`}
                          >
                            {feature}
                          </span>
                        ))}
                        {municipality.features.length > 2 && (
                          <span className="px-2 py-1 rounded-full text-xs text-gray-500 bg-gray-50">
                            +{municipality.features.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-blue-600 hover:text-blue-800 ml-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 特别行政区列表 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="mr-2">🏛️</span>
              特别行政区查询
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getSpecialAdministrativeRegions().map((sar) => (
                <div
                  key={sar.id}
                  onClick={() => handleProvinceClick(sar)}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-4 cursor-pointer hover:border-blue-200 border border-gray-100"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-xl mr-2">{sar.icon}</span>
                        <h3 className="text-lg font-semibold text-gray-800">{sar.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>{sar.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {sar.features.slice(0, 2).map((feature, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 rounded-full text-xs ${getFeatureColor(feature)}`}
                          >
                            {feature}
                          </span>
                        ))}
                        {sar.features.length > 2 && (
                          <span className="px-2 py-1 rounded-full text-xs text-gray-500 bg-gray-50">
                            +{sar.features.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-gray-400 ml-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 省份/自治区列表 */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="mr-2">🗺️</span>
              各省/自治区查询
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getProvinces().map((province) => (
                <div
                  key={province.id}
                  onClick={() => handleProvinceClick(province)}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-4 cursor-pointer hover:border-blue-200 border border-gray-100"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-xl mr-2">{province.icon}</span>
                        <h3 className="text-lg font-semibold text-gray-800">{province.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>{province.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {province.features.slice(0, 2).map((feature, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 rounded-full text-xs ${getFeatureColor(feature)}`}
                          >
                            {feature}
                          </span>
                        ))}
                        {province.features.length > 2 && (
                          <span className="px-2 py-1 rounded-full text-xs text-gray-500 bg-gray-50">
                            +{province.features.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-blue-600 hover:text-blue-800 ml-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 查询技巧 */}
          <div className="mt-12 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🔍</span>
              查询技巧
            </h2>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">对于少于10人的姓名：</h3>
                <p className="mb-2">系统通常不会显示具体数量，可以通过浏览器开发者工具查看：</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>按F12打开开发者工具</li>
                  <li>切换到"网络"(Network)标签</li>
                  <li>查询姓名后查看返回的JSON数据</li>
                  <li>找到"resultRs"字段，即为具体数量</li>
                </ol>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">选择建议：</h3>
                <ul className="space-y-1">
                  <li>• <span className="text-purple-600">全国</span>：最权威但有次数限制</li>
                  <li>• <span className="text-blue-600">规范汉字查询</span>：确保用字合规</li>
                  <li>• <span className="text-green-600">贵州省</span>：省级功能最完善</li>
                  <li>• <span className="text-orange-600">山东省</span>：可查看地市分布</li>
                  <li>• <span className="text-cyan-600">广东省</span>：支持同时查询3个名字</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NameDuplicateCheckPage;
