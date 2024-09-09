import { Form } from '@remix-run/react'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTrigger,
} from '../ui/dialog'

export const RegisterMenu = () => {
	return (
		<>
			<Dialog>
				<DialogTrigger className="flex items-center p-2 h-14 -my-5 hover:bg-beige">
					ログイン
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<div>rVRc</div>
					</DialogHeader>
					<Form method="post">
						<button
							className="bg-black rounded-xl text-white p-2"
							type="submit"
						>
							Sign in with Discord
						</button>
					</Form>
				</DialogContent>
			</Dialog>
		</>
	)
}
