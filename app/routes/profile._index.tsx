import type { MetaFunction } from '@remix-run/cloudflare'
import { Link, useLoaderData } from '@remix-run/react'
import type { profileLoader } from '~/.server/loaders'
import { CreateFolder } from '~/components/element/create-folder'
import { EditProfile } from '~/components/element/edit-profile'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { useActionToast } from '~/hooks/use-action-toast'
import avatar_svg from '~/images/avatar.svg'
import cloth_svg from '~/images/cloth.svg'
import folder_holder from '~/images/folder.svg'
import { buildSmallItemImage } from '~/lib/format'

export { profileAction as action } from '~/.server/actions'
export { profileLoader as loader } from '~/.server/loaders'

export const meta: MetaFunction<typeof profileLoader> = ({ data }) => {
	if (!data) return [{ title: 'Not found' }]
	const titleElements = data.profile
		? [
				{ title: 'プロフィール | rVRC' },
				{
					name: 'twitter:title',
					content: 'プロフィール | rVRC',
				},
				{
					property: 'og:title',
					content: 'プロフィール | rVRC',
				},
			]
		: []
	const descriptionElements = data.profile
		? [
				{
					name: 'description',
					content: 'あなたのプロフィールとフォルダを管理するマイページです。',
				},
				{
					name: 'twitter:description',
					content: 'あなたのプロフィールとフォルダを管理するマイページです。',
				},
				{
					property: 'og:description',
					content: 'あなたのプロフィールとフォルダを管理するマイページです。',
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
			content: 'https://r-vrc.net/profile',
		},
		{ property: 'og:type', content: 'website' },
		{ property: 'og:site_name', content: 'rVRC' },
		{ property: 'og:locale', content: ' ja_JP' },
		{
			rel: 'canonical',
			href: 'https://r-vrc.net/profile',
		},
		{ name: 'author', content: 'rVRC' },
	]
}

export default function Profile() {
	const { profile, folders } = useLoaderData<typeof profileLoader>()
	useActionToast()
	return (
		<div className="w-full p-6">
			<div className="flex justify-between">
				<div className="flex justify-start items-center">
					<img
						src={`/api/avatar/${profile.avatar}`}
						alt={profile.name}
						className="size-20 rounded-full"
					/>
					<div className="grid pl-8 pb-4">
						<div className="text-sm">名前</div>
						<div className="text-xl font-bold">{profile.name}</div>
					</div>
				</div>
				<EditProfile actionPath={'/profile'} profile={profile}>
					<Button className="bg-black hover:bg-slate-700 text-white h-8">
						プロフィール編集
					</Button>
				</EditProfile>
			</div>
			<div className="flex justify-center pt-4 bg-light-beige">
				<Separator className="bg-slate-400" />
			</div>
			<div className="pt-4">
				<div className="flex items-center">
					<div className="text-xl font-bold pr-8">マイフォルダ</div>
					<CreateFolder actionPath={'/profile'}>
						<Button
							className={`bg-white shadow-md rounded-sm h-8 ${
								folders.length < 10
									? 'hover:shadow-lg hover:bg-white'
									: 'opacity-50 cursor-not-allowed'
							}`}
							disabled={folders.length >= 10}
						>
							新規作成<span className="pl-2">{folders.length}/10</span>
						</Button>
					</CreateFolder>
				</div>
				<div className="grid gap-2 pt-4">
					{folders.map((folder) => (
						<Card key={folder.id}>
							<Link to={`/folder/${folder.id}`}>
								<CardContent
									className={`p-0 ${folder.is_private ? 'bg-gray-100' : ''}`}
								>
									<div className="w-full flex items-center p-2 bg-white rounded-lg shadow-sm">
										<div className="flex-shrink-0 size-32 mr-3">
											<img
												src={
													folder.image_url
														? buildSmallItemImage(folder.image_url)
														: folder_holder
												}
												alt={folder.name}
												className={`w-full h-full object-cover ${!folder.image_url && 'p-6'}`}
											/>
										</div>
										<div className="flex-grow min-w-0">
											<div className="text-xl font-bold truncate">
												{folder.name}
											</div>
											<div className="text-gray-500 line-clamp-1 overflow-hidden">
												{folder.description}
											</div>
											<div className="flex items-center mt-1 text-sm text-gray-600">
												<img
													src={avatar_svg}
													alt="avatar"
													className="size-4 mr-1"
												/>
												<span className="mr-2">{folder.avatar_count}</span>
												<img
													src={cloth_svg}
													alt="cloth"
													className="size-4 mr-1"
												/>
												<span>{folder.cloth_count}</span>
											</div>
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
