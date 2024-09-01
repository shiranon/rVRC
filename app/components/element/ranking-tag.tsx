export const rankingTag = (rank: number) => {
	const colors: { [key: number]: string } = {
		1: 'bg-amber-400',
		2: 'bg-zinc-400',
		3: 'bg-yellow-600',
	}
	const colorClass = colors[rank] || 'bg-slate-300'
	return (
		<div className="z-10 font-bold">
			<div
				className={`absolute top-0 left-0 w-1/4 h-1/4 ${colorClass} clip-triangle bg-opacity-90`}
			>
				<span className="relative top-[20%] left-[20%] text-2xl text-white">
					{rank}
				</span>
			</div>
		</div>
	)
}
