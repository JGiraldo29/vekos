export interface NuxtCustomSchema {
 appConfig?: {
  /**
   * Nuxt Icon
   * 
   * Configure the defaults of Nuxt Icon
   * 
  */
  nuxtIcon?: {
   /**
    * Icon Size
    * 
    * Set the default icon size. Set to false to disable the sizing of icon in style.
    * 
    * @default "1em"
    * 
    * @studioIcon material-symbols:format-size-rounded
   */
   size?: string | false,

   /**
    * CSS Class
    * 
    * Set the default CSS class
    * 
    * @default ""
    * 
    * @studioIcon material-symbols:css
   */
   class?: string,

   /**
    * Icon aliases
    * 
    * Define Icon aliases to update them easily without code changes.
    * 
    * 
    * @studioIcon material-symbols:star-rounded
    * 
    * @studioInputObjectValueType icon
   */
   aliases?: { [alias: string]: string },
  },

  /**
   * Prose configuration from Nuxt Typography
   * 
   * 
   * @studioIcon material-symbols:short-text-rounded
   * 
   * @studioInput icon
  */
  prose?: {
   /**
    * Copy button (used in code blocks)
    * 
    * 
    * @studioIcon material-symbols:content-copy
   */
   copyButton?: {
    /**
     * Icon displayed to copy
     * 
     * @default "ph:copy"
    */
    iconCopy?: string,

    /**
     * Icon displayed when copied
     * 
     * @default "ph:check"
    */
    iconCopied?: string,
   },

   /**
    * Default configuration for all headings (h1, h2, h3, h4, h5 and h6)
    * 
    * 
    * @studioIcon material-symbols:title
   */
   headings?: {
    /**
     * Default icon for anchor link on hover
     * 
     * @default "ph:link"
    */
    icon?: string|false,
   },

   /**
    * First heading configuration
    * 
    * 
    * @studioIcon material-symbols:format-h1
   */
   h1?: {
    /**
     * Icon displayed for anchor link on hover
     * 
     * @default ""
    */
    icon?: string|false,
   },

   /**
    * Second heading configuration
    * 
    * 
    * @studioIcon material-symbols:format-h2
   */
   h2?: {
    /**
     * Icon displayed for anchor link on hover
     * 
     * @default ""
    */
    icon?: string|false,
   },

   /**
    * Third heading configuration
    * 
    * 
    * @studioIcon material-symbols:format-h3
   */
   h3?: {
    /**
     * Icon displayed for anchor link on hover
     * 
     * @default ""
    */
    icon?: string|false,
   },

   /**
    * Fourth heading configuration
    * 
    * 
    * @studioIcon material-symbols:format-h4
   */
   h4?: {
    /**
     * Icon displayed for anchor link on hover
     * 
     * @default ""
    */
    icon?: string|false,
   },

   /**
    * Fifth heading configuration
    * 
    * 
    * @studioIcon material-symbols:format-h5
   */
   h5?: {
    /**
     * Icon displayed for anchor link on hover
     * 
     * @default ""
    */
    icon?: string|false,
   },

   /**
    * Sixth heading configuration
    * 
    * 
    * @studioIcon material-symbols:format-h6
   */
   h6?: {
    /**
     * Icon displayed for anchor link on hover
     * 
     * @default ""
    */
    icon?: string|false,
   },
  },

  /**
   * Docus theme configuration.
   * 
   * 
   * @studioIcon material-symbols:docs
  */
  docus?: {
   /**
    * Website title, used as header default title and meta title.
    * 
    * @default "Docus"
    * 
    * @studioIcon material-symbols:title
   */
   title?: string,

   /**
    * The website title template, to overwrite the default one.
    * 
    * @default "%s · Docus"
   */
   titleTemplate?: string,

   /**
    * Website description, used for meta description.
    * 
    * @default "The best place to start your documentation."
    * 
    * @studioIcon material-symbols:description
   */
   description?: string,

   /**
    * Cover image.
    * 
    * @default "https://user-images.githubusercontent.com/904724/185365452-87b7ca7b-6030-4813-a2db-5e65c785bf88.png"
    * 
    * @example '/cover.jpg'
    * 
    * @studioIcon dashicons:cover-image
    * 
    * @studioInput file
   */
   image?: string,

   /**
    * Social links
    * 
    * Will be used in AppSocialIcons component.
    * 
    * 
    * @studioIcon material-symbols:share-outline
   */
   socials?: {
    /**
     * Twitter social handle
     * 
     * @default ""
     * 
     * @example 'nuxt_js'
     * 
     * @studioIcon simple-icons:twitter
    */
    twitter?: string,

    /**
     * GitHub org or repository
     * 
     * @default ""
     * 
     * @example 'nuxt/framework'
     * 
     * @studioIcon simple-icons:github
    */
    github?: string,

    /**
     * Facebook page url
     * 
     * @default ""
     * 
     * @example https://www.facebook.com/groups/nuxtjs
     * 
     * @studioIcon simple-icons:facebook
    */
    facebook?: string,

    /**
     * Instagram page url
     * 
     * @default ""
     * 
     * @example https://www.instagram.com/wearenuxt
     * 
     * @studioIcon simple-icons:instagram
    */
    instagram?: string,

    /**
     * Instagram page url
     * 
     * @default ""
     * 
     * @example https://www.youtube.com/@NuxtLabs
     * 
     * @studioIcon simple-icons:youtube
    */
    tiktok?: string,

    /**
     * TikTok page url
     * 
     * @default ""
     * 
     * @example https://www.tiktok.com/@tiktok
     * 
     * @studioIcon simple-icons:tiktok
    */
    youtube?: string,

    /**
     * Medium page url
     * 
     * @default ""
     * 
     * @example https://medium.com/nuxt
     * 
     * @studioIcon simple-icons:medium
    */
    medium?: string,
   },

   /**
    * Theme layout configuration.
    * 
    * @default "default"
    * 
    * @studioIcon tabler:arrow-autofit-width
   */
   layout?: 'default'|'page',

   /**
    * Aside navigation configuration.
    * 
    * 
    * @studioIcon fluent:document-page-24-regular
   */
   aside?: {
    /**
     * Aside navigation level
     * 
     * Use 0 to disable all nesting. Use 1 and more to display nested navigation in header and aside navigation.
     * 
     * @default 0
    */
    level?: number,

    /**
     * Specify if default collapsibles state globally for aside navigation.
     * 
     * @default false
    */
    collapsed?: boolean,

    /**
     * Paths to be excluded from aside navigation.
     * 
    */
    exclude?: string[],
   },

   /**
    * Header configuration.
    * 
    * 
    * @studioIcon fluent:document-header-24-regular
   */
   header?: {
    /**
     * Website title
     * 
     * Title to be displayed in header or as aria-label if logo is defined.
     * Default to docus.title
     * 
     * @default ""
     * 
     * @studioIcon material-symbols:title
    */
    title?: string,

    /**
     * Logo configuration
     * 
     * Boolean to disable or use the `Logo.vue` component.
     * String to be used as a name of a component.
     * Object that sets the light and dark logos.
     * 
     * @default false
     * 
     * @example 'MyLogo'
     * 
     * @studioInput boolean
    */
    logo?: boolean|string|{dark: string, light: string},

    /**
     * Header links
     * 
     * Toggle links icons in the header.
     * 
     * @default false
    */
    showLinkIcon?: boolean,

    /**
     * Paths to be excluded from header links.
     * 
    */
    exclude?: string[],

    /**
     * Makes the content of the header fluid.
     * 
     * @default false
    */
    fluid?: boolean,
   },

   /**
    * Main content configuration.
    * 
    * 
    * @studioIcon fluent:document-header-footer-24-filled
   */
   main?: {
    /**
     * Makes the content of the main container fluid.
     * 
     * @default false
    */
    fluid?: boolean,

    /**
     * Makes the content of the main container padded.
     * 
     * @default true
    */
    padded?: boolean,
   },

   /**
    * Footer configuration
    * 
    * 
    * @studioIcon fluent:document-footer-24-regular
   */
   footer?: {
    /**
     * Website credits configuration.
     * 
     * 
     * @studioIcon material-symbols:copyright
    */
    credits?: false|{icon: string, text: string, href: string},

    /**
     * Text links
     * 
     * Will be added into center section of the footer.
     * 
     * 
     * @studioIcon material-symbols:add-link
    */
    textLinks?: Array<{
     /**
      * URL when clicking the link
      * 
     */
     href: string,

     /**
      * Text of the link
      * 
     */
     text: string,

     /**
      * Target attribute of the link
      * 
     */
     target?: string,

     /**
      * Rel attribute of the link
      * 
     */
     rel?: string,
    }>,

    /**
     * Icon links
     * 
     * Icons to be added to Social Icons in footer.
     * 
     * 
     * @studioIcon material-symbols:add-link
    */
    iconLinks?: Array<{
     /**
      * Icon name
      * 
     */
     icon: string,

     /**
      * Link when clicking on the icon
      * 
     */
     href: string,

     /**
      * Label of the icon
      * 
     */
     label?: string,

     /**
      * Rel attribute of the link
      * 
     */
     rel?: string,
    }>,

    /**
     * Makes the content of the footer fluid.
     * 
     * @default true
    */
    fluid?: boolean,
   },

   /**
    * GitHub integration
    * 
    * Configure the Edit on Github integration.
    * 
    * 
    * @studioIcon simple-icons:github
   */
   github?: {
    /**
     * Base URL
     * 
     * You can use this to link to GitHub Enterprise.
     * 
     * @default "https://github.com"
    */
    baseUrl?: string,

    /**
     * Directory
     * 
     * Your GitHub repository root directory.
     * 
     * @default ""
    */
    dir?: string,

    /**
     * Branch
     * 
     * Your GitHub repository branch.
     * 
     * @default ""
    */
    branch?: string,

    /**
     * Repository
     * 
     * Your GitHub repository name.
     * 
     * @default ""
    */
    repo?: string,

    /**
     * Owner
     * 
     * Your GitHub repository owner.
     * 
     * @default ""
    */
    owner?: string,

    /**
     * EditOnGithub
     * 
     * Display EditOnGithub button.
     * 
     * @default false
    */
    edit?: boolean,
   },
  },
 },
}
export type CustomAppConfig = Exclude<NuxtCustomSchema['appConfig'], undefined>
type _CustomAppConfig = CustomAppConfig

declare module '@nuxt/schema' {
  interface NuxtConfig extends Omit<NuxtCustomSchema, 'appConfig'> {}
  interface NuxtOptions extends Omit<NuxtCustomSchema, 'appConfig'> {}
  interface CustomAppConfig extends _CustomAppConfig {}
}

declare module 'nuxt/schema' {
  interface NuxtConfig extends Omit<NuxtCustomSchema, 'appConfig'> {}
  interface NuxtOptions extends Omit<NuxtCustomSchema, 'appConfig'> {}
  interface CustomAppConfig extends _CustomAppConfig {}
}
