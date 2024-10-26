import { Link } from '@remix-run/react'
import logo from '~/images/rvrc-logo.svg'
import { GithubIcon, XIcon } from '../ui/icons'

export const Footer = () => {
	return (
		<footer className="w-full mt-auto px-6 pt-9 pb-6">
			<div className="flex items-center justify-between">
				<nav
					aria-label="フッターナビゲーション"
					className="flex items-end space-x-4"
				>
					<Link to={'/'} className="inline-block">
						<img
							src={logo}
							alt="rVRC ホーム"
							width={90}
							height={30}
							className="w-[90px] h-[30px] object-cover"
						/>
					</Link>
					<ul className="flex space-x-2 flex-wrap">
						<li>
							<Link
								to={'/ranking'}
								className="text-xs sm:text-sm text-slate-600 hover:underline"
							>
								ランキング
							</Link>
						</li>
						<li>
							<Link
								to={'/trend'}
								className="text-xs sm:text-sm text-slate-600 hover:underline"
							>
								トレンド
							</Link>
						</li>
						<li>
							<Link
								to={'/search'}
								className="text-xs sm:text-sm text-slate-600 hover:underline"
							>
								検索
							</Link>
						</li>
						<li>
							<Link
								to={'/folder'}
								className="text-xs sm:text-sm text-slate-600 hover:underline"
							>
								フォルダ
							</Link>
						</li>
						<li>
							<Link
								to={'/about'}
								className="text-xs sm:text-sm text-slate-600 hover:underline"
							>
								About
							</Link>
						</li>
						<li>
							<Link
								to={'/policy'}
								className="text-xs sm:text-sm text-slate-600 hover:underline"
							>
								Policy
							</Link>
						</li>
					</ul>
				</nav>

				<div className="flex gap-4">
					<Link
						to={'https://x.com/rvrc_v'}
						target="_blank"
						rel="noopener noreferrer"
					>
						<XIcon className="size-8" />
					</Link>
					<Link
						to={'https://github.com/shiranon/rVRC'}
						target="_blank"
						rel="noopener noreferrer"
					>
						<GithubIcon className="size-8" />
					</Link>
				</div>
			</div>
			<div className="text-center text-sm pt-4 space-y-2">
				<p className="text-slate-700">Copyright © 2024 rVRC</p>
				<p className="text-slate-600 text-xs">
					掲載している商品情報、画像等の権利は全て各権利者に帰属します。
				</p>
			</div>
		</footer>
	)
}
