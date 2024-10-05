import { describe, expect, it, vi } from 'vitest'
import { createClient } from '../supabase/create-client.server'
import { getClothRanking } from './get-cloth-ranking'

const env: Env = {
	SUPABASE_URL: process.env.SUPABASE_URL ?? '',
	SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ?? '',
	VITE_LOCAL_DATE: '',
	SITE_URL: '',
}

const mockRequest = {
	headers: {
		get: vi.fn().mockReturnValue('http://localhost:3000'),
	},
} as unknown as Request

const { supabase } = createClient(mockRequest, env)

describe('getClothRanking関数のテスト', () => {
	it('ランキングが取得できるかテスト', async () => {
		const type = 'day'
		const page = 1
		const date = '2024-08-20'

		const result = await getClothRanking(type, page, supabase, date)

		expect(result.data).toBeDefined()
		if (result.data) {
			expect(Array.isArray(result.data)).toBe(true)
			expect(result.data.length).toBeGreaterThan(0)
			expect(result.data[0]).toHaveProperty('booth_id')
			expect(result.data[0]).toHaveProperty('item_name')
		} else {
			fail('result.data is null')
		}
	})

	it('月間ランキングが取得できるかテスト', async () => {
		const type = 'month'
		const page = 1
		const date = '2024-09-30'

		const result = await getClothRanking(type, page, supabase, date)

		expect(result.data).toBeDefined()
		if (result.data) {
			expect(Array.isArray(result.data)).toBe(true)
			expect(result.data.length).toBeGreaterThan(0)
			expect(result.data[0]).toHaveProperty('booth_id')
			expect(result.data[0]).toHaveProperty('item_name')
		} else {
			fail('result.data is null')
		}
	})

	it('トレンドが取得できるかテスト', async () => {
		const type = 'trend'
		const page = 1
		const date = '2024-09-30'

		const result = await getClothRanking(type, page, supabase, date)

		expect(result.data).toBeDefined()
		if (result.data) {
			expect(Array.isArray(result.data)).toBe(true)
			expect(result.data.length).toBeGreaterThan(0)
			expect(result.data[0]).toHaveProperty('booth_id')
			expect(result.data[0]).toHaveProperty('item_name')
		} else {
			fail('result.data is null')
		}
	})

	it('データが存在しない日付を指定した場合のテスト', async () => {
		const type = 'day'
		const page = 1
		const date = '2023-08-26'

		const result = await getClothRanking(type, page, supabase, date)

		expect(result.data).toBeDefined()
		if (result.data) {
			expect(Array.isArray(result.data)).toBe(true)
			expect(result.data.length).toBe(0)
		} else {
			fail('result.data is null')
		}
	})

	it('不正なタイプでエラーが返るかテスト', async () => {
		const type = 'invalid_type'
		const page = 1
		const date = '2023-08-20'

		try {
			await getClothRanking(type, page, supabase, date)
		} catch (error) {
			expect(error).toBeInstanceOf(Error)
			expect((error as Error).message).toContain('Invalid ranking type')
		}
	})
})
function fail(arg0: string) {
	throw new Error('Function not implemented.')
}
