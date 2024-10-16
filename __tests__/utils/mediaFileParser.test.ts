import { getMediaFileDetails } from '../../src/utils/mediaFileParser'

describe('mediaFileParser', () => {
	beforeEach(() => {
		// Reset all mocks before each test
		jest.clearAllMocks()
	})

	it('should return fileType and fileUrl', async () => {
		const mockFile = new File([], 'file.jpg', { type: 'image/jpg' }) as File

		const fileDetails = await getMediaFileDetails(mockFile)

		expect(fileDetails.fileType).toBe('image')
		expect(fileDetails.fileUrl).toContain('data:' + mockFile.type)
	})

	it('should return null when passed file is not a media file', async () => {
		const mockFile = new File([], 'file.txt', { type: 'text/plain' }) as File

		const fileDetails = await getMediaFileDetails(mockFile)

		expect(fileDetails.fileType).toBe(null)
		expect(fileDetails.fileUrl).toBe(null)
	})

	it('should return null when invalid file passed', async () => {
		const mockFile = new File([], 'file.mp4') as File

		const fileDetails = await getMediaFileDetails(mockFile)

		expect(fileDetails.fileType).toBe(null)
		expect(fileDetails.fileUrl).toBe(null)
	})
})
