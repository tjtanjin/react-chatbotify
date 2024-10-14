import { generateSecureUUID } from '../../src/utils/idGenerator'

const mockedRandomUUID = jest.fn()
const mockedGetRandomValues = jest.fn()

describe('idGenerator', () => {
	beforeEach(() => {
		// Reset all mocks before each test
		jest.clearAllMocks()

		Object.defineProperty(globalThis, 'crypto', {
			value: {
				randomUUID: mockedRandomUUID,
				getRandomValues: mockedGetRandomValues,
			},
		})
	})

	it('should create a uuid', () => {
		const mockId = 'mocked-uuid1-uuid2-uuid3-uuid4'
		mockedRandomUUID.mockReturnValue(mockId)

		// creates uuid
		const uuid = generateSecureUUID()

		expect(mockedRandomUUID).toHaveBeenCalled()
		expect(uuid).toEqual(mockId)
	})

	it('should create a uuid with getRandomValues when randomUUID is not available', () => {
		globalThis.crypto.randomUUID = undefined as any
		mockedGetRandomValues.mockImplementation(() => new Uint8Array())

		generateSecureUUID()

		expect(mockedRandomUUID).not.toHaveBeenCalled()
		expect(mockedGetRandomValues).toHaveBeenCalled()
	})
})
