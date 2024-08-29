import { Link } from '@remix-run/react'
import { FlaskConical } from 'lucide-react'
import { HamburgerMenu } from '~/components/menu/hamburger-menu'
import { RegisterMenu } from '~/components/menu/register-menu'
import { UserMenu } from '../menu/user-menu'

export const Header = () => {
	return (
		<header className="sticky top-0 left-0 w-full h-16 bg-gray-100 z-[1000]">
			<div className="p-3 flex justify-between items-center ">
				<div className="flex">
					<HamburgerMenu />
					<Link className="flex pl-2 items-center" to={'#'}>
						<FlaskConical />
						<div className="pl-4 text-xl">rVRc</div>
					</Link>
				</div>
				{/* WIP:ユーザー認証機能作成後分岐設定する */}
				<div className="flex items-center">
					<RegisterMenu />
				</div>
				<div className="flex items-center">
					<UserMenu />
				</div>
			</div>
		</header>
	)
}
