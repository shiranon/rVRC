import { useEffect, useState } from 'react'

export const TimeDebugger = () => {
	const [clientTime, setClientTime] = useState<string>('Loading...')
	const [isClient, setIsClient] = useState(false)

	useEffect(() => {
		setIsClient(true)
		setClientTime(new Date().toString())

		// 1秒ごとに更新
		const timer = setInterval(() => {
			setClientTime(new Date().toString())
		}, 1000)

		return () => clearInterval(timer)
	}, [])

	return (
		<div className="fixed bottom-0 right-0 bg-black/80 text-white p-4 text-sm">
			<div>Server Initial: {new Date().toString()}</div>
			<div>Client Time: {clientTime}</div>
			<div>Is Client: {String(isClient)}</div>
		</div>
	)
}
