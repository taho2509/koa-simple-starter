import { getFullPath } from './index'

describe('Utility functions tests', (): void => {
  it('should get a full path string given proper parentFolder and fileName', (): void => {
    const parentFolder = '/dummy/folder'
    const fileName = 'dummyFilename.ts'

    const resultPath = getFullPath(parentFolder, fileName)
    expect(resultPath).toBe(parentFolder + '/' + fileName)
  })
})
