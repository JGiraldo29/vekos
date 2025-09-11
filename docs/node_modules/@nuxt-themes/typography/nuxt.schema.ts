export default defineNuxtConfigSchema({
  appConfig: {
    /**
     * Prose configuration from Nuxt Typography
     *
     * @studioIcon material-symbols:short-text-rounded
     * @studioInput icon
     */
    prose: {
      /**
       * Copy button (used in code blocks)
       *
       * @studioIcon material-symbols:content-copy
       */
      copyButton: {
        /** Icon displayed to copy */
        iconCopy: 'ph:copy',
        /** Icon displayed when copied */
        iconCopied: 'ph:check'
      },
      /**
       * Default configuration for all headings (h1, h2, h3, h4, h5 and h6)
       *
       * @studioIcon material-symbols:title
       */
      headings: {
        /**
         * Default icon for anchor link on hover
         * @type {string|false}
         */
        icon: 'ph:link'
      },
      /**
       * First heading configuration
       *
       * @studioIcon material-symbols:format-h1
       */
      h1: {
        /**
         * Icon displayed for anchor link on hover
         * @type {string|false}
         * */
        icon: ''
      },
      /**
       * Second heading configuration
       *
       * @studioIcon material-symbols:format-h2
       */
      h2: {
        /**
         * Icon displayed for anchor link on hover
         * @type {string|false}
         * */
        icon: ''
      },
      /**
       * Third heading configuration
       *
       * @studioIcon material-symbols:format-h3
       */
      h3: {
        /**
         * Icon displayed for anchor link on hover
         * @type {string|false}
         * */
        icon: ''
      },
      /**
       * Fourth heading configuration
       *
       * @studioIcon material-symbols:format-h4
       */
      h4: {
        /**
         * Icon displayed for anchor link on hover
         * @type {string|false}
         * */
        icon: ''
      },
      /**
       * Fifth heading configuration
       *
       * @studioIcon material-symbols:format-h5
       */
      h5: {
        /**
         * Icon displayed for anchor link on hover
         * @type {string|false}
         * */
        icon: ''
      },
      /**
       * Sixth heading configuration
       *
       * @studioIcon material-symbols:format-h6
       */
      h6: {
        /**
         * Icon displayed for anchor link on hover
         * @type {string|false}
         * */
        icon: ''
      }
    }
  }
})
