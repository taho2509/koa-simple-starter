import fs from 'fs'
import path from 'path'

const getFullPath = (parentFolderPath: string, fileName: string): string => path.join(parentFolderPath, fileName)

const isDirectory = (fullFilePath: string): boolean => fs.lstatSync(fullFilePath).isDirectory()

const getInnerDirectories = (fullFolderPath: string): string[] => {
  return fs
    .readdirSync(fullFolderPath, { withFileTypes: true })
    .filter((innerDir): boolean => innerDir.isDirectory())
    .map(
      (innerDir): string => {
        return innerDir.name
      },
    )
}

const hasIndexFile = (fullFolderPath: string): boolean =>
  fs.readdirSync(fullFolderPath).indexOf('index.ts') > -1 || fs.readdirSync(fullFolderPath).indexOf('index.js') > -1

export { getFullPath, isDirectory, getInnerDirectories, hasIndexFile }
