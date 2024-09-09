import { type LoaderFunctionArgs, json } from '@remix-run/cloudflare'
import { loadEnvironment } from '~/lib/utils'
import { createClient } from '~/module/supabase/create-client-server.server'

export const rootLoader = async ({ request, context }: LoaderFunctionArgs) => {
	const env = loadEnvironment(context)
	const { supabase } = createClient(request, env)
	const {
		data: { session },
	} = await supabase.auth.getSession()
	return json({
		isLoggedIn: !!session,
	})
}

export type rootLoader = typeof rootLoader
