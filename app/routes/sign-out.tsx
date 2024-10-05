import { type ActionFunctionArgs, redirect } from '@remix-run/cloudflare'
import { loadEnvironment } from '~/lib/utils'
import { createClient } from '~/module/supabase/create-client.server'

export const action = async ({ context, request }: ActionFunctionArgs) => {
	const env = loadEnvironment(context)
	const { supabase, headers } = createClient(request, env)
	const {
		data: { user },
	} = await supabase.auth.getUser()
	if (!user) {
		return redirect('/')
	}

	await supabase.auth.signOut()
	return redirect('/', {
		headers,
	})
}
