import { createClient } from '@supabase/supabase-js'
import type { Database } from '~/types/schema'

export const getSupabaseClient = ({
	context,
}: { context?: { cloudflare: { env: Env } } } = {}) => {
	let env: Env
	try {
		env = process.env as unknown as Env
	} catch {
		if (!context) {
			throw new Error('Context is required in Cloudflare Pages environment')
		}
		env = context.cloudflare.env as Env
	}

	if (!(env.SUPABASE_URL && env.SUPABASE_ANON_KEY)) {
		throw new Error('SUPABASE_URL or SUPABASE_ANON_KEY is not defined')
	}

	return createClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
}
