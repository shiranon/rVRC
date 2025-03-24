/**
 * 現在の日付を取得（日本時間）
 * @returns {Date} 現在の日付（日本時間）
 */
const getToday = () => {
  const now = new Date()
  // UTC時間に日本時間との差（+9時間）を足す
  const japanTime = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  return japanTime
}

/**
 * 昨日の日付を取得
 * @returns {Date} 昨日の日付
 */
const getYesterday = () => {
	const yesterday = new Date(getToday())
	yesterday.setDate(yesterday.getDate() - 1)
	return yesterday
}

const getDevYesterday = () => {
  const devYesterday = new Date(getDevDefaultDate())
  devYesterday.setDate(devYesterday.getDate() - 1)
  return devYesterday
}

// 開発環境用の日付設定
const getDevDefaultDate = () => {
  try {
    if (import.meta.env.VITE_LOCAL_DATE) {
      const devDate = new Date(import.meta.env.VITE_LOCAL_DATE)
      if (!Number.isNaN(devDate.getTime())) {
        return devDate;
      }
    }
    // 環境変数がない or 無効な場合は現在の日本時間を返す
    return getToday()
  } catch (e) {
    return getToday()
  }
}

/**
 * ランキング更新時刻（21時）前かどうかを判定
 * @returns {boolean} 21時前ならtrue、それ以降ならfalse
 */
const isBeforeRankingUpdate = () => getToday().getHours() < 21

/**
 * 日付を日本時間でYYYY-MM-DD形式にフォーマット
 * @param {Date} date フォーマットする日付
 * @returns {string} YYYY-MM-DD形式の日付文字列
 */
const getFormattedDate = (date: Date) => {
	const options: Intl.DateTimeFormatOptions = {
		timeZone: 'Asia/Tokyo',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}
	const formattedDate = date.toLocaleDateString('ja-JP', options)
	return formattedDate.replace(/\//g, '-')
}

/**
 * 環境と時刻に応じて適切な日付を取得し、フォーマット
 * @returns {string} YYYY-MM-DD形式の日付文字列
 */
const getTodayDate = () => {
  const date = import.meta.env.PROD
    ? isBeforeRankingUpdate()
      ? getYesterday()
      : getToday()
    : isBeforeRankingUpdate()
      ? getDevYesterday()
      : getDevDefaultDate();
  return getFormattedDate(date);
}


/**
 * WIP: 月間ランキング用
 * 日付文字列を月初めの日付にフォーマット
 * @param {string} date YYYY-MM-DDまたはYYYY-MM形式の日付文字列
 * @returns {string} YYYY-MM-01形式の日付文字列
 */
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

export { formatMonth, getTodayDate, isBeforeRankingUpdate }

