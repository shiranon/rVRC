import { useNavigate, useSearchParams } from '@remix-run/react'
import { useEffect, useState } from 'react'
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
	const [searchParams] = useSearchParams()
	const [currentPage, setCurrentPage] = useState<number>(1)

	const navigate = useNavigate()
	const updatePage = (page: number) => {
		const newSearchParams = new URLSearchParams(searchParams)
		newSearchParams.set('page', page.toString())
		navigate(`?${newSearchParams.toString()}`, { replace: true })
	}

	const { pages, isFirstPage, isLastPage } = paginate({
		totalItems,
		itemsPerPage,
		currentPage,
		delta,
	})

	console.log('pages', pages)
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
						<PaginationPrevious onClick={() => updatePage(currentPage - 1)} />
					</PaginationItem>
				)}
				{pages.map((page) => {
					if (page.type === 'dots') {
						return (
							<PaginationItem key={`page-${page.value}`}>
								<PaginationEllipsis />
							</PaginationItem>
						)
					}
					return (
						<PaginationItem key={`page-${page.value}`}>
							<PaginationLink onClick={() => updatePage(page.value)}>
								{page.value}
							</PaginationLink>
						</PaginationItem>
					)
				})}
				{!isLastPage && (
					<PaginationItem>
						<PaginationNext onClick={() => updatePage(currentPage + 1)} />
					</PaginationItem>
				)}
			</PaginationContent>
		</_Pagination>
	)
}
