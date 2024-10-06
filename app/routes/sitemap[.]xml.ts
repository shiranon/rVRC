// @ts-ignore
import { routes } from 'virtual:remix/server-build'
import { generateSitemap } from '@nasa-gcn/remix-seo'
import type { LoaderFunctionArgs } from '@remix-run/cloudflare'

export async function loader({ request }: LoaderFunctionArgs) {
	return generateSitemap(request, routes, {
		siteUrl: 'https://r-vrc.net',
		headers: {
			'Cache-Control': `public, max-age=${60 * 5}`,
		},
	})
}
