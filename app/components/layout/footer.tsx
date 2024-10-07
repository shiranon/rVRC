import { Link } from '@remix-run/react'
import logo from '~/images/rvrc-logo.svg'
import { GithubIcon, XIcon } from '../ui/icons'

export const Footer = () => {
	return (
		<footer className="px-6 pt-9 pb-6">
			<div className="flex items-center justify-between">
				<Link to={'/'}>
					<img src={logo} alt="rVRC" width={90} height={30} />
				</Link>
				<div className="flex gap-4">
					<Link
						to={'https://x.com/rvrc_v'}
						target="_blank"
						rel="noopener noreferrer"
					>
						<XIcon className="size-8" />
					</Link>
					<Link
						to={'https://github.com/shiranon/rVRC'}
						target="_blank"
						rel="noopener noreferrer"
					>
						<GithubIcon className="size-8" />
					</Link>
				</div>
			</div>
			<div className="text-center text-sm pt-4 text-slate-700">
				Copyright © 2024 rVRC
			</div>
		</footer>
	)
}
