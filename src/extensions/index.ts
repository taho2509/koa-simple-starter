import { CustomApp } from '../server'
import logger from '../utils/logger'
import { getInnerDirectories, hasIndexFile, getFullPath, isDirectory } from '../utils/functions'

export interface AppExtension {
  load: (app: CustomApp) => void
}

export interface ExtensionsHandler {
  register: (app: CustomApp) => Promise<void>
}

interface ExtensionModule {
  default: AppExtension
}

const extensionsHandler: ExtensionsHandler = {
  register: (app): Promise<void> => {
    return new Promise(
      async (resolve): Promise<void> => {
        logger.info('Registering extensions:')

        const defers: { name: string; module: Promise<ExtensionModule> }[] = []
        getInnerDirectories(__dirname).forEach(
          (extensionFolder): void => {
            const fullExtensionPath = getFullPath(__dirname, extensionFolder)
            if (hasIndexFile(fullExtensionPath)) {
              defers.push({ name: extensionFolder, module: import(fullExtensionPath) })
            }
          },
        )

        const extensions = await Promise.all(defers.map((x): Promise<ExtensionModule> => x.module))
        extensions.forEach(
          (module, index): void => {
            const { default: extension } = module
            extension.load(app)
            logger.verbose(`Registered "${defers[index].name}"`)
          },
        )

        resolve()
      },
    )
  },
}

export default extensionsHandler
