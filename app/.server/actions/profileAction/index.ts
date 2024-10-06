import { type ActionFunctionArgs, json } from '@remix-run/cloudflare'
import { loadEnvironment } from '~/lib/utils.server'
import { createClient } from '~/module/supabase/create-client.server'
import { FolderManager } from '~/module/supabase/folder-manager'
import { updateUserProfile } from '~/module/supabase/update-user-profile.server'

/**
 * プロフィールページのアクション関数
 * @param request - HTTPリクエストオブジェクト
 * @param context - アプリケーションコンテキスト
 * @returns アクション結果を含むJSONレスポンス
 */
export const profileAction = async ({
	request,
	context,
}: ActionFunctionArgs) => {
	// フォームデータの取得
	const formData = await request.formData()
	if (formData.entries().next().done) {
		return json({ success: false, message: 'フォームに値がありません。' })
	}

	const env = loadEnvironment(context)
	const { supabase } = createClient(request, env)

	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (!user || authError) {
		console.error('ユーザー認証エラー:', authError)
		throw new Response('プロフィル取得エラー', { status: 500 })
	}

	// intentに基づいて処理を分岐
	const intent = formData.get('intent')
	switch (intent) {
		case 'createFolder': {
			const folderManager = new FolderManager(supabase)
			await folderManager.initialize()
			const result = await folderManager.createFolder(formData)
			return json(result)
		}
		case 'editProfile': {
			const result = await updateUserProfile(formData, supabase, user.id)
			return json(result)
		}
		default: {
			// 未知のintentの場合はエラーをスロー
			throw new Error('予期せぬアクション')
		}
	}
}

export type profileAction = typeof profileAction
