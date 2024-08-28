const getToday = () => new Date()
const getYesterday = () => {
	const yesterday = new Date(getToday())
	yesterday.setDate(yesterday.getDate() - 1)
	return yesterday
}

const isBeforeRankingUpdate = () => getToday().getHours() < 21

// 開発環境用のデフォルト日付
const devDefaultDate = new Date('2024-08-20')
const getDevYesterday = () => {
	const devYesterday = new Date(devDefaultDate)
	devYesterday.setDate(devYesterday.getDate() - 1)
	return devYesterday
}

const getTodayDate = () => {
	if (import.meta.env.PROD) {
		return (isBeforeRankingUpdate() ? getYesterday() : getToday())
			.toISOString()
			.split('T')[0]
	}
	return (isBeforeRankingUpdate() ? getDevYesterday() : devDefaultDate)
		.toISOString()
		.split('T')[0]
}

export { getTodayDate, isBeforeRankingUpdate }
