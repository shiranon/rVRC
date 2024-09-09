import { type LoaderFunctionArgs, json } from '@remix-run/cloudflare'
import { loadEnvironment } from '~/lib/utils'
import { createClient } from '~/module/supabase/create-client-server.server'

export const rootLoader = async ({ request, context }: LoaderFunctionArgs) => {
	const env = loadEnvironment(context)
	const { supabase } = createClient(request, env)
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		return json({ isLoggedIn: false, user: null })
	}

	const { data: users } = await supabase
		.from('users')
		.select('avatar,name')
		.eq('id', user.id)

	if (!users) {
		return json({ isLoggedIn: false, user: null })
	}

	return json({
		isLoggedIn: !!user,
		user: users[0],
	})
}

export type rootLoader = typeof rootLoader
