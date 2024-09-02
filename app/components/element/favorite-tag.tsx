import type React from 'react'
import { cn } from '~/lib/utils'

type Props = React.ComponentProps<'span'> & {
	favorite_count: number
	difference?: number
}

export const FavoriteTag = ({
	favorite_count,
	difference,
	className,
}: Props) => {
	return (
		<div className="absolute top-0 right-0 w-auto h-auto flex flex-col items-end bg-black text-white bg-opacity-70 px-1 min-w-[5ch]">
			<div className={cn('inline-flex items-center', className)}>
				<svg
					aria-hidden="true"
					focusable="false"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="w-4 h-4 mr-1"
				>
					<path
						d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z"
						fill="#FFFFFF"
					/>
				</svg>
				{favorite_count}
			</div>
			{difference ? (
				<div className="text-sm pb-[1px] inline-flex items-center text-[#32CD32]">
					<svg
						aria-hidden="true"
						focusable="false"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="w-3 h-3 mr-1"
					>
						<path
							d="M4 12H20M12 4V20"
							stroke="#32CD32"
							strokeWidth="3"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					{difference}
				</div>
			) : (
				''
			)}
		</div>
	)
}
