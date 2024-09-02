import { Link } from '@remix-run/react'

export const RegisterMenu = () => {
	return (
		<>
			<Link
				to={'#'}
				className="flex items-center p-2 h-14 -my-5 hover:bg-beige"
			>
				ログイン
			</Link>
			<Link
				to={'#'}
				className="pl-2 flex items-center p-2 h-14 -my-5 hover:bg-beige"
			>
				登録
			</Link>
		</>
	)
}
