const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const site = require('./site.config');


// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(module.exports = {
  title: site.title,
  tagline: site.tagline,
  url: site.siteUrl,
  baseUrl: '/',
  favicon: '/favicon.ico',
  onBrokenLinks: 'throw',
  trailingSlash: false,
  onBrokenMarkdownLinks: 'warn',
  organizationName: site.githubAccount, // Usually your GitHub org/user name.
  projectName: site.githubRepo, // Usually your repo name.

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: `https://github.com/${site.githubAccount}/${site.githubRepo}/edit/${site.githubBranchName}/`,
          routeBasePath: '/docs'
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          routeBasePath: '/',
          blogTitle: site.blog.title,
          blogDescription: site.blog.descripton,
          // editUrl:
          //   'https://github.com/facebook/docusaurus/edit/master/website/blog/',
          path: 'blog',
          blogSidebarCount: site.blog.sidebarCount,
          blogSidebarTitle: site.blog.sidebarTitle,
          postsPerPage: site.blog.postsPerPage,
          feedOptions: site.blog.rssFeedOptions,
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: site.navbar.title,
        hideOnScroll: false,
        items: site.navbar.items
      },
      footer: {
        style: 'dark',
        links: site.footerLinks,
        copyright: site.copyright
      },
      announcementBar: site.announcementBar,
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      feedOptions: site.feedOptions
    }),

  plugins: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        hashed: false,
        indexBlog: true,
        indexDocs: true,
        blogDir: "blog",
        blogRouteBasePath: "/",
        language: 'en',
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 8,
        searchResultContextMaxLength: 50
      },
    ],
  ]
});