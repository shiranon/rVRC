import { Link } from '@remix-run/react'
import { FlaskConical } from 'lucide-react'
import { HamburgerMenu, RegisterMenu, UserMenu } from '~/components/menu/index'
import { Separator } from '../ui/separator'

interface headerProp {
	isLogin: boolean
}

export const Header = ({ isLogin }: headerProp) => {
	console.log(isLogin)
	return (
		<header className="sticky top-0 left-0 w-full h-16 z-[1000] bg-light-beige">
			<div className="pt-3 px-3 flex justify-between items-center ">
				<div className="flex">
					<HamburgerMenu />
					<Link className="flex pl-2 items-center" to={'/'}>
						<FlaskConical />
						<div className="pl-4 text-xl">rVRc</div>
					</Link>
				</div>
				{isLogin ? (
					<div className="flex items-center">
						<UserMenu />
					</div>
				) : (
					<div className="flex items-center">
						<RegisterMenu />
					</div>
				)}
			</div>
			<div className="flex justify-center pt-2 bg-light-beige">
				<Separator className="w-[90%] bg-slate-400" />
			</div>
		</header>
	)
}
