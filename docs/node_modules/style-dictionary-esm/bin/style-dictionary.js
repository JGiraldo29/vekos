#!/usr/bin/env node

'use strict'

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'fs-extra'
import { program } from 'commander'
import { dirname } from 'pathe'
import StyleDictionary from '../dist/index.mjs'

function collect(val, arr) {
  arr.push(val)
  return arr
}

function resolveCliPath(_path = '') {
  const _dir = dirname(fileURLToPath(import.meta.url))
  return `${_dir}/${_path}`
}

const pkg = JSON.parse(fs.readFileSync(path.join(resolveCliPath('..'), 'package.json'), 'utf8'))

function getConfigPath(options) {
  let configPath = options.config

  if (!configPath) {
    if (fs.existsSync('./config.json')) {
      configPath = './config.json'
    }
    else if (fs.existsSync('./config.js')) {
      configPath = './config.js'
    }
    else {
      console.error('Build failed; unable to find config file.')
      process.exit(1)
    }
  }

  return configPath
}

program
  .version(pkg.version)
  .description(pkg.description)
  .usage('[command] [options]')

program
  .command('build')
  .description('Builds a style dictionary package from the current directory.')
  .option('-c, --config <path>', 'set config path. defaults to ./config.json')
  .option('-p, --platform [platform]', 'only build specific platforms. Must be defined in the config', collect, [])
  .action(styleDictionaryBuild)

program
  .command('clean')
  .description('Removes files specified in the config of the style dictionary package of the current directory.')
  .option('-c, --config <path>', 'set config path. defaults to ./config.json')
  .option('-p, --platform [platform]', 'only clean specific platform(s). Must be defined in the config', collect, [])
  .action(styleDictionaryClean)

program
  .command('init <type>')
  .description('Generates a starter style dictionary')
  .action((type) => {
    const types = ['basic', 'complete']
    if (!types.includes(type)) {
      console.error(`Please supply 1 type of project from: ${types.join(', ')}`)
      process.exit(1)
    }

    console.log('Copying starter files...\n')
    fs.copySync(path.join(resolveCliPath(), '..', 'examples', type), process.cwd())
    console.log('Source style dictionary starter files created!\n')
    console.log('Running `style-dictionary build` for the first time to generate build artifacts.\n')
    styleDictionaryBuild()
  })

// error on unknown commands
program.on('command:*', () => {
  console.error('Invalid command: %s\nSee --help for a list of available commands.', process.argv.slice(2).join(' '))
  process.exit(1)
})

function styleDictionaryBuild(options) {
  options = options || {}
  const configPath = getConfigPath(options)

  // Create a style dictionary object with the config
  const styleDictionary = StyleDictionary.extend(configPath)

  if (options.platform && options.platform.length > 0) {
    options.platform.forEach((platform) => {
      styleDictionary.buildPlatform(platform)
    })
  }
  else {
    styleDictionary.buildAllPlatforms()
  }
}

function styleDictionaryClean(options) {
  options = options || {}
  const configPath = getConfigPath(options)

  // Create a style dictionary object with the config
  const styleDictionary = StyleDictionary.extend(configPath)

  if (options.platform && options.platform.length > 0) {
    options.platform.forEach((platform) => {
      styleDictionary.cleanPlatform(platform)
    })
  }
  else {
    styleDictionary.cleanAllPlatforms()
  }
}

program.parse(process.argv)

// show help on no command
if (!process.argv.slice(2).length)
  program.outputHelp()
