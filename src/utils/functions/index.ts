import fs from 'fs'
import path from 'path'

const getFullPath = (parentFolderPath: string, fileName: string) => path.join(parentFolderPath, fileName)
const isDirectory = (fullFilePath: string) => fs.lstatSync(fullFilePath).isDirectory()
const getInnerDirectories = (fullFolderPath: string) => fs.readdirSync(fullFolderPath).filter(innerFile => isDirectory(path.join(fullFolderPath, innerFile)))
const hasIndexFile = (fullFolderPath: string) => fs.readdirSync(fullFolderPath).indexOf('index.ts') > -1 || fs.readdirSync(fullFolderPath).indexOf('index.js') > -1

export { getFullPath, isDirectory, getInnerDirectories, hasIndexFile }