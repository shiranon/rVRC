import { type LoaderFunctionArgs, json, redirect } from '@remix-run/cloudflare'
import { loadEnvironment } from '~/lib/utils'
import { createClient } from '~/module/supabase/create-client.server'

/**
 * 衣装データを取得するためのローダー関数
 * リクエストに基づいて、衣装、関連アバターのデータを取得します。
 * @param request - HTTPリクエストオブジェクト
 * @param context - アプリケーションコンテキスト
 * @param params - URLパラメータ
 * @returns 衣装ページデータを含むJSONレスポンス
 */
export const clothPageLoader = async ({
	request,
	context,
	params,
}: LoaderFunctionArgs) => {
	const env = loadEnvironment(context)
	const { supabase } = createClient(request, env)

	// 衣装IDの検証
	const { id } = params
	if (!id || !/^\d+$/.test(id)) {
		return redirect('/')
	}

	// 衣装データの取得
	const { data: clothData, error: clothDataError } = await supabase
		.rpc('get_cloth_with_favorite', {
			page_id: Number.parseInt(id),
		})
		.single()

	if (!clothData) {
		console.error('衣装データがありません', clothDataError)
		return redirect('/')
	}

	if (clothDataError) {
		console.error('衣装データの取得時にエラー', clothDataError)
		return redirect('/')
	}

	//関連アバターデータの取得
	const { data: relationAvatarData, error: relationAvatarError } =
		await supabase.rpc('get_relation_avatar_data', {
			cloth_booth_id: clothData.booth_id,
		})

	if (relationAvatarError) {
		console.error('関連アバターデータの取得時にエラー', relationAvatarError)
		return redirect('/')
	}

	// ログインしている場合はフォルダーデータを取得
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
		cloth: clothData,
		relationAvatar: relationAvatarData,
		foldersData,
		isLoggedIn: !!user,
	})
}

export type clothPageLoader = typeof clothPageLoader
