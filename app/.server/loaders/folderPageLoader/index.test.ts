import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createTestContext } from '~/lib/test/mockCloudflareContext'
import { folderPageLoader } from '.'

const env: Env = {
	SUPABASE_URL: process.env.SUPABASE_URL ?? '',
	SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ?? '',
	VITE_LOCAL_DATE: '',
	SITE_URL: '',
}

const context = createTestContext(env)

describe('ログイン状態時のテスト(mock)', () => {
	beforeEach(() => {
		vi.resetModules()
	})

	const mockRequest = {
		headers: {
			get: vi.fn().mockReturnValue('http://localhost:3000'),
		},
		url: 'http://localhost:3000/folder/',
	} as unknown as Request

	it('公開フォルダの場合アクセス出来る', async () => {
		vi.doMock('~/module/supabase/create-client.server', () => ({
			createClient: vi.fn(() => ({
				supabase: {
					auth: {
						getUser: vi.fn().mockResolvedValue({
							data: { user: { id: 'test-user' } },
							error: null,
						}),
					},
					rpc: vi.fn().mockImplementation((procedureName) => {
						if (procedureName === 'get_folder_data') {
							return {
								data: { id: 'test-id', name: 'test-name', is_private: false },
								error: null,
								single: () => ({
									data: {},
									error: null,
								}),
							}
						}
						if (procedureName === 'get_folder_items') {
							return {
								data: [{ item_type: 'avatar' }, { item_type: 'cloth' }],
								error: null,
							}
						}
						return Promise.resolve({ data: null, error: null })
					}),
					from: vi.fn().mockReturnValue({
						select: vi.fn().mockReturnThis(),
						eq: vi.fn().mockResolvedValue({ data: [], error: null }),
					}),
				},
			})),
		}))

		const { folderPageLoader } = await import('.')

		const result = await folderPageLoader({
			request: mockRequest,
			context,
			params: { id: 'test-id' },
		})

		console.log(result)

		expect(result.status).toBe(200)
	})
})

function fail(arg0: string) {
	throw new Error('Function not implemented.')
}
