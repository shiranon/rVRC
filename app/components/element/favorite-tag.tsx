import type React from 'react'
import { cn } from '~/lib/utils'
import { HeartIcon } from '../ui/icons'

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
				<HeartIcon className="w-4 h-4 mr-1" pathProps={{ fill: '#FFFFFF' }} />
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
