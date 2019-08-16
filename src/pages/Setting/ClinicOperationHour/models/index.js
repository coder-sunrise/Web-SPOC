import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '../services'

export default createListViewModel({
	namespace: 'settingClinicOperationHour',
	config: {
		// queryOnLoad: false,
	},
	param: {
		service,
		state: {
			default: {
				isUserMaintainable: true,
				effectiveDates: [
					moment().utc().set({ hour: 0, minute: 0, second: 0 }),
					moment('2099-12-31')
						.utc()
						.set({ hour: 23, minute: 59, second: 59 })
				]
			}
		},
		subscriptions: ({ dispatch, history }) => {
			history.listen(async (loct, method) => {
				const { pathname, search, query = {} } = loct
			})
		},
		effects: {},
		reducers: {
			queryDone(st, { payload }) {
				const { data } = payload

				return {
					...st,
					list: data.data.map((o) => {
						return {
							...o,
							effectiveDates: [
								o.effectiveStartDate,
								o.effectiveEndDate
							]
						}
					})
				}
			}
		}
	}
})
