import { describe, expect, it, vi } from 'vitest'
import { createTestContext } from '~/lib/test/mockCloudflareContext'
import { rankingLoader } from '.'

const env: Env = {
	SUPABASE_URL: process.env.SUPABASE_URL ?? '',
	SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ?? '',
	VITE_LOCAL_DATE: '',
	SITE_URL: '',
}

const context = createTestContext(env)

describe('rankingLoaderのテスト(開発環境DBにアクセス)', () => {
	it('itemの指定がない場合アバターが取得される', async () => {
		const mockRequest = {
			headers: {
				get: vi.fn().mockReturnValue('http://localhost:3000'),
			},
			url: 'http://localhost:3000/ranking',
		} as unknown as Request
		const result = await rankingLoader({
			request: mockRequest,
			context,
			params: {},
		})

		expect(result.status).toBe(200)
		const body = await result.json()
		expect(body.item).toEqual('avatar')
		expect(body.ranking).toBeDefined()
		expect(body.ranking?.length).toEqual(10)
	})

	it('itemがavatarの場合、アバターが取得される', async () => {
		const mockRequest = {
			headers: {
				get: vi.fn().mockReturnValue('http://localhost:3000'),
			},
			url: 'http://localhost:3000/ranking?item=avatar',
		} as unknown as Request
		const result = await rankingLoader({
			request: mockRequest,
			context,
			params: {},
		})

		expect(result.status).toBe(200)
		const body = await result.json()
		expect(body.item).toEqual('avatar')
		expect(body.ranking).toBeDefined()
		expect(body.ranking?.length).toEqual(10)
	})
	it('itemがclothの場合、衣装が取得される', async () => {
		const mockRequest = {
			headers: {
				get: vi.fn().mockReturnValue('http://localhost:3000'),
			},
			url: 'http://localhost:3000/ranking?item=cloth',
		} as unknown as Request
		const result = await rankingLoader({
			request: mockRequest,
			context,
			params: {},
		})

		expect(result.status).toBe(200)
		const body = await result.json()
		expect(body.item).toEqual('cloth')
		expect(body.ranking).toBeDefined()
		expect(body.ranking?.length).toEqual(10)
	})

	it('データの無い日付が指定された場合、空のデータが帰る', async () => {
		const mockRequest = {
			headers: {
				get: vi.fn().mockReturnValue('http://localhost:3000'),
			},
			url: 'http://localhost:3000/ranking?date=2040-10-20',
		} as unknown as Request
		const result = await rankingLoader({
			request: mockRequest,
			context,
			params: {},
		})

		expect(result.status).toBe(200)
		const body = await result.json()
		expect(body.item).toEqual('avatar')
		expect(body.ranking).toBeDefined()
		expect(body.ranking?.length).toEqual(0)
	})

	it('範囲外のページが指定された場合、空のデータが帰る', async () => {
		const mockRequest = {
			headers: {
				get: vi.fn().mockReturnValue('http://localhost:3000'),
			},
			url: 'http://localhost:3000/ranking?page=10000',
		} as unknown as Request
		const result = await rankingLoader({
			request: mockRequest,
			context,
			params: {},
		})

		expect(result.status).toBe(200)
		const body = await result.json()
		expect(body.item).toEqual('avatar')
		expect(body.ranking).toBeDefined()
		expect(body.ranking?.length).toEqual(0)
	})
})
