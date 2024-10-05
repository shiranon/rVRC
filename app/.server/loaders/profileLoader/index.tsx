import { type LoaderFunctionArgs, json, redirect } from '@remix-run/cloudflare'
import { loadEnvironment } from '~/lib/utils.server'
import { createClient } from '~/module/supabase/create-client.server'

export const profileLoader = async ({
	request,
	context,
}: LoaderFunctionArgs) => {
	const env = loadEnvironment(context)
	const { supabase } = createClient(request, env)

	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (authError || !user) {
		return redirect('/')
	}

	const { data: userProfile, error: profileError } = await supabase
		.from('users')
		.select('name, avatar')
		.eq('id', user.id)
		.single()

	if (profileError) {
		console.error('ユーザープロフィル取得エラー:', profileError)
		throw new Response('プロフィル取得エラー', { status: 500 })
	}

	if (!userProfile) {
		throw new Response('ユーザーが見つかりません', { status: 404 })
	}

	const { data: userFolders, error: foldersError } = await supabase.rpc(
		'get_user_folder',
		{
			user_profile_id: user.id,
		},
	)

	if (!userFolders) {
		console.error('ユーザーフォルダー取得エラー:', foldersError)
		throw new Response('フォルダー取得エラー', { status: 500 })
	}

	return json({ profile: userProfile, folders: userFolders })
}

export type profileLoader = typeof profileLoader
