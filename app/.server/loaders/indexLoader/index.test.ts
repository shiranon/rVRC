import { describe, expect, it, vi } from 'vitest'
import { localEnv } from '~/lib/test/localEnv'
import { createTestContext } from '~/lib/test/mockCloudflareContext'
import { indexLoader } from '.'

const context = createTestContext(localEnv)

describe('indexLoaderのテスト(開発環境DBにアクセス)', () => {
	it('itemの指定がない場合アバターが取得される', async () => {
		const mockRequest = {
			headers: {
				get: vi.fn().mockReturnValue('http://localhost:3000'),
			},
			url: 'http://localhost:3000/',
		} as unknown as Request
		const result = await indexLoader({
			request: mockRequest,
			context,
			params: {},
		})

		expect(result.status).toBe(200)
		const body = await result.json()
		expect(body.item).toEqual('avatar')
		expect(body.ranking).toBeDefined()
		expect(body.ranking.data?.length).toEqual(4)
		expect(body.trend).toBeDefined()
		expect(body.trend.data?.length).toEqual(4)
	})

	it('itemがavatarの場合、アバターが取得される', async () => {
		const mockRequest = {
			headers: {
				get: vi.fn().mockReturnValue('http://localhost:3000'),
			},
			url: 'http://localhost:3000/?item=avatar',
		} as unknown as Request
		const result = await indexLoader({
			request: mockRequest,
			context,
			params: {},
		})

		expect(result.status).toBe(200)
		const body = await result.json()
		expect(body.item).toEqual('avatar')
		expect(body.ranking).toBeDefined()
		expect(body.ranking.data?.length).toEqual(4)
		expect(body.trend).toBeDefined()
		expect(body.trend.data?.length).toEqual(4)
	})
	it('itemがclothの場合、衣装が取得される', async () => {
		const mockRequest = {
			headers: {
				get: vi.fn().mockReturnValue('http://localhost:3000'),
			},
			url: 'http://localhost:3000/?item=cloth',
		} as unknown as Request
		const result = await indexLoader({
			request: mockRequest,
			context,
			params: {},
		})

		expect(result.status).toBe(200)
		const body = await result.json()
		expect(body.item).toEqual('cloth')
		expect(body.ranking).toBeDefined()
		expect(body.ranking.data?.length).toEqual(4)
		expect(body.trend).toBeDefined()
		expect(body.trend.data?.length).toEqual(4)
	})
})
