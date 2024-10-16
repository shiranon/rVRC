import type { SerializeFrom } from '@remix-run/cloudflare'
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
	useRevalidator,
	useRouteError,
	useRouteLoaderData,
} from '@remix-run/react'
import { useEffect } from 'react'
import type { rootLoader } from '~/.server/loaders'
import { Footer, Header } from '~/components/layout/index'
import { Toaster } from '~/components/ui/toaster'
import { SideMenu } from './components/menu/side-menu'
import './tailwind.css'

type RootLoaderData = SerializeFrom<typeof rootLoader>

type RootLoaderDataWithError = RootLoaderData & {
	error?: {
		status: number
		statusText: string
		data: string
	}
}

export { rootAction as action } from '~/.server/actions'
export { rootLoader as loader } from '~/.server/loaders'

export const Layout = ({ children }: { children: React.ReactNode }) => {
	const userData = useRouteLoaderData<RootLoaderDataWithError>('root')
	const revalidator = useRevalidator()

	useEffect(() => {
		if (userData?.needsAvatarCheck) {
			const timer = setTimeout(() => {
				revalidator.revalidate()
			}, 500)

			return () => clearTimeout(timer)
		}
	}, [userData?.needsAvatarCheck, revalidator])
	return (
		<html lang="ja">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body className="flex flex-col min-h-screen min-w-96 mx-auto font-noto antialiased">
				<Header userData={userData} />
				<div className="flex flex-grow">
					<SideMenu />
					<main className="flex-grow max-w-[640px] xl:max-w-[960px] w-full mx-auto">
						<div className="flex flex-col justify-center mx-auto">
							{children}
						</div>
					</main>
				</div>
				<Footer />
				<Toaster />
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

export function ErrorBoundary() {
	const error = useRouteError()

	let errorMessage = '不明なエラーが発生しました'

	if (isRouteErrorResponse(error)) {
		errorMessage = `${error.status} ${error.data}`
	} else if (error instanceof Error) {
		errorMessage = error.message
	}

	return (
		<div>
			<h1>エラーが発生しました</h1>
			<p>{errorMessage}</p>
		</div>
	)
}

export default function App() {
	return <Outlet />
}
