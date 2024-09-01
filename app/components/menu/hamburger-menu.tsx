import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '~/components/ui/sheet'

import { Link } from '@remix-run/react'
import {
	CircleHelp,
	Crown,
	Flame,
	FolderSearch,
	House,
	MessageCircleMore,
	Search,
} from 'lucide-react'

export const HamburgerMenu = () => {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				<Button
					className="relative bg-light-beige"
					size="icon"
					aria-label="Menu"
				>
					<span
						className={`absolute w-2 top-3 left-3 h-[3px] bg-slate-800 transition-transform ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}
					/>
					<span
						className={`absolute w-4 top-5 left-3 h-[3px] bg-slate-800 transition-opacity ${isOpen ? 'opacity-0' : 'opacity-100'}`}
					/>
					<span
						className={`absolute w-5 top-7 left-3 h-[3px] bg-slate-800 transition-transform ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}
					/>
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="w-[200px] sm:w-[250px] pt-20 px-0">
				<SheetHeader className="sr-only">
					<SheetDescription>ハンバーガーメニュー</SheetDescription>
				</SheetHeader>
				<SheetTitle className="sr-only">ハンバーガーメニュー</SheetTitle>
				<nav className="flex flex-col text-lg space-y-1 overflow-y-auto">
					<div className="flex flex-col space-y-1">
						<div className="hover:bg-beige">
							<Link
								to={'#'}
								className="pl-3 py-2 flex items-center"
								onClick={() => setIsOpen(false)}
							>
								<House className="pr-2" />
								<div>ホーム</div>
							</Link>
						</div>
						<div className="hover:bg-beige">
							<Link
								to={'#'}
								className="pl-3 py-2 flex items-center"
								onClick={() => setIsOpen(false)}
							>
								<Search className="pr-2" />
								<div>検索</div>
							</Link>
						</div>
					</div>
					<Separator />
					<div className="flex flex-col mt-2 space-y-1">
						<div className="hover:bg-beige">
							<Link
								to={'/ranking'}
								className="pl-3 py-2 flex"
								onClick={() => setIsOpen(false)}
							>
								<Crown className="pr-2" />
								<div>ランキング</div>
							</Link>
						</div>
						<div className="hover:bg-beige">
							<Link
								to={'/trend'}
								className="pl-3 py-2 flex"
								onClick={() => setIsOpen(false)}
							>
								<Flame className="pr-2" />
								<div>トレンド</div>
							</Link>
						</div>
					</div>
					<div className="hover:bg-beige">
						<Link
							to={'#'}
							className="pl-3 py-2 flex items-center"
							onClick={() => setIsOpen(false)}
						>
							<FolderSearch className="pr-2" />
							<div>フォルダー</div>
						</Link>
					</div>
					<Separator />
					<div className="hover:bg-beige">
						<Link
							to={'#'}
							className="pl-3 py-2 flex items-center"
							onClick={() => setIsOpen(false)}
						>
							<CircleHelp className="pr-2" />
							<div>FAQ</div>
						</Link>
					</div>
					<div className="hover:bg-beige">
						<Link
							to={'#'}
							className="pl-3 py-2 flex items-center"
							onClick={() => setIsOpen(false)}
						>
							<MessageCircleMore className="pr-2" />
							<div>About</div>
						</Link>
					</div>
				</nav>
			</SheetContent>
		</Sheet>
	)
}
