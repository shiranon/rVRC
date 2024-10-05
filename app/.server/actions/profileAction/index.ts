import { type ActionFunctionArgs, json } from '@remix-run/cloudflare'
import { loadEnvironment } from '~/lib/utils'
import { createClient } from '~/module/supabase/create-client.server'
import { FolderManager } from '~/module/supabase/folder-manager'

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

	const env = loadEnvironment(context)
	const { supabase } = createClient(request, env)

	// intentに基づいて処理を分岐
	const intent = formData.get('intent')
	switch (intent) {
		case 'createFolder': {
			const folderManager = new FolderManager(supabase)
			await folderManager.initialize()
			const result = await folderManager.createFolder(formData)
			return json(result)
		}
		default: {
			// 未知のintentの場合はエラーをスロー
			throw new Error('予期しないアクション')
		}
	}
}

export type profileAction = typeof profileAction
