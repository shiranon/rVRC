import { Form, useActionData } from '@remix-run/react'
import type React from 'react'
import { useEffect, useState } from 'react'
import type { z } from 'zod'
import { Button } from '../ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog'
import { Input } from '../ui/input'

interface Profile {
	name: string
	avatar: string | null
}

interface CreateFolderProps {
	actionPath: string
	children: React.ReactNode
	profile: Profile
}

type ActionData =
	| { profileErrors: z.ZodIssue[] }
	| { profileError: string }
	| { success: boolean }

export const EditProfile = ({
	actionPath,
	children,
	profile,
}: CreateFolderProps) => {
	const [open, setOpen] = useState(false)
	const [userName, setFolderName] = useState(profile.name)
	const actionData = useActionData<ActionData>()
	const errorMessages: string[] = []

	if (actionData) {
		if ('profileErrors' in actionData) {
			errorMessages.push(...actionData.profileErrors.map((err) => err.message))
		} else if ('profileError' in actionData) {
			errorMessages.push(actionData.profileError)
		}
	}

	useEffect(() => {
		if (actionData && 'success' in actionData && actionData.success) {
			setOpen(false)
		}
	}, [actionData])

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-[425px] bg-white rounded-lg">
				<DialogHeader>
					<DialogTitle>プロフィール編集</DialogTitle>
					<DialogDescription className="sr-only">
						プロフィールを編集できます。
					</DialogDescription>
				</DialogHeader>
				<Form method="post" action={actionPath}>
					<div className="grid gap-2 py-4">
						<label htmlFor="username" className="font-bold">
							ユーザーネーム
							<span className="pl-2 text-xs text-red-500">必須</span>
						</label>
						<Input
							id="username"
							name="username"
							autoComplete="off"
							value={userName}
							onChange={(e) => setFolderName(e.target.value)}
							className="bg-white rounded-none border-x-0 border-t-0 border-b-2 border-gray-200 focus:border-blue-500"
						/>
						<div
							className={`text-right ${userName.length > 25 ? 'text-red-500' : 'text-gray-500'}`}
						>
							{userName.length}/25
						</div>
					</div>
					<DialogFooter>
						{errorMessages.length > 0 && (
							<ul className="text-red-500">
								{errorMessages.map((error) => (
									<li key={error} className="text-sm">
										{error}
									</li>
								))}
							</ul>
						)}
						<Button
							type="submit"
							name="intent"
							value="editProfile"
							className="hover:bg-beige"
						>
							変更
						</Button>
					</DialogFooter>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
