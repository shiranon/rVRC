import type { ActionFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { loadEnvironment } from '~/lib/utils'
import { createClient } from '~/module/supabase/create-client-server.server'

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
