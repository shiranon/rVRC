import { AvatarImage } from '@radix-ui/react-avatar'
import type { MetaFunction } from '@remix-run/cloudflare'
import { useLoaderData, useParams } from '@remix-run/react'
import { useState } from 'react'
import type { folderPageLoader } from '~/.server/loaders'
import { FolderItemCard } from '~/components/card/folder-item-card'
import { DeleteOrderDialog } from '~/components/element/delete-order-dialog'
import { EditFolder } from '~/components/element/edit-folder'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { useActionToast } from '~/hooks/use-action-toast'

export { folderPageAction as action } from '~/.server/actions'
export { folderPageLoader as loader } from '~/.server/loaders'

export const meta: MetaFunction<typeof folderPageLoader> = ({ data }) => {
	if (!data) return [{ title: 'Not found' }]
	const titleElements = data.folder
		? [
				{ title: `${data.folder.name} - フォルダ rVRC` },
				{
					name: 'twitter:title',
					content: `${data.folder.name} - フォルダ`,
				},
				{
					property: 'og:title',
					content: `${data.folder.name} - フォルダ`,
				},
			]
		: []
	const descriptionElements = data
		? [
				{
					name: 'description',
					content: `${data.folder.name} - フォルダ`,
				},
				{
					name: 'twitter:description',
					content: `${data.folder.name} - フォルダ`,
				},
				{
					property: 'og:description',
					content: `${data.folder.name} - フォルダ`,
				},
			]
		: []
	const imageElements = [
		{
			name: 'twitter:image',
			content: 'https://r-vrc.net/og-image.png',
		},
		{
			property: 'og:image',
			content: 'https://r-vrc.net/og-image.png',
		},
		{
			name: 'twitter:card',
			content: 'summary_large_image',
		},
		{
			property: 'og:image:alt',
			content: 'rVRC',
		},
	]
	return [
		...titleElements,
		...descriptionElements,
		...imageElements,
		{
			property: 'og:url',
			content: `https://r-vrc.net/folder/${data.folder.id}`,
		},
		{ property: 'og:type', content: 'article' },
		{ property: 'og:site_name', content: 'rVRC' },
		{ property: 'og:locale', content: ' ja_JP' },
		{
			rel: 'canonical',
			href: `https://r-vrc.net/folder/${data.folder.id}`,
		},
		{ name: 'author', content: 'rVRC' },
	]
}

export default function Folder() {
	const { folder, avatars, cloths, isOwner } =
		useLoaderData<typeof folderPageLoader>()
	const { id } = useParams()
	const [isEdit, setIsEdit] = useState<boolean>(false)
	useActionToast()

	return (
		<div className="w-full pt-6 pb-2 px-6">
			<div className="max-w-full flex flex-row justify-between">
				<div className="grow grid px-3">
					<div className="text-sm text-gray-500 ">
						フォルダ
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
					<div className="pl-3 pt-8 text-xl font-bold">
						{`アバター ${avatars.length}件`}
					</div>
					<Card className="mt-2 bg-transparent shadow-none border-none">
						<CardContent className="grid grid-cols-2 xl:grid-cols-3 gap-2 p-0">
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
					<div className="pl-3 pt-8 text-xl font-bold">
						{`衣装 ${cloths.length}件`}
					</div>
					<Card className="mt-2 bg-transparent shadow-none border-none">
						<CardContent className="grid grid-cols-2 xl:grid-cols-3 gap-2 p-0">
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
