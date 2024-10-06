/**
 * ページネーションのオプションを定義するインターフェース
 */
interface PaginationOptions {
	totalItems: number // 全アイテム数
	itemsPerPage: number // 1ページあたりのアイテム数
	currentPage: number // 現在のページ番号
	delta?: number // 現在のページの前後に表示するページ数（オプション）
}

type PageItem =
	| {
			type: 'number'
			value: number
	  }
	| {
			type: 'dots'
			value?: undefined
	  }

interface PaginationResult {
	pages: PageItem[]
	isFirstPage: boolean
	isLastPage: boolean
}

/**
 * 指定されたオプションに基づいてページネーションを生成する関数
 *
 * @param options - ページネーションのオプション
 * @returns ページネーションの結果
 */
export const paginate = (options: PaginationOptions): PaginationResult => {
	const { totalItems, itemsPerPage, currentPage, delta = 1 } = options
	const pageCount = Math.ceil(totalItems / itemsPerPage)
	const pages: PageItem[] = []
	const rangeStart = Math.max(2, currentPage - delta)
	const rangeEnd = Math.min(pageCount - 1, currentPage + delta)

	// 現在のページの前に省略記号を追加
	if (currentPage - delta > 2) {
		pages.push({ type: 'dots' })
	}

	// ページ番号を追加
	for (let i = rangeStart; i <= rangeEnd; i++) {
		pages.push({ type: 'number', value: i })
	}

	// 現在のページの後に省略記号を追加
	if (currentPage + delta < pageCount - 1) {
		pages.push({ type: 'dots' })
	}

	// 最初と最後のページを追加
	if (pageCount > 1) {
		pages.unshift({ type: 'number', value: 1 })
		pages.push({ type: 'number', value: pageCount })
	}

	const isFirstPage = currentPage === 1
	const isLastPage = currentPage === pageCount

	return {
		pages,
		isFirstPage,
		isLastPage,
	}
}
