import { Form } from '@remix-run/react'
import logo from '~/images/rvrc-logo.svg'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog'
import { DiscordIcon } from '../ui/icons'

export const RegisterMenu = () => {
	return (
		<>
			<Dialog>
				<DialogTrigger className="flex items-center p-2 h-14 -my-5 hover:bg-beige">
					ログイン
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="sr-only">ログイン</DialogTitle>
						<img src={logo} alt="rVRC" width={150} height={50} />
						<div>ログインする事で、アイテムをフォルダ分けできます。</div>
					</DialogHeader>
					<Form method="post">
						<div className="flex items-center justify-center">
							<button
								className="bg-[#5865F2] rounded-xl text-white p-2"
								type="submit"
							>
								<DiscordIcon className="size-4" fill="#FFFFFF" />
								<span className="pl-2">Sign in with Discord</span>
							</button>
						</div>
					</Form>
				</DialogContent>
			</Dialog>
		</>
	)
}
