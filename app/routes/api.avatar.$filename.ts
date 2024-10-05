import type { LoaderFunctionArgs } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { loadEnvironment } from '~/lib/utils'
import { createClient } from '~/module/supabase/create-client.server'

export const loader = async ({
	params,
	request,
	context,
}: LoaderFunctionArgs) => {
	const env = loadEnvironment(context)
	const { supabase } = createClient(request, env)

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
		const { data, error } = await supabase.storage
			.from('avatar')
			.download(filename)

		if (error) {
			console.error('アバター取得エラー:', error)
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

		if (!data) {
			return json(
				{
					statusCode: 404,
					code: '404',
					error: 'Not Found',
					message: 'アバターが見つかりません',
				},
				{ status: 404 },
			)
		}

		return new Response(data, {
			headers: {
				'Content-Type': data.type || 'application/octet-stream',
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
