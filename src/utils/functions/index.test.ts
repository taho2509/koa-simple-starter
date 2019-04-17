import sinon from 'sinon'
import fs, { Stats, Dirent } from 'fs'
import logger from '@src/utils/logger'
import * as functions from './index'

const sandbox = sinon.createSandbox()

describe('Utility functions tests', (): void => {
  beforeAll(
    (): void => {
      logger.mute()
    },
  )

  afterEach(
    (): void => {
      logger.unmute()
      sandbox.restore()
    },
  )

  describe('Function getFullPath:', (): void => {
    it('should get a full path string given proper parentFolder and fileName', (): void => {
      const parentFolder = '/dummy/folder'
      const fileName = 'dummyFilename.ts'

      const resultPath = functions.getFullPath(parentFolder, fileName)
      expect(resultPath).toBe(parentFolder + '/' + fileName)
    })
  })

  describe('Function getInnerDirectories:', (): void => {
    const testFolderPath = '/dummy/folder/path'

    it('should throw an error when path is unaccesible or inexistent', (): void => {
      try {
        functions.getInnerDirectories(testFolderPath)
        throw new Error('this should not happend')
      } catch (error) {
        expect(error.path).toBe(testFolderPath)
      }
    })

    it('should get 0 directories on a valid folder', (): void => {
      sandbox.stub(fs, 'readdirSync').returns([])

      try {
        const res = functions.getInnerDirectories(testFolderPath)
        expect(res).toHaveLength(0)
      } catch (error) {
        throw error
      }
    })

    it('should get directories on a valid folder', (): void => {
      /* const dir: Dirent = {
        name: 'dir',
        isFile: (): boolean => false,
        isDirectory: (): boolean => true,
        isBlockDevice: (): boolean => false,
        isCharacterDevice: (): boolean => false,
        isSymbolicLink: (): boolean => false,
        isFIFO: (): boolean => false,
        isSocket: (): boolean => false,
      } */

      sandbox.stub(fs, 'readdirSync').returns([])

      try {
        const res = functions.getInnerDirectories(testFolderPath)
        expect(res).toHaveLength(0)
      } catch (error) {
        throw error
      }
    })
  })
})
