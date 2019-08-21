import * as service from '@/services/common'

const url = '/api/clinicoperationhour'

module.exports = {
	remove: (params) => service.remove(url, params),
	queryList: (params) => service.queryList(url, params),
	upsert: (params) => service.upsert(url, params)
}
