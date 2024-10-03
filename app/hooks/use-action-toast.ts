import { useActionData } from '@remix-run/react'
import { useEffect } from 'react'
import { useToast } from '~/hooks/use-toast'

type ActionData = {
	success?: boolean
	message?: string
}

export function useActionToast() {
	const { toast } = useToast()
	const actionData = useActionData<ActionData>()

	useEffect(() => {
		if (actionData && 'success' in actionData && 'message' in actionData) {
			toast({
				title: actionData.success ? '成功' : 'エラー',
				description: actionData.message,
				variant: actionData.success ? 'default' : 'destructive',
			})
		}
	}, [actionData, toast])

	return actionData
}
