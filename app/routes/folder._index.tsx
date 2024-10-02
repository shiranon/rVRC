import { type LoaderFunctionArgs, json, redirect } from '@remix-run/cloudflare'
import { Link, useLoaderData } from '@remix-run/react'
import { Shirt, VenetianMask } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Card, CardContent } from '~/components/ui/card'
import avatar_holder from '~/images/avatar.png'
import { buildSmallItemImage } from '~/lib/format'
import { loadEnvironment } from '~/lib/utils'
import { createClient } from '~/module/supabase/create-client-server.server'

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
	const env = loadEnvironment(context)
	const { supabase } = createClient(request, env)

	const { data: folders, error: foldersError } =
		await supabase.rpc('get_folders')

	console.log(folders)

	if (foldersError) {
		console.error('フォルダ取得に失敗しました', foldersError)
		return redirect('/')
	}

	return json({ folders })
}

export default function Folder() {
	const { folders } = useLoaderData<typeof loader>()
	return (
		<>
			<div className="w-full p-6">
				<div className="pt-4">
					<div className="grid gap-2 pt-4">
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
											<div className="p-2">
												<div className="flex items-center">
													<Shirt />
													<span>{folder.avatar_count}</span>
												</div>
												<div className="flex items-center">
													<VenetianMask />
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
												<div className="pl-1 text-sm">{folder.user_name}</div>
											</div>
										</div>
									</CardContent>
								</Link>
							</Card>
						))}
					</div>
				</div>
			</div>
		</>
	)
}
