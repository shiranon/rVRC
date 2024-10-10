import { Link } from '@remix-run/react'
import logo from '~/images/rvrc-logo.svg'
import { GithubIcon, XIcon } from '../ui/icons'

export const Footer = () => {
	return (
		<footer className="px-6 pt-9 pb-6">
			<div className="flex items-center justify-between">
				<nav aria-label="フッターナビゲーション" className="flex items-end space-x-4">
					<Link to={'/'} className="inline-block">
						<img src={logo} alt="rVRC ホーム"
							width={90}
							height={30}
							className="w-[90px] h-[30px] object-cover"
						/>
					</Link>
					<ul className="flex space-x-2 flex-wrap">
						<li>
							<Link to={'/ranking'} className="text-xs sm:text-sm text-slate-500 hover:underline">
								ランキング
							</Link>
						</li>
						<li>
							<Link to={'/search'} className="text-xs sm:text-sm text-slate-500 hover:underline">
								検索
							</Link>
						</li>
						<li>
							<Link to={'/trend'} className="text-xs sm:text-sm text-slate-500 hover:underline">
								トレンド
							</Link>
						</li>
						<li>
							<Link to={'/folder'} className="text-xs sm:text-sm text-slate-500 hover:underline">
								フォルダ
							</Link>
						</li>
						<li>
							<Link to={'/about'} className="text-xs sm:text-sm text-slate-500 hover:underline">
								About
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
			<div className="text-center text-sm pt-4 text-slate-700">
				Copyright © 2024 rVRC
			</div>
		</footer>
	)
}
