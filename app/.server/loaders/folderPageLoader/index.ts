import { type LoaderFunctionArgs, json, redirect } from '@remix-run/cloudflare'
import { loadEnvironment } from '~/lib/utils.server'
import { createClient } from '~/module/supabase/create-client.server'
import type { FolderItem } from '~/types/items'

/**
 * フォルダデータを取得するためのローダー関数
 * リクエストに基づいて、フォルダ、フォルダ内アイテムデータを取得します。
 * @param request - HTTPリクエストオブジェクト
 * @param context - アプリケーションコンテキスト
 * @param params - URLパラメータ
 * @returns フォルダページデータを含むJSONレスポンス
 */
export const folderPageLoader = async ({
	request,
	context,
	params,
}: LoaderFunctionArgs) => {
	// フォルダIDの検証
	const { id } = params
	if (!id) {
		return redirect('/')
	}

	const env = loadEnvironment(context)
	const { supabase } = createClient(request, env)

	// フォルダデータの取得
	const { data: folderData, error: folderError } = await supabase
		.rpc('get_folder_data', {
			page_folder_id: id,
		})
		.single()

	if (!folderData) {
		console.error('フォルダ取得に失敗しました', folderData)
		return redirect('/')
	}

	if (folderError) {
		console.error('フォルダ取得時にエラーが発生しました', folderError)
		return redirect('/')
	}

	// 非公開フォルダの場合はオーナーのみアクセス可能
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (folderData.is_private && (!user || user.id !== folderData.user_id)) {
		console.error('アクセス権がありません', folderError)
		return redirect('/')
	}

	const isOwner = user && folderData.user_id === user.id

	// フォルダ内アイテムデータの取得
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

	return json({ folder: folderData, avatars, cloths, isOwner })
}

export type folderPageLoader = typeof folderPageLoader
