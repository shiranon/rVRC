import type { SupabaseClient } from '@supabase/supabase-js'

export const signInWithDiscord = async (supabase: SupabaseClient, env: Env) => {
	console.log('called signIn', `${env.SITE_URL}/auth/callback`)
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: 'discord',
		options: {
			redirectTo: `${env.SITE_URL}/auth/callback`,
		},
	})
	if (error) {
		console.error(`認証エラー: ${error}`)
		throw error
	}
	return { data, error }
}
