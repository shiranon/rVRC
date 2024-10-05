import type { LoaderFunction } from '@remix-run/cloudflare'
import { redirect } from '@remix-run/cloudflare'

//存在しないページにアクセスした場合トップページにリダイレクト

export const loader: LoaderFunction = async () => {
	return redirect('/')
}
