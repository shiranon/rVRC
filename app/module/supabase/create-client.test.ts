import { describe, expect, it, vi } from 'vitest'
import { createClient } from './create-client.server'

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

describe('supabaseClientのテスト(開発環境DBにアクセス)', () => {
	it('Supabaseが定義されているかを確認', () => {
		expect(supabase).toBeDefined()
	})

	it('DBと連携できているかをavatarsテーブルで確認', async () => {
		const { data, error } = await supabase.from('avatars').select('*').limit(10)
		expect(error).toBeNull()
		expect(data).toBeDefined()
		expect(Array.isArray(data)).toBe(true)
	}, 20000)

	it('存在しないテーブルにアクセスした場合Nullが返る', async () => {
		const { data, error } = await supabase
			// @ts-expect-error Supabaseの型定義を一時的に無視
			.from('non_existent_table')
			.select('*')
		expect(error).toBeDefined()
		expect(data).toBeNull()
	})
})
