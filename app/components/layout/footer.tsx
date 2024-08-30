import { Link } from '@remix-run/react'
import { FlaskConical } from 'lucide-react'
import { DiscordIcon, GithubIcon, XIcon } from '../ui/icons'

export const Footer = () => {
	return (
		<footer className="px-6 pt-9 pb-6">
			<div className="flex items-center justify-between">
				<Link to={'/'}>
					<FlaskConical className="size-10" />
				</Link>
				<div className="flex gap-4">
					<Link to={'#'} className="size-8">
						<XIcon />
					</Link>
					<Link to={'#'} className="size-8">
						<GithubIcon />
					</Link>
					<Link to={'#'} className="size-8">
						<DiscordIcon />
					</Link>
				</div>
			</div>
			<div className="text-center text-sm pt-4 text-slate-700">
				Copyright © 2024 rVRc
			</div>
		</footer>
	)
}
