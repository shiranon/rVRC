export async function loader() {
	const robotText = `User-agent: *
Allow: /

Sitemap: https://r-vrc.net/sitemap.xml
    `

	return new Response(robotText, {
		status: 200,
		headers: {
			'Content-Type': 'text/plain',
		},
	})
}
