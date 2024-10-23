import { Separator } from '@radix-ui/react-separator'
import type { MetaFunction } from '@remix-run/cloudflare'
import { Link } from '@remix-run/react'

export const meta: MetaFunction = () => {
	const titleElements = [
		{ title: 'About - rVRC' },
		{
			name: 'twitter:title',
			content: 'About - rVRC',
		},
		{
			property: 'og:title',
			content: 'About - rVRC',
		},
	]

	const descriptionElements = [
		{
			name: 'description',
			content:
				'VRChat用アイテムのランキングサイト「rVRC」の詳細説明ページ。BOOTHのスキ数を基にしたランキング・トレンド分析、詳細検索機能、フォルダ機能の使い方を解説。開発中の機能や今後の展望、サポート方法も紹介しています。',
		},
		{
			name: 'twitter:description',
			content: 'rVRC - About',
		},
		{
			property: 'og:description',
			content: 'rVRC - About',
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
			content: 'https://r-vrc.net/',
		},
		{ property: 'og:type', content: 'article' },
		{ property: 'og:site_name', content: 'rVRC' },
		{ property: 'og:locale', content: ' ja_JP' },
		{
			rel: 'canonical',
			href: 'https://r-vrc.net/about',
		},
		{ name: 'author', content: 'rVRC' },
		{
			name: 'keywords',
			content: 'VRChat, ランキング, アバター, オススメ, 衣装, 3Dモデル',
		},
	]
}

export default function About() {
	return (
		<div className="w-full p-6">
			<h2 className="text-3xl font-bold mb-6">rVRCについて</h2>
			<div className="p-6 bg-white rounded-lg shadow-sm">
				<p className="mb-4">
					rVRCは
					<Link
						to={'https://booth.pm/'}
						target="_blank"
						rel="noopener noreferrer"
						className="bg-red-400 hover:bg-red-300 text-white font-bold px-2 py-1 transition-colors duration-300"
					>
						BOOTH
					</Link>
					で販売されているVRChat用アイテムのスキ数を集計し、ランキング化するサービスです。
				</p>
				<p className="mb-4">
					3Dキャラクターと3D衣装カテゴリのアイテムを対象に、前日比でのスキ数増加を計測しランキングを作成しています。
				</p>
				<p className="mb-4">
					計測は日本時間の21時前後に行われるため、最新の情報と完全に一致しない場合があります。
				</p>
				<p className="mb-4">
					また現在、上記カテゴリのみを対象に集計をしているので、全てのアイテムはカバーしきれていません。
				</p>
				<p>
					ご要望・お問い合わせは、お手数ですが
					<Link
						to={'https://x.com/shirano_no'}
						target="_blank"
						rel="noopener noreferrer"
						className="rounded-md bg-slate-700 hover:bg-slate-600 text-white font-bold px-2 py-1 ml-1 transition-colors duration-300"
					>
						X
					</Link>
					へのDMでお願いいたします。
				</p>
			</div>

			<h2 className="pt-4 text-2xl font-bold">使い方</h2>
			<h3 className="pt-4 text-xl font-bold">👑ランキング</h3>
			<div className="p-4">
				<p>
					デイリーランキングをご覧いただけます。ページ上部のボタンでアバターと衣装を切り替えることができます。
				</p>
				<p>アバターは50位まで、衣装は100位まで表示しています。</p>
				<p>また、オプションボタンから過去のランキングも確認できます。</p>
			</div>
			<h3 className="pt-2 text-xl font-bold">🔥トレンド</h3>
			<div className="p-4">
				<p>
					デイリートレンドをご覧いただけます。ページ上部のボタンでアバターと衣装を切り替えることができます。
				</p>
				<p>
					BOOTHで公開されてから1週間以内のアイテムのみを対象に、スキ数を集計してランキング化しています。
				</p>
			</div>
			<h3 className="pt-2 text-xl font-bold">🔍️検索</h3>
			<div className="p-4">
				<p>当サイトに登録されているアイテムを検索できます。</p>
				<p>
					通常の文字検索に加え、スキ数による絞り込み機能や、各種条件でのソート機能をご利用いただけます。
				</p>
			</div>
			<h3 className="pt-2 text-xl font-bold">🌱アイテム詳細ページ</h3>
			<div className="p-4">
				<p>アイテムの詳細情報に加え、関連アイテムをご覧いただけます。</p>
				<p>アバター詳細ページでは、関連衣装の検索・絞り込みができます。</p>
			</div>
			<h3 className="pt-2 text-xl font-bold">📁フォルダ</h3>
			<div className="p-4">
				<p>お気に入りのアイテムをフォルダに保存し、管理することができます。</p>
				<p>公開設定したフォルダは外部でも公開する事ができます。</p>
				<p>現在、1人あたり10個までフォルダを作成できます。</p>
				<p>
					不適切なフォルダ名が使用されている事を確認した場合は、こちらの判断で削除をする場合がございます。
				</p>
			</div>
			<div className="flex justify-center">
				<Separator className="h-[1px] w-[90%] bg-slate-400" />
			</div>
			<h3 className="pt-4 text-xl font-bold mb-4">🔧開発中の機能</h3>
			<div className="p-4 ">
				<ul className="list-disc list-inside space-y-2">
					<li>ダークモード</li>
					<li>ショップ詳細ページ</li>
					<li>プロフィール画像変更機能</li>
					<li>アイテムの公開日での絞り込み機能</li>
					<li>公開フォルダのお気に入り登録機能</li>
				</ul>
			</div>
			<h3 className="pt-4 text-xl font-bold">☕サポート</h3>
			<div className="p-4">
				<p>
					当サービスは現在、ドメイン取得・維持費用のみで運営できておりますが、継続的な改善や機能追加のために
					<Link
						to={'https://shirano.fanbox.cc/'}
						target="_blank"
						rel="noopener noreferrer"
						className="rounded-md bg-orange-400 hover:bg-orange-300 text-white px-1.5"
					>
						ご支援
					</Link>
					いただけると大変助かります。
				</p>
				<p className="pt-4">
					ご支援が多くなればデータベースの容量が増やせるので、他のカテゴリも集計対象にしたり、もっと色んな情報を表示する事ができます。
				</p>
				<p className="pt-4">
					また、rVRCは
					<Link
						to={'https://github.com/shiranon/rVRC'}
						target="_blank"
						rel="noopener noreferrer"
						className="rounded-md bg-slate-700 hover:bg-slate-600 text-white font-bold px-1.5"
					>
						Github
					</Link>
					にてソースコードを公開しています。お気づきの点がありましたら、プルリクエストやイシューにてご連絡ください。
				</p>
			</div>
		</div>
	)
}
