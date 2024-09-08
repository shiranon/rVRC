import { describe, expect, it } from 'vitest'
import { createClient } from './create-client-component.server'

const env: Env = {
	SUPABASE_URL: process.env.SUPABASE_URL ?? '',
	SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ?? '',
	LOCAL_DATE: '',
	SITE_URL: '',
}

describe('supabaseClient', () => {
	const supabase = createClient(env)
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

	// ユーザー認証の時にRLSが適切に機能しているかのテストを書く
})
