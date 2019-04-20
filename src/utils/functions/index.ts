import fs, { Dirent } from 'fs'
import path from 'path'

const getFullPath = (parentFolderPath: string, fileName: string): string => path.join(parentFolderPath, fileName)

const isDirectory = (fullFilePath: string): boolean => fs.lstatSync(fullFilePath).isDirectory()

const getInnerDirectories = (fullFolderPath: string): string[] => {
  return fs
    .readdirSync(fullFolderPath, { withFileTypes: true })
    .filter((innerDir: Dirent): boolean => innerDir.isDirectory())
    .map((innerDir): string => innerDir.name)
}

const hasIndexFile = (fullFolderPath: string): boolean => {
  const files = fs.readdirSync(fullFolderPath, { withFileTypes: true }).map((file): string => file.name)
  return files.indexOf('index.ts') > -1 || files.indexOf('index.js') > -1
}

export { getFullPath, isDirectory, getInnerDirectories, hasIndexFile }
