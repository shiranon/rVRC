import type { SupabaseClient, User } from '@supabase/supabase-js'
import { generateUniqueFileName } from '~/lib/utils'

type AllowedImageType = 'png' | 'jpeg' | 'webp'

const getImageExtension = (contentType: string): AllowedImageType => {
	switch (contentType) {
		case 'image/png':
			return 'png'
		case 'image/jpeg':
			return 'jpeg'
		case 'image/webp':
			return 'webp'
		default:
			throw new Error('サポートされていない画像タイプです')
	}
}

const updateAvatar = async (
	id: string,
	fileName: string,
	supabase: SupabaseClient,
) => {
	const { data, error } = await supabase
		.from('users')
		.update([{ avatar: fileName }])
		.eq('id', id)
		.select()
	if (error) {
		console.error('update時にエラーが発生しました:', error)
		return null
	}

	return data
}

export const uploadFirstUserAvatar = async (
	user: User,
	supabase: SupabaseClient,
) => {
	const responseAvatar = await fetch(user.user_metadata.avatar_url)
	const blob = await responseAvatar.blob()
	const contentType = responseAvatar.headers.get('Content-Type')
	if (!contentType) {
		throw new Error('Content-Typeが取得できませんでした')
	}
	const extension = getImageExtension(contentType)
	const uniqueFileName = await generateUniqueFileName()
	const fileName = `${uniqueFileName}.${extension}`

	const { error } = await supabase.storage
		.from('avatar')
		.upload(fileName, blob, {
			contentType: contentType,
		})

	if (error) {
		console.error('画像のアップロードに失敗しました:', error)
		return null
	}

	updateAvatar(user.id, fileName, supabase).catch((err) => {
		console.error('update時にエラーが発生しました:', err)
	})
}
