const getToday = () => new Date()
const getYesterday = () => {
	const yesterday = new Date(getToday())
	yesterday.setDate(yesterday.getDate() - 1)
	return yesterday
}

const isBeforeRankingUpdate = () => getToday().getHours() < 21
// 開発環境用のデフォルト日付
// const devDefaultDate = new Date(LocalDate.LOCAL_DATE)
const devDefaultDate = new Date('2024-08-30')

const getDevYesterday = () => {
	const devYesterday = new Date(devDefaultDate)
	devYesterday.setDate(devYesterday.getDate() - 1)
	return devYesterday
}

const getTodayDate = () => {
	const date = import.meta.env.PROD
		? isBeforeRankingUpdate()
			? getYesterday()
			: getToday()
		: isBeforeRankingUpdate()
			? getDevYesterday()
			: devDefaultDate
	return date.toISOString().split('T')[0]
}

const zeroPad = (date: number): string => {
	return String(date).padStart(2, '0')
}

const formatTimestamp = (timestamp: string): string => {
	const date = new Date(timestamp)
	const year = date.getFullYear()
	const month = zeroPad(date.getMonth() + 1)
	const day = zeroPad(date.getDate())
	return `${year}-${month}-${day}`
}

const excludeOldData = (timestamp: string): string => {
	const date = new Date(timestamp)
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const formattedDate = `${year}-${zeroPad(month)}-${zeroPad(day)}`

	if (year <= 2024 && month <= 8 && day < 18) {
		return ''
	}
	return formattedDate
}

const formatMonth = (date: string): string => {
	let format_month = ''
	if (date.length >= 10) {
		format_month = date.slice(0, 7)
	} else {
		format_month = date
	}
	format_month = `${format_month}-01`
	return format_month
}

export {
	getTodayDate,
	isBeforeRankingUpdate,
	formatTimestamp,
	excludeOldData,
	formatMonth,
}
