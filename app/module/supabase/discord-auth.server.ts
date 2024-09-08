import type { SupabaseClient } from '@supabase/supabase-js'

export const signInWithDiscord = async (supabase: SupabaseClient, env: Env) => {
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: 'discord',
		options: {
			redirectTo: `${env.SITE_URL}/auth/callback`,
		},
	})
	if (error) {
		console.log(`auth error: ${error}`)
		throw error
	}
	return { data, error }
}
