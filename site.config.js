const site = {
  githubAccount: "dfberry",
  githubRepo: "dfberry.github.io",
  githubBranchName: "main",
  deploymentBranch: "live",
  title: "Dina Berry",
  tagline: "Cloud + web",
  siteUrl: "http://dfberry.github.io", // Doesn't have to be a GitHub site
  copyright: `Copyright © ${new Date().getFullYear()} Dina Berry.`,

  footerLinks: [
    {
      title: "Development",
      items: [
        {
          label: "dfberry (personal)",
          href: "https://github.com/dfberry",
        },
        {
          label: "diberry (Microsoft)",
          href: "https://github.com/diberry",
        },
      ],
    },
    {
      title: "Developer content",
      items: [
        {
          label: "Blog",
          href: "https://dfberry.github.io/",
        },
        {
          label: "Video",
          href: "https://www.youtube.com/@DFBerry-dev",
        },
        {
          label: "Presentations",
          href: "/docs/presentations",
        },
        {
          label: "Archive - Project 31a",
          href: "http://www.31a2ba2a-b718-11dc-8314-0800200c9a66.com/search/label/Dina",
        },
        {
          label: "Microsoft",
          href: "https://learn.microsoft.com/en-us/azure/developer/javascript/",
        },
      ],
    },
    {
      title: "Contact",
      items: [
        {
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/dina-berry-1297a38",
        },
      ],
    },
  ],
  blog: {
    title: "Blog",
    description: "Posts",
    sidebarTitle: "Recent posts",
    sidebarCount: "ALL", // Pick a low number or "All",
    postsPerPage: 3,
    rssFeedOptions: {
      type: "all",
      title: "Dina Berry RSS feed",
      description: "Dina Berry developer and technical writer RSS feed",
      copyright: `Copyright © ${new Date().getFullYear()} Dina Berry.`,
    },
  },
  navbar: {
    title: "Dina Berry",
    items: [
      {
        type: "doc",
        docId: "introduction",
        position: "left",
        label: "Introduction",
      },
      {
        to: "/",
        label: "Blog",
        position: "left",
        type: "dropdown",
        items: [
          { to: "/", label: "Recent" },
          { to: "tags", label: "Tags" },
        ],
      }
    ],
  },
  // announcementBar: {
  //   id: "announcement",
  //   backgroundColor: "#fafbfc",
  //   textColor: "#091E42",
  //   content: `Come join use for a <a href="https://en.wikipedia.org/wiki/Ralphs">party at Ralph's</a>`,
  // },
};

module.exports = site;
