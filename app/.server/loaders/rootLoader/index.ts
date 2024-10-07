import { type LoaderFunctionArgs, json } from '@remix-run/cloudflare'
import { loadEnvironment } from '~/lib/utils.server'
import { createClient } from '~/module/supabase/create-client.server'

export const rootLoader = async ({ request, context }: LoaderFunctionArgs) => {
	const env = loadEnvironment(context)
	const { supabase } = createClient(request, env)

	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		return json({ isLoggedIn: false, user: null, needsAvatarCheck: false })
	}

	const { data: userData } = await supabase
		.from('users')
		.select('avatar,name')
		.eq('id', user.id)
		.single()

	if (!userData) {
		return json({ isLoggedIn: false, user: null, needsAvatarCheck: false })
	}

	return json({
		isLoggedIn: true,
		user: userData,
		needsAvatarCheck: !userData.avatar,
	})
}

export type rootLoader = typeof rootLoader
