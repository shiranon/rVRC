import type { SerializeFrom } from '@remix-run/cloudflare'
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
	useRouteError,
	useRouteLoaderData,
} from '@remix-run/react'
import type { rootLoader } from '~/.server/loaders'
import { Footer, Header } from '~/components/layout/index'
import './tailwind.css'
import { Toaster } from '~/components/ui/toaster'

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

	return (
		<html lang="ja">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body className="min-w-96 mx-auto font-noto antialiased">
				<Header userData={userData} />
				<div className="flex max-w-[640px] items-center justify-center m-auto">
					{children}
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
