import { describe, expect, it, vi } from 'vitest'
import { localEnv } from '~/lib/test/localEnv'
import { createTestContext } from '~/lib/test/mockCloudflareContext'
import { trendLoader } from '.'

const context = createTestContext(localEnv)

describe('trendLoaderのテスト(開発環境DBにアクセス)', () => {
	it('itemの指定がない場合アバターが取得される', async () => {
		const mockRequest = {
			headers: {
				get: vi.fn().mockReturnValue('http://localhost:3000'),
			},
			url: 'http://localhost:3000/trend',
		} as unknown as Request
		const result = await trendLoader({
			request: mockRequest,
			context,
			params: {},
		})

		expect(result.status).toBe(200)
		const body = await result.json()
		expect(body.item).toEqual('avatar')
		expect(body.trend).toBeDefined()
		expect(body.trend?.length).toEqual(10)
	})

	it('itemがavatarの場合、アバターが取得される', async () => {
		const mockRequest = {
			headers: {
				get: vi.fn().mockReturnValue('http://localhost:3000'),
			},
			url: 'http://localhost:3000/trend?item=avatar',
		} as unknown as Request
		const result = await trendLoader({
			request: mockRequest,
			context,
			params: {},
		})

		expect(result.status).toBe(200)
		const body = await result.json()
		expect(body.item).toEqual('avatar')
		expect(body.trend).toBeDefined()
		expect(body.trend?.length).toEqual(10)
	})
	it('itemがclothの場合、衣装が取得される', async () => {
		const mockRequest = {
			headers: {
				get: vi.fn().mockReturnValue('http://localhost:3000'),
			},
			url: 'http://localhost:3000/trend?item=cloth',
		} as unknown as Request
		const result = await trendLoader({
			request: mockRequest,
			context,
			params: {},
		})

		expect(result.status).toBe(200)
		const body = await result.json()
		expect(body.item).toEqual('cloth')
		expect(body.trend).toBeDefined()
		expect(body.trend?.length).toEqual(10)
	})

	it('データの無い日付が指定された場合、空のデータが帰る', async () => {
		const mockRequest = {
			headers: {
				get: vi.fn().mockReturnValue('http://localhost:3000'),
			},
			url: 'http://localhost:3000/trend?date=2040-10-20',
		} as unknown as Request
		const result = await trendLoader({
			request: mockRequest,
			context,
			params: {},
		})

		expect(result.status).toBe(200)
		const body = await result.json()
		expect(body.item).toEqual('avatar')
		expect(body.trend).toBeDefined()
		expect(body.trend?.length).toEqual(0)
	})

	it('範囲外のページが指定された場合、空のデータが帰る', async () => {
		const mockRequest = {
			headers: {
				get: vi.fn().mockReturnValue('http://localhost:3000'),
			},
			url: 'http://localhost:3000/trend?page=10000',
		} as unknown as Request
		const result = await trendLoader({
			request: mockRequest,
			context,
			params: {},
		})

		expect(result.status).toBe(200)
		const body = await result.json()
		expect(body.item).toEqual('avatar')
		expect(body.trend).toBeDefined()
		expect(body.trend?.length).toEqual(0)
	})
})
