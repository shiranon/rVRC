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
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'

interface CreateFolderProps {
	actionPath: string
	children: React.ReactNode
}

type ActionData =
	| { folderErrors: z.ZodIssue[] }
	| { folderError: string }
	| { success: boolean }

export const CreateFolder = ({ actionPath, children }: CreateFolderProps) => {
	const [open, setOpen] = useState(false)
	const [folderName, setFolderName] = useState('')
	const [folderDescription, setFolderDescription] = useState('')
	const actionData = useActionData<ActionData>()
	const errorMessages: string[] = []

	if (actionData) {
		if ('folderErrors' in actionData) {
			errorMessages.push(...actionData.folderErrors.map((err) => err.message))
		} else if ('folderError' in actionData) {
			errorMessages.push(actionData.folderError)
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
				<Form method="post" action={actionPath}>
					<DialogHeader>
						<DialogTitle>フォルダ作成</DialogTitle>
						<DialogDescription className="sr-only">
							フォルダを作成できます。
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-2 py-4">
						<label htmlFor="foldername" className="font-bold">
							フォルダ名
							<span className="pl-2 text-xs text-red-500">必須</span>
						</label>
						<Input
							id="foldername"
							name="foldername"
							placeholder="新しいフォルダ"
							autoComplete="off"
							onChange={(e) => setFolderName(e.target.value)}
							className="bg-white rounded-none border-x-0 border-t-0 border-b-2 border-gray-200 focus:border-blue-500"
						/>
						<div
							className={`text-right ${folderName.length > 25 ? 'text-red-500' : 'text-gray-500'}`}
						>
							{folderName.length}/25
						</div>
						<label htmlFor="foldername" className="font-bold">
							フォルダの説明
						</label>
						<Input
							id="folderDescription"
							name="folderDescription"
							placeholder="フォルダの説明"
							autoComplete="off"
							onChange={(e) => setFolderDescription(e.target.value)}
							className="bg-white rounded-none border-x-0 border-t-0 border-b-2 border-gray-200 focus:border-blue-500"
						/>
						<div
							className={`text-right ${folderDescription.length > 100 ? 'text-red-500' : 'text-gray-500'}`}
						>
							{folderDescription.length}/100
						</div>
						<RadioGroup
							required
							defaultValue="private"
							name="visibility"
							className="flex pt-2 gap-4"
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="public" id="public" />
								<label htmlFor="public">公開</label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="private" id="private" />
								<label htmlFor="private">非公開</label>
							</div>
						</RadioGroup>
					</div>
					<DialogFooter>
						{errorMessages.length > 0 && (
							<ul className="text-red-500">
								{errorMessages.map((error) => (
									<li key={error}>{error}</li>
								))}
							</ul>
						)}
						<Button
							type="submit"
							name="intent"
							value="createFolder"
							className="hover:bg-beige"
						>
							作成
						</Button>
					</DialogFooter>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
