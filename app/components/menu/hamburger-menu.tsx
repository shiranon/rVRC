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
	Calendar,
	CalendarDays,
	CircleHelp,
	Crown,
	Flame,
	FolderSearch,
	House,
	Menu,
	MessageCircleMore,
	Search,
} from 'lucide-react'

export const HamburgerMenu = () => {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" aria-label="Menu">
					<Menu className="h-6 w-6" />
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="w-[200px] sm:w-[250px] pt-20 px-0">
				<SheetHeader className="sr-only">
					<SheetDescription>ハンバーガーメニュー</SheetDescription>
				</SheetHeader>
				<SheetTitle className="sr-only">ハンバーガーメニュー</SheetTitle>
				<nav className="flex flex-col text-lg space-y-1 overflow-y-auto">
					<div className="hover:bg-slate-200">
						<Link
							to={'#'}
							className="p-2 flex items-center"
							onClick={() => setIsOpen(false)}
						>
							<House className="pr-2" />
							<div>ホーム</div>
						</Link>
					</div>
					<div className="hover:bg-slate-200">
						<Link
							to={'#'}
							className="p-2 flex items-center"
							onClick={() => setIsOpen(false)}
						>
							<Search className="pr-2" />
							<div>検索</div>
						</Link>
					</div>
					<Separator />
					<div className="flex flex-col mt-2 space-y-1">
						<div className="flex pt-2 px-2 text-base">
							<Crown className="pr-2" />
							<div>ランキング</div>
						</div>
						<div className="hover:bg-slate-200">
							<Link
								to={'#'}
								className="pl-3 py-2 flex"
								onClick={() => setIsOpen(false)}
							>
								<CalendarDays className="pr-2" />
								<div>デイリー</div>
							</Link>
						</div>
						<div className="hover:bg-slate-200">
							<Link
								to={'#'}
								className="pl-3 py-2 flex"
								onClick={() => setIsOpen(false)}
							>
								<Calendar className="pr-2" />
								<div>マンスリー</div>
							</Link>
						</div>
						<div className="hover:bg-slate-200">
							<Link
								to={'#'}
								className="pl-3 py-2 flex"
								onClick={() => setIsOpen(false)}
							>
								<Flame className="pr-2" />
								<div>トレンド</div>
							</Link>
						</div>
					</div>
					<Separator className="pr-2" />
					<div className="hover:bg-slate-200">
						<Link
							to={'#'}
							className="p-2 flex items-center"
							onClick={() => setIsOpen(false)}
						>
							<FolderSearch className="pr-2" />
							<div>フォルダー</div>
						</Link>
					</div>
					<div className="hover:bg-slate-200">
						<Link
							to={'#'}
							className="p-2 flex items-center"
							onClick={() => setIsOpen(false)}
						>
							<CircleHelp className="pr-2" />
							<div>FAQ</div>
						</Link>
					</div>
					<div className="hover:bg-slate-200">
						<Link
							to={'#'}
							className="p-2 flex items-center"
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
