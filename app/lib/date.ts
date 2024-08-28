const today = new Date()
//2024-08-26T02:02:26.609Zの形式をTで分割して0番目を取得

const todayDate = import.meta.env.PROD
	? today.toISOString().split('T')[0]
	: '2024-08-20'

export { todayDate }
