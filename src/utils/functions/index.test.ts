import fs, { Stats } from 'fs'
import sinon from 'sinon'
import logger from '@src/utils/logger'
import { getFullPath, getInnerDirectories, isDirectory, hasIndexFile } from './index'

const sandbox = sinon.createSandbox()

describe('Utility functions tests', (): void => {
  beforeAll(
    (): void => {
      logger.mute()
    },
  )

  afterEach(
    (): void => {
      sandbox.restore()
    },
  )

  afterAll(
    (): void => {
      logger.unmute()
    },
  )

  describe('Function getFullPath:', (): void => {
    it('should get a full path string given proper parentFolder and fileName', (): void => {
      const parentFolder = '/dummy/folder'
      const fileName = 'dummyFilename.ts'

      const resultPath = getFullPath(parentFolder, fileName)
      expect(resultPath).toBe(parentFolder + '/' + fileName)
    })
  })

  describe('Function getInnerDirectories:', (): void => {
    const testFolderPath = '/dummy/folder/path'

    it('should throw an error when path is unaccesible or inexistent', (): void => {
      try {
        getInnerDirectories(testFolderPath)
        throw new Error('this should not happend')
      } catch (error) {
        expect(error.path).toBe(testFolderPath)
      }
    })

    it('should get 0 directories on a valid folder', (): void => {
      sandbox.stub(fs, 'readdirSync').returns([])

      try {
        const res = getInnerDirectories(testFolderPath)
        expect(res).toHaveLength(0)
      } catch (error) {
        throw error
      }
    })

    it('should get directories on a valid folder', (): void => {
      sandbox.stub(fs, 'readdirSync').returns([
        {
          isDirectory: (): boolean => true,
          isFile: (): boolean => false,
          isBlockDevice: (): boolean => false,
          isCharacterDevice: (): boolean => false,
          isSymbolicLink: (): boolean => false,
          isFIFO: (): boolean => false,
          isSocket: (): boolean => false,
          name: 'dir',
        },
      ])

      try {
        const res = getInnerDirectories(testFolderPath)
        expect(res).toHaveLength(1)
      } catch (error) {
        throw error
      }
    })
  })

  describe('Function isDirectory', (): void => {
    const testPath = '/dummy/path'

    it('should throw an error when path is unaccesible or inexistent', (): void => {
      try {
        isDirectory(testPath)
      } catch (error) {
        expect(error.path).toBe(testPath)
      }
    })

    it('should return false if path is not a directory', (): void => {
      const lstatStub = sandbox.stub(fs, 'lstatSync').returns(new Stats())

      const result = isDirectory(testPath)

      lstatStub.calledWith(testPath)
      expect(result).toBeFalsy()
    })

    it('should return true if path is a directory', (): void => {
      const validDirectoryStats = new Stats()
      const lstatStub = sandbox.stub(fs, 'lstatSync').returns(validDirectoryStats)
      sandbox.stub(validDirectoryStats, 'isDirectory').returns(true)

      const result = isDirectory(testPath)

      lstatStub.calledWith(testPath)
      expect(result).toBeTruthy()
    })
  })

  describe('Function hasIndexFile', (): void => {
    const testPath = '/dummy/path'

    it('should throw an error if directory does not exists or is invalid', (): void => {
      try {
        hasIndexFile(testPath)
      } catch (error) {
        expect(error.path).toBe(testPath)
      }
    })
    it('should return false if directory does not has an index file in it', (): void => {
      sandbox.stub(fs, 'readdirSync').returns([
        {
          isDirectory: (): boolean => true,
          isFile: (): boolean => false,
          isBlockDevice: (): boolean => false,
          isCharacterDevice: (): boolean => false,
          isSymbolicLink: (): boolean => false,
          isFIFO: (): boolean => false,
          isSocket: (): boolean => false,
          name: 'bad.ts',
        },
      ])

      const result = hasIndexFile(testPath)
      expect(result).toBeFalsy()
    })
    it('should return true if directory has an index file in it', (): void => {
      sandbox.stub(fs, 'readdirSync').returns([
        {
          isDirectory: (): boolean => true,
          isFile: (): boolean => false,
          isBlockDevice: (): boolean => false,
          isCharacterDevice: (): boolean => false,
          isSymbolicLink: (): boolean => false,
          isFIFO: (): boolean => false,
          isSocket: (): boolean => false,
          name: 'index.ts',
        },
      ])

      const result = hasIndexFile(testPath)
      expect(result).toBeTruthy()
    })
  })
})
