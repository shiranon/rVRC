import { Form, Link, useActionData, useParams } from '@remix-run/react'
import { useEffect, useState } from 'react'
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '../ui/alert-dialog'
import { Button } from '../ui/button'

interface DeleteOrderProps {
	actionPath: string
	subject: string
	id: string
	children: React.ReactNode
}

const subjectMap = {
	avatar: 'アバター',
	cloth: '衣装',
	folder: 'フォルダー',
}
const intentMap = {
	folder: 'deleteFolder',
}

type ActionData = { error: string } | { success: boolean }

export const DeleteOrderDialog = ({
	actionPath,
	subject,
	id,
	children,
}: DeleteOrderProps) => {
	const [open, setOpen] = useState(false)
	const actionData = useActionData<ActionData>()

	useEffect(() => {
		if (actionData && 'success' in actionData && actionData.success) {
			setOpen(false)
		}
	}, [actionData])

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{' '}
						{`${subjectMap[subject as keyof typeof subjectMap] || '項目'}を削除`}
					</AlertDialogTitle>
					<AlertDialogDescription>本当に削除しますか？</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<Form method="post" action={actionPath}>
						<input type="hidden" name="id" value={id} />
						<Button
							className="w-full"
							type="submit"
							name="intent"
							value={intentMap[subject as keyof typeof intentMap]}
							variant="destructive"
						>
							削除
						</Button>
					</Form>
					<Button
						type="button"
						variant="ghost"
						onClick={() => {
							setOpen(false)
						}}
					>
						キャンセル
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
