import {
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	json,
	redirect,
} from '@remix-run/cloudflare'
import { Link, useLoaderData } from '@remix-run/react'
import { CreateFolder } from '~/components/element/create-folder'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { useActionToast } from '~/hooks/use-action-toast'
import avatar_holder from '~/images/avatar.png'
import { buildAvatarImage } from '~/lib/format'
import { loadEnvironment } from '~/lib/utils'
import { createClient } from '~/module/supabase/create-client-server.server'
import { FolderManager } from '~/module/supabase/folder-manager'

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
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

export const action = async ({ request, context }: ActionFunctionArgs) => {
	const env = loadEnvironment(context)
	const formData = await request.formData()
	const { supabase } = createClient(request, env)
	const intent = formData.get('intent')
	switch (intent) {
		case 'createFolder': {
			const folderManager = new FolderManager(supabase)
			await folderManager.initialize()
			const result = await folderManager.createFolder(formData)
			return json(result)
		}
		default: {
			throw new Error('予期しないアクション')
		}
	}
}

export default function Profile() {
	const { profile, folders } = useLoaderData<typeof loader>()
	useActionToast()
	return (
		<div className="w-full p-6">
			<div className="flex justify-start items-center">
				<img
					src={`/api/avatar/${profile.avatar}`}
					alt={profile.name}
					className="size-20 rounded-full"
				/>
				<div className="pl-8 text-xl font-bold">{profile.name}</div>
			</div>
			<div className="flex justify-center pt-4 bg-light-beige">
				<Separator className="bg-slate-400" />
			</div>
			<div className="pt-4">
				<div className="flex items-center">
					<div className="text-xl font-bold pr-8">マイフォルダ</div>
					<CreateFolder actionPath={'/profile'}>
						<Button className="bg-white shadow-md rounded-sm h-8 hover:shadow-lg hover:bg-white">
							新規作成
						</Button>
					</CreateFolder>
				</div>
				<div className="grid gap-2 pt-4">
					{folders.map((folder) => (
						<Card key={folder.id} className="">
							<Link to={`/folder/${folder.id}`}>
								<CardContent
									className={`p-0 ${folder.is_private ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
								>
									<div className="max-w-full flex flex-row justify-between">
										<div className="flex aspect-square">
											<img
												src={
													folder.image_url
														? buildAvatarImage(folder.image_url)
														: avatar_holder
												}
												alt={folder.name}
												className="size-32 rounded-l-lg"
											/>
										</div>
										<div className="grow grid place-items-center">
											<div className="p-3 w-full flex flex-col gap-1">
												<div className="text-lg font-bold">{folder.name}</div>
												<div className="text-sm text-gray-500">
													{folder.description}
												</div>
											</div>
										</div>
										<div>
											<div>アバター:{folder.avatar_count}個</div>
											<div>衣装:{folder.cloth_count}個</div>
										</div>
									</div>
								</CardContent>
							</Link>
						</Card>
					))}
				</div>
			</div>
		</div>
	)
}
