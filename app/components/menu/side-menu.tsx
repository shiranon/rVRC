import { Link } from '@remix-run/react'
import {
	Crown,
	Flame,
	FolderSearch,
	House,
	MessageCircleMore,
	Search,
} from 'lucide-react'

export const SideMenu = () => {
	return (
		<div className="fixed pt-5 w-[18%] xl:w-[14%] transition-opacity duration-200 opacity-0 lg:opacity-100 pointer-events-none lg:pointer-events-auto">
			<nav
				className="flex flex-col text-lg space-y-1"
				aria-label="メニューナビゲーション"
			>
				<div className="flex flex-col space-y-1">
					<div className="hover:bg-beige">
						<Link to={'/'} className="pl-6 py-2 flex items-center">
							<House className="pr-2" />
							<div>ホーム</div>
						</Link>
					</div>
					<div className="hover:bg-beige">
						<Link to={'/search'} className="pl-6 py-2 flex items-center">
							<Search className="pr-2" />
							<div>検索</div>
						</Link>
					</div>
				</div>
				<div className="flex flex-col mt-2 space-y-1">
					<div className="hover:bg-beige">
						<Link
							to={{
								pathname: '/ranking',
								search: '',
							}}
							className="pl-6 py-2 flex"
						>
							<Crown className="pr-2" />
							<div>ランキング</div>
						</Link>
					</div>
					<div className="hover:bg-beige">
						<Link to={'/trend'} className="pl-6 py-2 flex">
							<Flame className="pr-2" />
							<div>トレンド</div>
						</Link>
					</div>
				</div>
				<div className="hover:bg-beige">
					<Link to={'/folder'} className="pl-6 py-2 flex items-center">
						<FolderSearch className="pr-2" />
						<div>フォルダ</div>
					</Link>
				</div>
				<div className="hover:bg-beige">
					<Link to={'about'} className="pl-6 py-2 flex items-center">
						<MessageCircleMore className="pr-2" />
						<div>About</div>
					</Link>
				</div>
			</nav>
		</div>
	)
}
