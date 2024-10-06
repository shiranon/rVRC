import { type LoaderFunctionArgs, json, redirect } from '@remix-run/cloudflare'
import { loadEnvironment } from '~/lib/utils.server'
import { createClient } from '~/module/supabase/create-client.server'

/**
 * フォルダデータを取得するためのローダー関数
 * リクエストに基づいて、フォルダ一覧データを取得します。
 * @param request - HTTPリクエストオブジェクト
 * @param context - アプリケーションコンテキスト
 * @returns フォルダ一覧データを含むJSONレスポンス
 */
export const folderLoader = async ({
	request,
	context,
}: LoaderFunctionArgs) => {
	const url = new URL(request.url)

	const env = loadEnvironment(context)
	const { supabase } = createClient(request, env)

	const limit = 10
	const page = Number.parseInt(url.searchParams.get('page') || '1', 10)

	// 公開フォルダデータ一覧の取得
	const { data: folders, error: foldersError } = await supabase.rpc(
		'get_folders',
		{
			page_limit: limit,
			page_offset: (page - 1) * limit,
		},
	)

	if (foldersError) {
		console.error('フォルダ取得に失敗しました', foldersError)
		return redirect('/')
	}

	// 公開フォルダの総数の取得
	const { count: folderCount, error: folderCountError } = await supabase
		.from('folders')
		.select('*', { count: 'exact', head: true })
		.eq('is_private', false)

	if (folderCountError) {
		console.error('公開フォルダ総数の取得時にエラー', folderCountError)
		return redirect('/')
	}

	return json({ folders, folderCount })
}

export type folderLoader = typeof folderLoader
