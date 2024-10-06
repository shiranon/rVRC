import { describe, expect, it, vi } from 'vitest'
import { createTestContext } from '~/lib/test/mockCloudflareContext'
import { folderLoader } from '.'

const env: Env = {
	SUPABASE_URL: process.env.SUPABASE_URL ?? '',
	SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ?? '',
	VITE_LOCAL_DATE: '',
	SITE_URL: '',
}

const context = createTestContext(env)

describe('folderLoaderのテスト(開発環境DBにアクセス)', () => {
	const mockRequest = {
		headers: {
			get: vi.fn().mockReturnValue('http://localhost:3000'),
		},
		url: 'http://localhost:3000/folder/',
	} as unknown as Request

	it('フォルダーが取得出来る', async () => {
		const result = await folderLoader({
			request: mockRequest,
			context,
			params: {},
		})

		expect(result.status).toBe(200)
		const body = await result.json()
		expect(body.folders).toBeDefined()
		expect(body.folders.length).lessThan(10)
		expect(body.folderCount).toBeDefined()
	})
})

function fail(arg0: string) {
	throw new Error('Function not implemented.')
}
