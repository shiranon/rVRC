import {
	createServerClient,
	parseCookieHeader,
	serializeCookieHeader,
} from '@supabase/ssr'
import type { Database } from '~/types/schema'

export const createClient = (request: Request, env: Env) => {
	const headers = new Headers()
	const supabase = createServerClient<Database>(
		env.SUPABASE_URL,
		env.SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll() {
					return parseCookieHeader(request.headers.get('Cookie') ?? '')
				},
				setAll(cookiesToSet) {
					for (const { name, value, options } of cookiesToSet) {
						headers.append(
							'Set-Cookie',
							serializeCookieHeader(name, value, options),
						)
					}
				},
			},
		},
	)
	return { supabase, headers }
}
