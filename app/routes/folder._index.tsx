import type { MetaFunction } from '@remix-run/cloudflare'
import { Link, useLoaderData } from '@remix-run/react'
import type { folderLoader } from '~/.server/loaders'
import { Pagination } from '~/components/element/pagination'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Card, CardContent } from '~/components/ui/card'
import avatar_svg from '~/images/avatar.svg'
import cloth_svg from '~/images/cloth.svg'
import folder_holder from '~/images/folder.svg'
import { buildSmallItemImage } from '~/lib/format'

export { folderLoader as loader } from '~/.server/loaders'

export const meta: MetaFunction<typeof folderLoader> = ({ data }) => {
	if (!data) return [{ title: 'Not found' }]
	const titleElements = data
		? [
				{ title: '公開フォルダ一覧 - rVRC' },
				{
					name: 'twitter:title',
					content: 'rVRC 公開フォルダ一覧',
				},
				{
					property: 'og:title',
					content: 'rVRC 公開フォルダ一覧',
				},
			]
		: []
	const descriptionElements = data
		? [
				{
					name: 'description',
					content:
						'VRChat用アイテムを整理・共有できるフォルダ機能ページ。お気に入りのアバターや衣装を自由にカテゴリ分け。公開設定で他のユーザーとフォルダを共有可能。みんなのおすすめアイテムをチェックしよう。',
				},
				{
					name: 'twitter:description',
					content: '公開フォルダ一覧',
				},
				{
					property: 'og:description',
					content: '公開フォルダ一覧',
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
			content: 'https://r-vrc.net/folder',
		},
		{ property: 'og:type', content: 'website' },
		{ property: 'og:site_name', content: 'rVRC' },
		{ property: 'og:locale', content: ' ja_JP' },
		{
			rel: 'canonical',
			href: 'https://r-vrc.net/folder',
		},
		{ name: 'author', content: 'rVRC' },
	]
}

export default function Folder() {
	const { folders, folderCount } = useLoaderData<typeof folderLoader>()
	return (
		<>
			<div className="w-full p-6">
				<div className="pt-4">
					<div className="grid gap-2 pt-4">
						<h1 className="text-xl font-bold">公開フォルダ一覧</h1>
						{folders && folders.length > 0 ? (
							<>
								{folders.map((folder) => (
									<Card key={folder.id}>
										<Link to={`/folder/${folder.id}`}>
											<CardContent className="p-0 bg-white rounded-lg">
												<div className="relative max-w-full flex flex-row justify-between">
													<div className="flex aspect-square">
														<img
															src={
																folder.image
																	? buildSmallItemImage(folder.image)
																	: folder_holder
															}
															alt={folder.name}
															className="size-32 rounded-l-lg"
														/>
													</div>
													<div className="grow grid place-items-center">
														<div className="p-3 w-full flex flex-col gap-1">
															<div className="text-lg font-bold">
																{folder.name}
															</div>
															<div className="text-sm text-gray-500">
																{folder.description}
															</div>
														</div>
													</div>
													<div className="p-2">
														<div className="flex items-center">
															<img
																src={avatar_svg}
																alt="avatar"
																className="size-5"
															/>
															<span>{folder.avatar_count}</span>
														</div>
														<div className="flex items-center">
															<img
																src={cloth_svg}
																alt="cloth"
																className="size-5"
															/>
															<span>{folder.cloth_count}</span>
														</div>
													</div>
													<div className="absolute flex items-center bottom-2 right-2">
														<Avatar className="size-8">
															<AvatarImage
																src={`/api/avatar/${folder.user_avatar}`}
																loading="lazy"
																alt={folder.user_name}
															/>
															<AvatarFallback />
														</Avatar>
														<div className="pl-1 text-sm">
															{folder.user_name}
														</div>
													</div>
												</div>
											</CardContent>
										</Link>
									</Card>
								))}
								{folderCount && <Pagination totalItems={folderCount} />}
							</>
						) : (
							<div className="text-lg">フォルダはありません。</div>
						)}
					</div>
				</div>
			</div>
		</>
	)
}
