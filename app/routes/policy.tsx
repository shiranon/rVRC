import type { MetaFunction } from '@remix-run/cloudflare'

export const meta: MetaFunction = () => {
	const titleElements = [
		{ title: 'プライバシーポリシー - rVRC' },
		{
			name: 'twitter:title',
			content: 'プライバシーポリシー - rVRC',
		},
		{
			property: 'og:title',
			content: 'プライバシーポリシー - rVRC',
		},
	]

	const descriptionElements = [
		{
			name: 'description',
			content: 'プライバシーポリシー - rVRC',
		},
		{
			name: 'twitter:description',
			content: 'プライバシーポリシー - rVRC',
		},
		{
			property: 'og:description',
			content: 'プライバシーポリシー - rVRC',
		},
	]
	const imageElements = [
		{
			name: 'twitter:image',
			content: 'https://r-vrc.net/og-image.png',
		},
		{
			property: 'og:image',
			content: 'https://r-vrc.net/og-image.png',
		},
		{
			name: 'twitter:card',
			content: 'summary_large_image',
		},
		{
			property: 'og:image:alt',
			content: 'rVRC',
		},
	]
	return [
		...titleElements,
		...descriptionElements,
		...imageElements,
		{
			property: 'og:url',
			content: 'https://r-vrc.net/policy',
		},
		{ property: 'og:type', content: 'website' },
		{ property: 'og:site_name', content: 'rVRC' },
		{ property: 'og:locale', content: ' ja_JP' },
		{
			rel: 'canonical',
			href: 'https://r-vrc.net/policy',
		},
		{ name: 'author', content: 'rVRC' },
	]
}

export default function Policy() {
	return (
		<div className="w-full p-6 pt-8">
			<h1 className="text-3xl font-bold mb-6">プライバシーポリシー</h1>

			<p>
				rVRC（以下「当サイト」）は、ユーザーの個人情報保護の重要性を認識し、以下のプライバシーポリシーを定めています。
			</p>

			<h2 className="pt-8 text-2xl font-bold">1. 収集する情報</h2>
			<p>当サイトは、以下の情報を取得・利用します。</p>
			<ul className="list-disc pl-6 mt-2 space-y-2">
				<li>
					Discord APIを通じて取得する情報:
					<ul className="list-none mt-1">
						<li>
							・Discord ID、ユーザー名、アイコンなどのDiscordプロフィール情報
						</li>
					</ul>
				</li>
				<li>
					その他の情報:
					<ul className="list-none mt-1">
						<li>・当サイト利用時に発生するアクセスログ</li>
					</ul>
				</li>
			</ul>
			<h2 className="pt-8 text-2xl font-bold">2. 情報の利用目的</h2>
			<p>取得した情報は、以下の目的のためにのみ使用します。</p>
			<ul className="list-disc pl-6 mt-2 space-y-2">
				<li>
					サービスの提供および認証手段としての利用（OAuth2によるログイン認証）
				</li>
				<li>サービス改善およびお問い合わせ対応</li>
			</ul>
			<h2 className="pt-8 text-2xl font-bold">3. 情報の管理</h2>
			<p>
				当サイトは、ユーザーの個人情報を適切に管理し、外部への漏洩や不正アクセスを防止するために必要な措置を講じます。ユーザーの情報は法令で定められた場合を除き、第三者に提供されることはありません。
			</p>
			<h2 className="pt-8 text-2xl font-bold">4. ユーザーの義務</h2>
			<p>ユーザーは、以下の行為を行わないものとします。</p>
			<ul className="list-disc pl-6 mt-2 space-y-2">
				<li>悪意ある情報や虚偽の情報を掲示すること</li>
				<li>当サイトまたは他のユーザーに対する誹謗中傷や不正行為</li>
			</ul>
			<h2 className="pt-8 text-2xl font-bold">5. 違反行為への対応</h2>
			<p>
				ユーザーが上記の禁止事項に違反した場合、サイト管理者は事前の通知なく当該ユーザーのアカウントを停止する権利を有します。
			</p>
			<h2 className="pt-8 text-2xl font-bold">
				6. Cookieおよびトラッキング技術の利用
			</h2>
			<p>
				当サイトでは、サービスの向上を目的としてクッキーや類似の技術を使用する場合があります。これにより、ユーザーの利便性を高め、サイトのパフォーマンスを最適化します。
			</p>
			<h2 className="pt-8 text-2xl font-bold">7. プライバシーポリシーの変更</h2>
			<p>
				当サイトは、本ポリシーを予告なく変更する場合があります。重要な変更がある場合は、サイト上で通知します。変更後もサービスの利用を継続することにより、ユーザーは変更に同意したものとみなされます。
			</p>
			<h2 className="pt-8 text-2xl font-bold">8. お問い合わせ</h2>
			<p className="mb-8">
				本プライバシーポリシーに関するお問い合わせは、お手数ですが
				<a
					href="https://x.com/shirano_no"
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-500 hover:text-blue-600"
				>
					サイト管理者のXアカウント
				</a>
				よりご連絡ください。
			</p>
			<p className="text-sm text-gray-600 mt-8 mb-4">
				最終更新日: 2024年10月26日
			</p>
		</div>
	)
}
