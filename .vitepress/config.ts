import { defineConfig } from 'vitepress'

export default defineConfig({
  // 站点标题
  title: '磊科产品技术中心',
  // 站点描述
  description: '磊科 Netcore 产品技术知识库 - 售后工程师、渠道商、终端用户技术支持',

  // 最后更新时间
  lastUpdated: true,

  // 清理URL（去掉 .html 后缀）
  cleanUrls: true,

  // 站点级配置
  head: [
    // 移动端优化
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  ],

  // 主题配置
  themeConfig: {
    // 站点 logo（如有可替换）
    // logo: '/logo.png',

    // 顶部导航栏
    nav: [
      {
        text: '产品中心',
        link: '/01-产品中心/',
      },
      {
        text: '快速配置',
        link: '/02-快速配置/',
      },
      {
        text: '高级功能',
        link: '/03-高级功能/',
      },
      {
        text: '故障排查',
        link: '/04-故障排查/',
      },
      {
        text: '常见问题FAQ',
        link: '/05-常见问题FAQ',
      },
    ],

    // 侧边栏
    sidebar: {
      // 产品中心
      '/01-产品中心/': [
        {
          text: '产品中心',
          items: [
            { text: '概览', link: '/01-产品中心/' },
            { text: '家用无线路由器', link: '/01-产品中心/家用无线路由器' },
            { text: '企业级路由器', link: '/01-产品中心/企业级路由器' },
            { text: '无线AP与组网', link: '/01-产品中心/无线AP与组网' },
            { text: '交换机与POE供电', link: '/01-产品中心/交换机与POE供电' },
          ],
        },
      ],
      // 快速配置
      '/02-快速配置/': [
        {
          text: '快速配置',
          items: [
            { text: '概览', link: '/02-快速配置/' },
            { text: '登录与上网设置', link: '/02-快速配置/登录与上网设置' },
            { text: '无线桥接与中继', link: '/02-快速配置/无线桥接与中继' },
          ],
        },
      ],
      // 高级功能
      '/03-高级功能/': [
        {
          text: '高级功能',
          items: [
            { text: '概览', link: '/03-高级功能/' },
            { text: 'IPTV与IPv6', link: '/03-高级功能/IPTV与IPv6' },
            { text: 'Mesh组网与微信绑定', link: '/03-高级功能/Mesh组网与微信绑定' },
            { text: '固件升级', link: '/03-高级功能/固件升级' },
          ],
        },
      ],
      // 故障排查
      '/04-故障排查/': [
        {
          text: '故障排查',
          items: [
            { text: '概览', link: '/04-故障排查/' },
            { text: '常见故障排查', link: '/04-故障排查/常见故障排查' },
          ],
        },
      ],
    },

    // 搜索
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档',
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            },
          },
        },
      },
    },

    // 大纲标题（右侧目录）
    outline: {
      label: '本页目录',
      level: [2, 3],
    },

    // 文档页脚（上一页/下一页）
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

    // 最后更新时间标签
    lastUpdatedText: '最后更新',

    // 返回顶部
    returnToTopLabel: '返回顶部',

    // 侧边栏标签
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',

    // 社交链接
    socialLinks: [
      // 如有官网可添加
      // { icon: 'github', link: 'https://github.com/netcore' }
    ],

    // 页脚
    footer: {
      message: '磊科 Netcore 产品技术知识库',
      copyright: '技术支持热线：400-810-1616',
    },

    // 编辑链接（可选）
    // editLink: {
    //   pattern: 'https://github.com/your-repo/edit/main/docs',
    //   text: '在 GitHub 上编辑此页',
    // },
  },
})
