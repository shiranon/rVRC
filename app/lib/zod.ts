import { z } from 'zod'

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
