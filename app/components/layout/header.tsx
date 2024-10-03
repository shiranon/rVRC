import { Link } from '@remix-run/react'
import logo from '~/images/rvrc-logo.svg'
import { HamburgerMenu, RegisterMenu, UserMenu } from '~/components/menu/index'
import { Separator } from '../ui/separator'

interface User {
	avatar: string | null
	name: string
}

interface UserData {
	isLoggedIn: boolean
	user: User | null
}

interface HeaderProps {
	userData?: UserData
}

export const Header = ({ userData }: HeaderProps) => {
	return (
		<header className="sticky top-0 left-0 w-full h-16 z-[1000] bg-light-beige">
			<div className="pt-3 px-3 flex justify-between items-center">
				<div className="flex">
					<HamburgerMenu />
					<Link className="flex items-center pl-1" to={'/'}>
						<img src={logo} alt="rVRC" width={90} height={30} />
					</Link>
				</div>
				{userData?.isLoggedIn ? (
					<div className="flex items-center">
						<UserMenu user={userData.user} />
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
