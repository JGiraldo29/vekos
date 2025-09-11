const PREFERS_COLOR_ONLY = /^\(\s*prefers-color-scheme\s*:\s*dark\s*\)$/
const PREFERS_COLOR = /\(\s*prefers-color-scheme\s*:\s*dark\s*\)/g

function escapeRegExp(string) {
  return string.replace(/[$()*+.?[\\\]^{|}-]/g, '\\$&')
}

function replaceAll(string, find, replace) {
  return string.replace(new RegExp(escapeRegExp(find), 'g'), replace)
}

module.exports = (opts = {}) => {
  let dark = opts.darkSelector || '.is-dark'
  let light = `:not(${opts.lightSelector || '.is-light'})`

  let roots = opts.rootSelector || ['html', ':root']
  if (!Array.isArray(roots)) roots = [roots]

  let uniqueRoots = roots
  if (uniqueRoots.includes('html')) {
    uniqueRoots = uniqueRoots.filter(i => i !== ':root')
  }

  function processSelectors(selectors, add) {
    return selectors.map(selector => {
      let changed = false
      for (let root of roots) {
        if (selector.includes(root)) {
          changed = true
          selector = replaceAll(selector, root, root + add)
        }
      }
      if (!changed) {
        selector = uniqueRoots
          .map(root => `${root}${add} ${selector}`)
          .join(',')
      }
      return selector
    })
  }

  function processNodes(parent, add) {
    parent.each(node => {
      if (node.type === 'atrule') {
        processNodes(node, add)
      } else if (node.type === 'rule') {
        node.selectors = processSelectors(node.selectors, add)
      }
    })
  }

  return {
    postcssPlugin: 'postcss-dark-theme-class',
    AtRuleExit: {
      media: atrule => {
        if (!atrule.params.includes('dark')) return
        let params = atrule.params
        if (PREFERS_COLOR_ONLY.test(params)) {
          let last = atrule
          atrule.each(node => {
            let fixed
            if (node.type === 'atrule') {
              fixed = node.clone()
              processNodes(fixed, dark)
              processNodes(node, light)
            } else if (node.type === 'rule') {
              if (!node.selector.includes(light)) {
                fixed = node.clone({
                  selectors: processSelectors(node.selectors, dark)
                })
                node.selectors = processSelectors(node.selectors, light)
              }
            } else if (node.type === 'comment') {
              fixed = node.clone()
            }
            if (fixed) {
              last.after(fixed)
              last = fixed
            }
          })
        } else if (PREFERS_COLOR.test(params) && params.includes(' and ')) {
          if (atrule.params.includes(' and ')) {
            let fixed = atrule.clone({
              params: atrule.params
                .replace(PREFERS_COLOR, '')
                .replace(/\s+and\s+and/i, ' and')
                .replace(/^\s*and\s+/i, '')
                .replace(/\s+and\s*$/i, '')
            })
            atrule.after(fixed)
            processNodes(fixed, dark)
            processNodes(atrule, light)
          }
        }
      }
    }
  }
}
module.exports.postcss = true
