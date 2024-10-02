import { AvatarImage } from '@radix-ui/react-avatar'
import {
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	json,
	redirect,
} from '@remix-run/cloudflare'
import { Link, useLoaderData, useParams } from '@remix-run/react'
import { useState } from 'react'
import { FolderItemCard } from '~/components/card/folder-item-card'
import { DeleteOrderDialog } from '~/components/element/delete-order-dialog'
import { EditFolder } from '~/components/element/edit-folder'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { useActionToast } from '~/hooks/use-action-toast'
import { loadEnvironment } from '~/lib/utils'
import { createClient } from '~/module/supabase/create-client-server.server'
import { FolderManager } from '~/module/supabase/folder-manager'
import type { FolderItem } from '~/types/items'

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

	const { data: items, error: itemsError } = await supabase.rpc(
		'get_folder_items',
		{
			page_folder_id: id,
		},
	)

	if (itemsError) {
		console.error('フォルダアイテムの取得に失敗しました', itemsError)
		return redirect('/')
	}

	const avatars = items.filter(
		(item: FolderItem) => item.item_type === 'avatar',
	)
	const cloths = items.filter((item: FolderItem) => item.item_type === 'cloth')

	return json({ folder, avatars, cloths, isOwner })
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
		case 'deleteAvatar': {
			const folderManager = new FolderManager(supabase, id)
			await folderManager.initialize()
			const result = await folderManager.deleteAvatar(formData)
			return json(result)
		}
		case 'deleteCloth': {
			const folderManager = new FolderManager(supabase, id)
			await folderManager.initialize()
			const result = await folderManager.deleteCloth(formData)
			return json(result)
		}
		default: {
			throw new Error('予期しないアクション')
		}
	}
}

export default function Folder() {
	const { folder, avatars, cloths, isOwner } = useLoaderData<typeof loader>()
	const { id } = useParams()
	const [isEdit, setIsEdit] = useState<boolean>(false)
	useActionToast()

	return (
		<div className="w-full pt-6 pb-2 px-6">
			<div className="max-w-full flex flex-row justify-between">
				<div className="grow grid px-3">
					<div className="text-sm text-gray-500 ">
						フォルダー
						{folder.is_private && (
							<span className="bg-black text-white rounded-lg text-xs p-0.5 ml-2">
								非公開
							</span>
						)}
					</div>
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
					<Button
						className={`rounded-xl h-8 text-light-gray border-[1px] ${isEdit ? 'text-white bg-black hover:bg-slate-600 border-beige' : 'bg-white border-beige hover:bg-slate-300'}`}
						onClick={() => setIsEdit((prev) => !prev)}
					>
						アイテム編集
					</Button>
					<EditFolder actionPath={`/folder/${id}`} folder={folder}>
						<Button className="mx-1 rounded-xl h-8 bg-white text-light-gray border-[1px] border-beige hover:bg-slate-300">
							フォルダ編集
						</Button>
					</EditFolder>
					<DeleteOrderDialog
						actionPath={`/folder/${folder.id}`}
						subject="folder"
						id={folder.id}
					>
						<Button
							type="submit"
							className="rounded-xl h-8 bg-white text-light-gray border-[1px] border-beige hover:bg-slate-300"
						>
							削除
						</Button>
					</DeleteOrderDialog>
				</div>
			)}
			<div className="flex justify-center pt-2 ">
				<Separator className="bg-slate-400" />
			</div>
			{avatars && avatars.length > 0 && (
				<>
					<div className="pl-3 pt-3 text-xl font-bold">アバター</div>
					<Card className="mt-2 bg-transparent shadow-none border-none">
						<CardContent className="grid grid-cols-2 gap-2 p-0">
							{avatars.map((item) => (
								<Card key={item.booth_id}>
									<FolderItemCard item={item} id={folder.id} isEdit={isEdit} />
								</Card>
							))}
						</CardContent>
					</Card>
				</>
			)}
			{cloths && cloths.length > 0 && (
				<>
					<div className="pl-3 pt-3 text-xl font-bold">衣装</div>
					<Card className="mt-2 bg-transparent shadow-none border-none">
						<CardContent className="grid grid-cols-2 gap-2 p-0">
							{cloths.map((item) => (
								<Card key={item.booth_id}>
									<FolderItemCard item={item} id={folder.id} isEdit={isEdit} />
								</Card>
							))}
						</CardContent>
					</Card>
				</>
			)}
			{isOwner && isEdit && (
				<div className="flex items-center justify-end sticky bottom-6 z-50">
					<Button
						className="bg-black hover:bg-slate-600 text-white"
						onClick={() => setIsEdit(false)}
					>
						完了
					</Button>
				</div>
			)}
		</div>
	)
}
