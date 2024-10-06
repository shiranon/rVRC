import { type ActionFunctionArgs, json, redirect } from '@remix-run/cloudflare'
import { loadEnvironment } from '~/lib/utils.server'
import { createClient } from '~/module/supabase/create-client.server'
import { FolderManager } from '~/module/supabase/folder-manager'

/**
 * フォルダページのアクション関数
 * フォルダの更新、削除、アバターの削除、衣装の削除を処理します。
 * @param request - HTTPリクエストオブジェクト
 * @param context - アプリケーションコンテキスト
 * @param params - URLパラメータ
 * @returns アクション結果を含むJSONレスポンスまたはリダイレクト
 */
export const folderPageAction = async ({
	request,
	context,
	params,
}: ActionFunctionArgs) => {
	const { id } = params
	// フォルダIDの検証
	if (!id) {
		return json({ success: false, message: 'ページエラー' })
	}

	// フォームデータの取得
	const formData = await request.formData()
	if (formData.entries().next().done) {
		return json({ success: false, message: 'フォームに値がありません。' })
	}

	const env = loadEnvironment(context)
	const { supabase } = createClient(request, env)

	// intentの値によって呼び出すフォルダ管理用メソッドを切り替え
	const intent = formData.get('intent')
	switch (intent) {
		case 'updateFolder': {
			const folderManager = new FolderManager(supabase, id)
			await folderManager.initialize()
			const result = await folderManager.updateFolder(formData)
			return json(result)
		}
		case 'deleteFolder': {
			const folderManager = new FolderManager(supabase, id)
			await folderManager.initialize()
			const result = await folderManager.deleteFolder(formData)
			if (result?.redirect) {
				return redirect(result.redirect)
			}
			return json(result)
		}
		case 'deleteAvatar': {
			const folderManager = new FolderManager(supabase, id)
			await folderManager.initialize()
			const result = await folderManager.deleteAvatar(formData)
			return json(result)
		}
		case 'deleteCloth': {
			const folderManager = new FolderManager(supabase, id)
			await folderManager.initialize()
			const result = await folderManager.deleteCloth(formData)
			return json(result)
		}
		default: {
			// 未知のintentの場合はエラーをスロー
			throw new Error('予期せぬアクション')
		}
	}
}

export type folderPageAction = typeof folderPageAction
