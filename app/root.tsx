import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from '@remix-run/react'
import type { rootLoader } from '~/.server/loaders'
import { Footer, Header } from '~/components/layout/index'
import './tailwind.css'

export { rootAction as action } from '~/.server/actions'
export { rootLoader as loader } from '~/.server/loaders'

export const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<html lang="ja">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body className="min-w-96 mx-auto font-noto antialiased">
				<Header />
				<div className="flex max-w-[640px] items-center justify-center m-auto">
					{children}
				</div>
				<Footer />
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

export default function App() {
	return <Outlet />
}
