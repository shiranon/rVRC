import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import type { LoaderFunctionArgs } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { loadEnvironment } from '~/lib/utils.server'

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
	const env = loadEnvironment(context)

	const filename = params.filename

	if (!filename) {
		return json(
			{
				statusCode: 400,
				code: '400',
				error: 'Bad Request',
				message: 'ファイル名が必要です',
			},
			{ status: 400 },
		)
	}

	try {
		const key = `avatar/${filename}`

		const s3 = new S3Client({
			region: 'auto',
			endpoint: env.R2_ENDPOINT,
			credentials: {
				accessKeyId: env.R2_ACCESS_KEY,
				secretAccessKey: env.R2_SECRET_KEY,
			},
		})

		const getAvatarResponse = await s3.send(
			new GetObjectCommand({
				Bucket: 'avatar',
				Key: key,
			}),
		)

		if (!getAvatarResponse.Body) {
			console.error('アバター取得エラー')
			return json(
				{
					statusCode: 404,
					code: '404',
					error: 'Not Found',
					message: 'アバターの取得に失敗しました',
				},
				{ status: 404 },
			)
		}

		const stream = getAvatarResponse.Body as ReadableStream

		return new Response(stream, {
			headers: {
				'Content-Type':
					getAvatarResponse.ContentType || 'application/octet-stream',
				'Cache-Control': 'public, max-age=3600',
			},
		})
	} catch (error) {
		console.error('予期せぬエラー:', error)
		return json(
			{
				statusCode: 500,
				code: '500',
				error: 'Internal Server Error',
				message: 'サーバーエラーが発生しました',
			},
			{ status: 500 },
		)
	}
}
