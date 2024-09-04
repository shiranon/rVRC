import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '~/types/schema'

export const createClient = ({
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
	return createBrowserClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
}
