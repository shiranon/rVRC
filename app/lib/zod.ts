import { z } from 'zod'

/**
 * フォルダ用バリデーション
 * フォルダ名は必須で25文字以内、公開/非公開の値が無い場合はエラー
 */
export const folderCreateSchema = z.object({
	foldername: z
		.string()
		.min(1, 'フォルダ名は必須です')
		.max(25, 'フォルダ名が長すぎます'),
	folderDescription: z.string().max(100),
	visibility: z.enum(['public', 'private'], {
		errorMap: () => ({ message: 'フォームから入力してください' }),
	}),
})
