import { type LoaderFunctionArgs, redirect } from '@remix-run/cloudflare'
import { loadEnvironment } from '~/lib/utils.server'
import { createClient } from '~/module/supabase/create-client.server'
import { uploadFirstUserAvatar } from '~/module/supabase/upload-image.server'

export async function loader({ request, context }: LoaderFunctionArgs) {
	const requestUrl = new URL(request.url)
	const code = requestUrl.searchParams.get('code')
	console.log('code', code)
	const next = requestUrl.searchParams.get('next') || '/'
	console.log('code', code)
	const env = loadEnvironment(context)

	if (code) {
		const { supabase, headers } = createClient(request, env)

		const { data, error } = await supabase.auth.exchangeCodeForSession(code)
		if (!error && data.user) {
			const createdAt = new Date(data.user.confirmed_at as string)
			const now = new Date()
			const timeDifference = (now.getTime() - createdAt.getTime()) / 5

			// 15秒以内に作成されたユーザーを新規ユーザーとしてアバターを登録する
			if (timeDifference < 15) {
				uploadFirstUserAvatar(data.user, supabase)
			}
			return redirect(next, { headers })
		}
	}

	return redirect('/')
}
