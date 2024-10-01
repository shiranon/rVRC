import { AvatarImage } from '@radix-ui/react-avatar'
import {
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	json,
	redirect,
} from '@remix-run/cloudflare'
import { useActionData, useLoaderData, useParams } from '@remix-run/react'
import { useEffect } from 'react'
import { DeleteOrderDialog } from '~/components/element/delete-order-dialog'
import { EditFolder } from '~/components/element/edit-folder'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { useActionToast } from '~/hooks/use-action-toast'
import { useToast } from '~/hooks/use-toast'
import { loadEnvironment } from '~/lib/utils'
import { createClient } from '~/module/supabase/create-client-server.server'
import { FolderManager } from '~/module/supabase/folder-manager'

type ActionData =
	| { success: true; message: string }
	| { success: false; message: string }

export const loader = async ({
	request,
	context,
	params,
}: LoaderFunctionArgs) => {
	const { id } = params
	if (!id) {
		return redirect('/')
	}

	const env = loadEnvironment(context)
	const { supabase } = createClient(request, env)

	const { data: folder, error: folderError } = await supabase
		.rpc('get_folder_data', {
			page_folder_id: id,
		})
		.single()

	if (!folder) {
		console.error('フォルダ取得に失敗しました', folderError)
		return redirect('/')
	}
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (folder.is_private && (!user || user.id !== folder.user_id)) {
		console.error('アクセス権がありません', folderError)
		return redirect('/')
	}

	const isOwner = user && folder.user_id === user.id

	return json({ folder, isOwner })
}

export const action = async ({
	request,
	context,
	params,
}: ActionFunctionArgs) => {
	const { id } = params
	if (!id) {
		return json({ success: false, message: 'ページエラー' })
	}
	const formData = await request.formData()
	const intent = formData.get('intent')
	const env = loadEnvironment(context)
	const { supabase } = createClient(request, env)
	console.log('called', intent)
	switch (intent) {
		case 'updateFolder': {
			const folderManager = new FolderManager(supabase, id)
			await folderManager.initialize()
			const result = await folderManager.updateFolder(formData)
			return json(result)
		}
		case 'deleteFolder': {
			const folderManager = new FolderManager(supabase, id)
			await folderManager.initialize()
			const result = await folderManager.deleteFolder(formData)
			if (result?.redirect) {
				return redirect(result.redirect)
			}
			return json(result)
		}
		default: {
			throw new Error('予期しないアクション')
		}
	}
}

export default function Folder() {
	const { folder, isOwner } = useLoaderData<typeof loader>()
	const { id } = useParams()

	useActionToast()

	return (
		<div className="w-full pt-6 pb-2 px-6">
			<div className="max-w-full flex flex-row justify-between">
				<div className="grow grid px-3">
					<div className="text-sm text-gray-500 ">フォルダー</div>
					<div className="text-xl font-bold">{folder.name}</div>
					<div className="text-sm text-gray-500">{folder.description}</div>
				</div>
				<div className="flex-1">
					<div className="text-sm text-gray-500">作成者</div>
					<div className="flex pt-2 items-center">
						<Avatar className="size-6">
							<AvatarImage
								src={`/api/avatar/${folder.user_avatar}`}
								loading="lazy"
								alt={folder.user_name}
							/>
							<AvatarFallback />
						</Avatar>
						<div className="text-sm pl-2">{folder.user_name}</div>
					</div>
				</div>
			</div>
			{isOwner && (
				<div className="pt-2 pl-2 flex justify-end">
					<EditFolder actionPath={`/folder/${id}`} folder={folder}>
						<Button className="rounded-xl h-8 bg-white text-light-gray border-[1px] border-beige hover:bg-slate-300">
							編集
						</Button>
					</EditFolder>
					<DeleteOrderDialog
						actionPath={`/folder/${folder.id}`}
						subject="folder"
						id={folder.id}
					>
						<Button
							type="submit"
							className="ml-1 rounded-xl h-8 bg-white text-light-gray border-[1px] border-beige hover:bg-slate-300"
						>
							削除
						</Button>
					</DeleteOrderDialog>
				</div>
			)}
			<div className="flex justify-center pt-2 ">
				<Separator className="bg-slate-400" />
			</div>
			<div>衣装</div>
		</div>
	)
}
