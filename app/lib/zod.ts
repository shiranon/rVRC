import { z } from 'zod'

/**
 * フォルダ用バリデーション
 * フォルダ名は必須で25文字以内、公開/非公開の値が無い場合はエラー
 */
export const folderCreateSchema = z.object({
	foldername: z
		.string()
		.min(1, 'フォルダ名は必須です')
		.max(25, 'フォルダ名は25文字以内で入力してください'),
	folderDescription: z
		.string()
		.max(40, 'フォルダ説明は40文字以内で入力してください'),
	visibility: z.enum(['public', 'private'], {
		errorMap: () => ({ message: 'フォームから入力してください' }),
	}),
})

/**
 * プロフィール用バリデーション
 * フォルダ名は必須で25文字以内、公開/非公開の値が無い場合はエラー
 */
export const profileUpdateSchema = z.object({
	username: z
		.string()
		.min(1, 'ユーザー名は必須です')
		.max(25, 'ユーザー名は25文字以内で入力してください'),
})
