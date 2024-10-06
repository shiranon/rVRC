import type { SupabaseClient } from '@supabase/supabase-js'

export const signInWithDiscord = async (supabase: SupabaseClient, env: Env) => {
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: 'discord',
		options: {
			redirectTo: 'https://r-vrc.net/auth/callback',
		},
	})
	if (error) {
		console.error(`認証エラー: ${error}`)
		throw error
	}
	return { data, error }
}
