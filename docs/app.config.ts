export default defineAppConfig({
  docus: {
    title: 'Vekos',
    description: 'The Future of Verified and Secure Computing',
    image: 'https://user-images.githubusercontent.com/904724/185365452-87b7ca7b-6030-4813-a2db-5e65c785bf88.png',
    socials: {
      github: 'JGiraldo29/vekos',
    },
    github: {
      dir: 'docs',
      branch: 'main',
      repo: 'vekos',
      owner: 'JGiraldo29',
      edit: true
    },
    aside: {
      level: 0,
      collapsed: false,
      exclude: []
    },
    main: {
      padded: true,
      fluid: true
    },
    header: {
      logo: true,
      showLinkIcon: true,
      exclude: [],
      fluid: true
    }
  }
})
