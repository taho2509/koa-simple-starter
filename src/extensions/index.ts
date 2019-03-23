import fs from 'fs'
import path from 'path'
import { CustomApp } from '../server'
import logger from '../utils/logger'

export interface AppExtension {
  load: (app: CustomApp, options?: object) => void
}

const isDirectory = (path: string) => fs.lstatSync(path).isDirectory()
const hasIndexFile = (folder: string) => fs.readdirSync(folder).indexOf('index.ts') > -1 || fs.readdirSync(folder).indexOf('index.js') > -1

export interface ExtensionsHandler {
  register: (app: CustomApp) => Promise<{}>;
}
const extensionsHandler: ExtensionsHandler = {
  register: (app) => {
    return new Promise(async resolve => {
      logger.info('Registering extensions:')

      const defers: {name: string, module: Promise<{ options:object, default: AppExtension }>}[] = []
      fs.readdirSync(__dirname)
        .filter(f => isDirectory(path.join(__dirname, f)))
        .forEach(extensionFolder => {
          const extensionFullPath = path.join(__dirname, extensionFolder)
          if (hasIndexFile(extensionFullPath)) {
            defers.push({ name: extensionFolder, module: import(extensionFullPath)})
          }
        })
      
      const extensions = await Promise.all(defers.map(x => x.module))
      extensions.forEach((module, index) => {
        const { options, default: extension } = module;
        extension.load(app, options)
        logger.verbose(`Registered "${defers[index].name}"`)
      })
      
      resolve()
    })
  } 
}

export default extensionsHandler
