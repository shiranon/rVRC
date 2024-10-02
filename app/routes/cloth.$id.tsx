import type {
	ActionFunctionArgs,
	LoaderFunctionArgs,
} from '@remix-run/cloudflare'
import {
	Form,
	Link,
	json,
	redirect,
	useActionData,
	useLoaderData,
	useParams,
} from '@remix-run/react'
import { Folder, FolderPlus, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FlexItemCard } from '~/components/card/flex-item-card'
import { CreateFolder } from '~/components/element/create-folder'
import { FavoriteTag } from '~/components/element/favorite-tag'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardFooter, CardTitle } from '~/components/ui/card'
import { HeartIcon, XIcon } from '~/components/ui/icons'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '~/components/ui/popover'
import { useActionToast } from '~/hooks/use-action-toast'
import { useToast } from '~/hooks/use-toast'
import { buildItemImage, buildShopImage, formatValue } from '~/lib/format'
import { loadEnvironment, truncateString } from '~/lib/utils'
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
	const env = loadEnvironment(context)
	const { supabase } = createClient(request, env)

	const { id } = params
	if (!id) {
		return null
	}

	const clothData = await supabase
		.rpc('get_cloth_with_favorite', {
			page_id: Number.parseInt(id),
		})
		.single()

	if (!clothData.data) {
		return redirect('/')
	}

	const relationAvatar = await supabase.rpc('get_relation_avatar_data', {
		cloth_booth_id: clothData.data.booth_id,
	})

	// ログインしている場合は、フォルダーデータを取得
	const {
		data: { user },
	} = await supabase.auth.getUser()

	interface Folder {
		id: string
		name: string
	}

	let folders: { data: Folder[] | null } | null = null

	if (user) {
		folders = await supabase
			.from('folders')
			.select('id,name')
			.eq('user_id', user.id)
	}

	const foldersData = folders?.data || null

	return json({
		cloth: clothData.data,
		relationAvatar: relationAvatar.data,
		foldersData,
	})
}

export const action = async ({
	request,
	context,
	params,
}: ActionFunctionArgs) => {
	const { id } = params
	if (!id || !/^\d+$/.test(id)) {
		return redirect('/')
	}

	const formData = await request.formData()
	const intent = formData.get('intent')
	const env = loadEnvironment(context)
	const { supabase } = createClient(request, env)
	switch (intent) {
		case 'createFolder': {
			const folderManager = new FolderManager(supabase)
			await folderManager.initialize()
			const result = await folderManager.createFolder(formData)
			return json(result)
		}
		case 'addFolder': {
			const folderManager = new FolderManager(supabase)
			await folderManager.initialize()
			const result = await folderManager.addCloth(formData, id)
			return json(result)
		}
		default: {
			throw new Error('予期しないアクション')
		}
	}
}

export default function clothPage() {
	const { cloth, relationAvatar, foldersData } = useLoaderData<
		typeof loader
	>() || {
		cloth: null,
		relationAvatar: null,
	}
	const [isOpen, setIsOpen] = useState(false)
	const { id } = useParams()

	useActionToast()

	if (!cloth) return null
	return (
		<>
			<div className="flex flex-col pt-10 px-6">
				<img
					className="rounded-md"
					src={buildItemImage(cloth.image_url)}
					loading="lazy"
					alt={cloth.name}
				/>
				<div className="text-3xl pt-4 font-semibold tracking-tight leading-relaxed">
					{cloth.name}
				</div>
				<div className="flex items-center justify-end text-xl font-bold">
					<HeartIcon className="w-4 h-4 mr-1" pathProps={{ fill: '#111111' }} />
					<div>{formatValue(cloth.latest_favorite)}</div>
				</div>
				<div className="text-3xl font-semibold tracking-tight leading-relaxed text-right">
					{`￥${formatValue(cloth.price)}`}
				</div>
				<div className="flex items-center gap-2">
					<Avatar>
						<AvatarImage
							src={buildShopImage(cloth.shop_image)}
							loading="lazy"
							alt={cloth.shop_name}
						/>
						<AvatarFallback />
					</Avatar>
					<div className="pl-1 text-sm">{cloth.shop_name}</div>
				</div>
				<div className="flex justify-center items-center space-x-2 py-4">
					<Button className="rounded-2xl text-lg w-[65%] h-12 text-white font-bold border-[1px] bg-red-400  hover:bg-red-300">
						<Link
							to={`https://booth.pm/ja/items/${cloth.booth_id}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							BOOTHで購入する
						</Link>
					</Button>
					<Popover open={isOpen} onOpenChange={setIsOpen}>
						<PopoverTrigger className="ml-4">
							<FolderPlus className="size-10" />
						</PopoverTrigger>
						<PopoverContent className="p-0 space-y-1 z-[1000]">
							{foldersData &&
								foldersData.length > 0 &&
								foldersData.map((folder) => (
									<Form method="post" key={folder.id}>
										<div>
											<input type="hidden" name="folderId" value={folder.id} />
											<Button
												className="p-2 flex justify-start bg-white hover:bg-slate-200 w-full"
												type="submit"
												name="intent"
												value="addFolder"
												onClick={() => setIsOpen(false)}
											>
												<Folder />
												<div className="pl-2">
													{truncateString(folder.name, 15)}
												</div>
											</Button>
										</div>
									</Form>
								))}
							<CreateFolder actionPath={`/cloth/${id}`}>
								<div>
									<Button className="p-2 flex justify-start rounded-b-lg bg-white w-full hover:bg-slate-200">
										<Plus />
										<div>新規作成</div>
									</Button>
								</div>
							</CreateFolder>
						</PopoverContent>
					</Popover>
					<div className="size-8">
						<XIcon />
					</div>
				</div>
				{relationAvatar && relationAvatar.length > 0 ? (
					<>
						<div className="text-2xl pt-2">関連アバター</div>
						<Card className="bg-light-beige mt-4">
							<CardContent className="grid grid-cols-2 gap-2 p-2">
								{relationAvatar.map((avatar) => (
									<Card key={avatar.booth_id}>
										<Link to={`/avatar/${avatar.id}`}>
											<FlexItemCard item={avatar} />
										</Link>
									</Card>
								))}
							</CardContent>
						</Card>
					</>
				) : (
					<div className="text-xl pt-4">関連アバターはありません</div>
				)}
			</div>
		</>
	)
}
