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
				'rVRCはVRChat用アイテムのスキ数を集計してランキング化しているサービスです。',
		},
		{
			name: 'twitter:description',
			content:
				'rVRCはVRChat用アイテムのスキ数を集計してランキング化しているサービスです。',
		},
		{
			property: 'og:description',
			content:
				'rVRCはVRChat用アイテムのスキ数を集計してランキング化しているサービスです。',
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
			href: 'https://r-vrc.net/',
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
						className="bg-red-400 hover:bg-red-300 text-white font-bold px-2 py-1 rounded-md transition-colors duration-300"
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
					ご要望・お問い合わせは、お手数ですが
					<Link
						to={'https://x.com/shirano_v'}
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
			<h3 className="pt-2 text-xl font-bold">📁フォルダ</h3>
			<div className="p-4">
				<p>お気に入りのアイテムをフォルダに保存し、管理することができます。</p>
				<p>作成したフォルダは公開する事が出来ます。</p>
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
					当サービスは現在、ドメイン取得・維持費用のみで運営しておりますが、継続的な改善や機能追加のために
					<Link
						to={'https://shirano.fanbox.cc/'}
						target="_blank"
						rel="noopener noreferrer"
						className="bg-red-400 hover:bg-red-300 text-white px-1"
					>
						ご支援
					</Link>
					いただけると大変助かります。
				</p>
				<p className="pt-4">
					また、
					<Link
						to={'https://github.com/shiranon/rVRC'}
						target="_blank"
						rel="noopener noreferrer"
						className="rounded-md bg-slate-700 hover:bg-slate-600 text-white font-bold px-1.5"
					>
						Github
					</Link>
					にてソースコードを公開しています。お気づきの点がありましたら、プルリクエストやイシューでご連絡ください。
				</p>
			</div>
		</div>
	)
}
