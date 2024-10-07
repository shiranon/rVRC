import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { json } from '@remix-run/cloudflare'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import { generateUniqueFileName } from '~/lib/utils.server'

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
		throw new Error('update時にエラーが発生しました')
	}

	return data
}

export const uploadFirstUserAvatar = async (
	user: User,
	supabase: SupabaseClient,
	env: Env,
) => {
	const responseAvatar = await fetch(user.user_metadata.avatar_url)
	const arrayBuffer = await responseAvatar.arrayBuffer()
	const contentType = responseAvatar.headers.get('Content-Type')

	if (!contentType) {
		throw new Error('Content-Typeが取得できませんでした')
	}

	const extension = getImageExtension(contentType)

	const uniqueFileName = await generateUniqueFileName()
	const fileName = `${uniqueFileName}.${extension}`

	try {
		const s3 = new S3Client({
			region: 'auto',
			endpoint: env.R2_ENDPOINT,
			credentials: {
				accessKeyId: env.R2_ACCESS_KEY,
				secretAccessKey: env.R2_SECRET_KEY,
			},
		})

		const key = `avatar/${fileName}`

		await s3.send(
			new PutObjectCommand({
				Bucket: 'avatar',
				Key: key,
				ContentType: contentType,
				Body: new Uint8Array(arrayBuffer),
				ACL: 'public-read',
			}),
		)
	} catch (error) {
		console.error('画像のアップロードに失敗しました:', error)
		throw new Error('画像のアップロードに失敗しました')
	}
	try {
		const { data, error } = await supabase
			.from('users')
			.update([{ avatar: fileName }])
			.eq('id', user.id)
			.select()
		if (error) {
			console.error('update時にエラーが発生しました:', error)
			throw new Error('update時にエラーが発生しました')
		}
		return { success: true, fileName, data }
	} catch (error) {
		return { success: false, error }
	}
}
