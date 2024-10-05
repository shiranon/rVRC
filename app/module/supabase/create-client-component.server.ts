import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '~/types/schema'

export const createClient = (env: Env) => {
	return createBrowserClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
}
