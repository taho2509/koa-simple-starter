import fs from 'fs'
import path from 'path'
import { CustomApp } from '../server'
import logger from '../utils/logger'
import {getInnerDirectories, hasIndexFile, getFullPath} from '../utils/functions'

export interface AppExtension {
  load: (app: CustomApp) => void
}

export interface ExtensionsHandler {
  register: (app: CustomApp) => Promise<{}>;
}
const extensionsHandler: ExtensionsHandler = {
  register: (app) => {
    return new Promise(async resolve => {
      logger.info('Registering extensions:')

      const defers: {name: string, module: Promise<{ options:object, default: AppExtension }>}[] = []
      getInnerDirectories(__dirname)
        .forEach(extensionFolder => {
          const fullExtensionPath = getFullPath(__dirname, extensionFolder) 
          if (hasIndexFile(fullExtensionPath)) {
            defers.push({ name: extensionFolder, module: import(fullExtensionPath)})
          }
        })
      
      const extensions = await Promise.all(defers.map(x => x.module))
      extensions.forEach((module, index) => {
        const { default: extension } = module;
        extension.load(app)
        logger.verbose(`Registered "${defers[index].name}"`)
      })
      
      resolve()
    })
  } 
}

export default extensionsHandler
