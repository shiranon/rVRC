import { type ActionFunctionArgs, json } from '@remix-run/cloudflare'
import {
	Form,
	Link,
	redirect,
	useActionData,
	useLoaderData,
	useParams,
	useSearchParams,
} from '@remix-run/react'
import { Folder, FolderPlus, Plus } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { avatarPageLoader } from '~/.server/loaders'
import { CreateFolder } from '~/components/element/create-folder'
import { FavoriteTag } from '~/components/element/favorite-tag'
import { Pagination } from '~/components/element/pagination'
import { RelationControls } from '~/components/element/relation-controls'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardFooter, CardTitle } from '~/components/ui/card'
import { XIcon } from '~/components/ui/icons'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '~/components/ui/popover'
import { useToast } from '~/hooks/use-toast'
import { buildAvatarImage, buildShopImage, formatValue } from '~/lib/format'
import { loadEnvironment, truncateString } from '~/lib/utils'
import { createClient } from '~/module/supabase/create-client-server.server'
import { FolderManager } from '~/module/supabase/folder-manager'

type ActionData =
	| { success: true; message: string }
	| { success: false; message: string }

export { avatarPageLoader as loader } from '~/.server/loaders'

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
			const result = await folderManager.addAvatar(formData, id)
			return json(result)
		}
		default: {
			throw new Error('予期しないアクション')
		}
	}
}

export default function avatarPage() {
	const { avatar, relationCloth, totalClothCount, foldersData } =
		useLoaderData<typeof avatarPageLoader>()
	const actionData = useActionData<ActionData>()
	const [isOpen, setIsOpen] = useState(false)
	const { toast } = useToast()
	const relatedClothRef = useRef<HTMLDivElement>(null)
	const [searchParams] = useSearchParams()
	const { id } = useParams()

	const scrollToRelatedCloth = useCallback(() => {
		if (relatedClothRef.current) {
			const offset = 50
			const elementPosition =
				relatedClothRef.current.getBoundingClientRect().top + window.scrollY
			window.scrollTo({ top: elementPosition - offset, behavior: 'instant' })
		}
	}, [])

	useEffect(() => {
		if (actionData) {
			if ('success' in actionData) {
				toast({
					title: actionData.success ? '成功' : 'エラー',
					description: actionData.message,
					variant: actionData.success ? 'default' : 'destructive',
				})
			}
		}
	}, [actionData, toast])

	useEffect(() => {
		if (searchParams.toString()) {
			scrollToRelatedCloth()
		}
	}, [scrollToRelatedCloth, searchParams])

	return (
		<>
			<div className="pt-2 px-4">
				<div className="flex flex-col pt-10 px-6">
					<img
						className="rounded-md"
						src={buildAvatarImage(avatar.image_url)}
						loading="lazy"
						alt={avatar.name}
					/>
					<div className="text-3xl pt-4 font-semibold tracking-tight leading-relaxed">
						{avatar.name}
					</div>
					<div className="text-3xl font-semibold tracking-tight leading-relaxed">
						{`￥${formatValue(avatar.price)}`}
					</div>
					<div className="flex items-center justify-end text-xl font-bold">
						<svg
							aria-hidden="true"
							focusable="false"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className="w-5 h-5 mr-1"
						>
							<path
								d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z"
								fill="#111111"
							/>
						</svg>
						<div>{formatValue(avatar.latest_favorite)}</div>
					</div>
					<div className="flex pt-3 items-center gap-2">
						<Avatar>
							<AvatarImage
								src={buildShopImage(avatar.shop_image)}
								loading="lazy"
								alt={avatar.shop_name}
							/>
							<AvatarFallback />
						</Avatar>
						<div className="pl-1 text-sm">{avatar.shop_name}</div>
					</div>
					<div className="flex justify-center items-center space-x-2 py-4">
						<Button className="rounded-2xl text-lg w-[65%] h-12 text-white font-bold border-[1px] bg-red-400  hover:bg-red-300">
							<Link
								to={`https://booth.pm/ja/items/${avatar.booth_id}`}
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
												<input
													type="hidden"
													name="folderId"
													value={folder.id}
												/>
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
								<CreateFolder actionPath={`/avatar/${id}`}>
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
				</div>
				<div ref={relatedClothRef} className="text-2xl pt-4">
					関連衣装
				</div>
				<RelationControls />
				{/* <SearchControls /> */}
				<div className="py-4 text-lg">
					対応衣装（{formatValue(totalClothCount)}件）
				</div>
				{relationCloth && relationCloth.length > 0 ? (
					<>
						<Card className="bg-light-beige mt-4">
							<CardContent className="grid grid-cols-2 gap-2 p-2">
								{relationCloth.map((cloth) => (
									<Card key={cloth.booth_id}>
										<Link to={`/cloth/${cloth.id}`}>
											<CardContent className="p-4">
												<div className="relative block overflow-hidden aspect-square">
													<div className="z-10 font-bold">
														<FavoriteTag
															favorite_count={cloth.latest_favorite}
														/>
													</div>
													<img
														className="rounded-md"
														src={buildAvatarImage(cloth.image)}
														loading="lazy"
														alt={cloth.cloth_name}
													/>
												</div>
											</CardContent>
											<CardContent className="px-4 pt-0 pb-1">
												<CardTitle className="leading-relaxed text-lg h-[4rem]">
													<div className="line-clamp-2 break-words">
														{cloth.cloth_name}
													</div>
												</CardTitle>
												<div className="text-right font-bold text-lg">
													￥{formatValue(cloth.price)}
												</div>
											</CardContent>
											<CardFooter className="pb-4 justify-between">
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
											</CardFooter>
										</Link>
									</Card>
								))}
							</CardContent>
						</Card>
						{totalClothCount && <Pagination totalItems={totalClothCount} />}
					</>
				) : (
					<div className="text-xl pt-4">関連衣装はありません</div>
				)}
			</div>
		</>
	)
}
