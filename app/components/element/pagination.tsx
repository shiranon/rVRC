import { useSearchParams } from '@remix-run/react'
import { useCallback, useEffect, useState } from 'react'
import {
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
	Pagination as _Pagination,
} from '~/components/ui/pagination'
import { paginate } from '~/lib/paginate'

export const Pagination = ({
	totalItems,
	itemsPerPage = 10,
	delta = 1,
}: {
	totalItems: number
	itemsPerPage?: number
	delta?: number
}) => {
	const [searchParams, setSearchParams] = useSearchParams()
	const [currentPage, setCurrentPage] = useState<number>(1)

	const updatePage = useCallback(
		(page: number) => {
			const newSearchParams = new URLSearchParams(searchParams)
			newSearchParams.set('page', page.toString())
			setSearchParams(newSearchParams)
		},
		[searchParams, setSearchParams],
	)

	const { pages, isFirstPage, isLastPage } = paginate({
		totalItems,
		itemsPerPage,
		currentPage,
		delta,
	})

	useEffect(() => {
		const currentPageNumber = Number.parseInt(
			searchParams.get('page') || '1',
			10,
		)
		setCurrentPage(currentPageNumber)
	}, [searchParams])

	return (
		<_Pagination className="pt-6">
			<PaginationContent>
				{!isFirstPage && (
					<PaginationItem>
						<PaginationPrevious
							className="hover:bg-beige"
							onClick={() => updatePage(currentPage - 1)}
						/>
					</PaginationItem>
				)}
				{pages.map((page) => {
					if (page.type === 'dots') {
						return (
							<PaginationItem key={`page-${page.value}`}>
								<PaginationEllipsis className="text-lg" />
							</PaginationItem>
						)
					}
					if (page.value === currentPage) {
						return (
							<PaginationItem key={`page-${page.value}`}>
								<div className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background bg-beige focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-10 w-10 m-1 text-lg ">
									{page.value}
								</div>
							</PaginationItem>
						)
					}
					return (
						<PaginationItem key={`page-${page.value}`}>
							<PaginationLink
								className="m-1 text-lg hover:bg-beige"
								onClick={() => updatePage(page.value)}
							>
								{page.value}
							</PaginationLink>
						</PaginationItem>
					)
				})}
				{!isLastPage && (
					<PaginationItem>
						<PaginationNext
							className="hover:bg-beige"
							onClick={() => updatePage(currentPage + 1)}
						/>
					</PaginationItem>
				)}
			</PaginationContent>
		</_Pagination>
	)
}
