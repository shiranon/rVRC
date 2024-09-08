import { describe, expect, it } from 'vitest'
import { createClient } from '../supabase/create-client-component.server'
import { getAvatarRanking } from './get-avatar-ranking'

const env: Env = {
	SUPABASE_URL: process.env.SUPABASE_URL ?? '',
	SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ?? '',
	LOCAL_DATE: '',
	SITE_URL: '',
}

const supabase = createClient(env)

describe('getAvatarRanking関数のテスト', () => {
	it('ランキングが取得できるかテスト', async () => {
		const type = 'day'
		const page = 1
		const date = '2024-08-20'

		const result = await getAvatarRanking(type, page, supabase, date)

		expect(result.data).toBeDefined()
		if (result.data) {
			expect(Array.isArray(result.data)).toBe(true)
			expect(result.data.length).toBeGreaterThan(0)
			expect(result.data[0]).toHaveProperty('booth_id')
			expect(result.data[0]).toHaveProperty('avatar_name')
		} else {
			fail('result.data is null')
		}
	})

	it('データが存在しない日付を指定した場合のテスト', async () => {
		const type = 'day'
		const page = 1
		const date = '2023-08-26'

		const result = await getAvatarRanking(type, page, supabase, date)

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
			await getAvatarRanking(type, page, supabase, date)
		} catch (error) {
			expect(error).toBeInstanceOf(Error)
			expect((error as Error).message).toContain('Invalid ranking type')
		}
	})
})
function fail(arg0: string) {
	throw new Error('Function not implemented.')
}
