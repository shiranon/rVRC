import { describe, expect, it, vi } from 'vitest'
import { createTestContext } from '~/lib/test/mockCloudflareContext'
import { searchLoader } from '.'

const env: Env = {
	SUPABASE_URL: process.env.SUPABASE_URL ?? '',
	SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ?? '',
	VITE_LOCAL_DATE: '',
	SITE_URL: '',
}

const context = createTestContext(env)

describe('searchLoaderのテスト(開発環境DBにアクセス)', () => {
	it('itemの指定がない場合アバターが取得される', async () => {
		const mockRequest = {
			headers: {
				get: vi.fn().mockReturnValue('http://localhost:3000'),
			},
			url: 'http://localhost:3000/search',
		} as unknown as Request
		const result = await searchLoader({
			request: mockRequest,
			context,
			params: {},
		})

		expect(result.status).toBe(200)
		const body = await result.json()
		expect(body.item).toEqual('avatar')
		expect(body.result).toBeDefined()
		expect(body.result?.length).toEqual(10)
	})

	it('itemがavatarの場合、アバターが取得される', async () => {
		const mockRequest = {
			headers: {
				get: vi.fn().mockReturnValue('http://localhost:3000'),
			},
			url: 'http://localhost:3000/search?item=avatar',
		} as unknown as Request
		const result = await searchLoader({
			request: mockRequest,
			context,
			params: {},
		})

		expect(result.status).toBe(200)
		const body = await result.json()
		expect(body.item).toEqual('avatar')
		expect(body.result).toBeDefined()
		expect(body.result?.length).toEqual(10)
	})
	it('itemがclothの場合、衣装が取得される', async () => {
		const mockRequest = {
			headers: {
				get: vi.fn().mockReturnValue('http://localhost:3000'),
			},
			url: 'http://localhost:3000/search?item=cloth',
		} as unknown as Request
		const result = await searchLoader({
			request: mockRequest,
			context,
			params: {},
		})

		expect(result.status).toBe(200)
		const body = await result.json()
		expect(body.item).toEqual('cloth')
		expect(body.result).toBeDefined()
		expect(body.result?.length).toEqual(10)
	})

	it('範囲外のページが指定された場合、空のデータが帰る', async () => {
		const mockRequest = {
			headers: {
				get: vi.fn().mockReturnValue('http://localhost:3000'),
			},
			url: 'http://localhost:3000/search?page=10000',
		} as unknown as Request
		const result = await searchLoader({
			request: mockRequest,
			context,
			params: {},
		})

		expect(result.status).toBe(200)
		const body = await result.json()
		expect(body.item).toEqual('avatar')
		expect(body.result).toBeDefined()
		expect(body.result?.length).toEqual(0)
	})

	it('検索結果が0の場合、空のデータが帰る', async () => {
		const hannya =
			'仏説摩訶般若波羅蜜多心経観自在菩薩行深般若波羅蜜多時照見五蘊皆空度一切苦厄'
		const mockRequest = {
			headers: {
				get: vi.fn().mockReturnValue('http://localhost:3000'),
			},
			url: `https://test.boothex-remix.pages.dev/search?search=${hannya}`,
		} as unknown as Request
		const result = await searchLoader({
			request: mockRequest,
			context,
			params: {},
		})

		expect(result.status).toBe(200)
		const body = await result.json()
		expect(body.item).toEqual('avatar')
		expect(body.result).toBeDefined()
		expect(body.result?.length).toEqual(0)
	})
})
