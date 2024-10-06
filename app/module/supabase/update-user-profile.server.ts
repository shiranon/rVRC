import type { SupabaseClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { profileUpdateSchema } from '~/lib/zod'

/**
 * ユーザープロフィールを更新する関数
 * @param formData - フォームから送信されたデータ
 * @param supabase - Supabaseクライアントインスタンス
 * @param userId - ユーザーID
 * @returns 更新結果を含むJSONレスポンス
 * @throws {z.ZodError} バリデーションエラーが発生した場合
 */
export const updateUserProfile = async (
	formData: FormData,
	supabase: SupabaseClient,
	userId: string,
) => {
	const rawInput = Object.fromEntries(formData)
	try {
		const validatedData = profileUpdateSchema.parse(rawInput)
		const { error: profileUpdateError } = await supabase
			.from('users')
			.update({ name: validatedData.username })
			.eq('id', userId)

		if (profileUpdateError) {
			console.error('プロフィール更新エラー:', profileUpdateError)
			return {
				success: false,
				message: 'プロフィールの更新に失敗しました',
			}
		}
		return { success: true, message: 'プロフィールを更新しました' }
	} catch (error) {
		if (error instanceof z.ZodError) {
			console.error('ユーザー編集バリデーションエラー:', error)
			return { profileErrors: error.errors }
		}
		console.error('予期せぬエラー:', error)
		return { profileError: '予期せぬエラー' }
	}
}
