import { Form, Link } from '@remix-run/react'
import { Folder, LogOut, UserIcon } from 'lucide-react'
import { useState } from 'react'
import { Avatar, AvatarImage } from '~/components/ui/avatar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '~/components/ui/popover'

interface User {
	avatar: string
	name: string
}

interface UserData {
	user: User | null
}

export const UserMenu = ({ user }: UserData) => {
	const [isOpen, setIsOpen] = useState(false)
	return (
		<div>
			<Popover open={isOpen} onOpenChange={setIsOpen}>
				<PopoverTrigger>
					<div className="flex items-center p-4 h-14 -my-2">
						<Avatar>
							{user && <AvatarImage src={user.avatar} alt={user.name} />}
						</Avatar>
					</div>
				</PopoverTrigger>
				<PopoverContent className="p-0 w-[160px] space-y-1 sm:w-[250px] z-[2000]">
					<div className="hover:bg-slate-200 rounded-t-md">
						<Link
							to={'/profile'}
							className="p-2 flex justify-between"
							onClick={() => setIsOpen(false)}
						>
							<div>プロフィール</div>
							<UserIcon className="pr-2" />
						</Link>
					</div>
					<div className="hover:bg-slate-200">
						<Link
							to={'#'}
							className="p-2 flex justify-between"
							onClick={() => setIsOpen(false)}
						>
							<div>フォルダー</div>
							<Folder className="pr-2" />
						</Link>
					</div>
					<div className="hover:bg-slate-200 rounded-b-md">
						<Form action="/sign-out" method="post">
							<button type="submit" className="p-2 w-full flex justify-between">
								<div>ログアウト</div>
								<LogOut className="pr-2" />
							</button>
						</Form>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	)
}
