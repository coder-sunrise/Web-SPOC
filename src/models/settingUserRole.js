import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '@/pages/Setting/UserRole/services'

const defaultDates = {
  effectiveStartDate: moment().formatUTC(),
  effectiveEndDate: moment('2099-12-31T23:59:59').formatUTC(false),
}

export default createListViewModel({
  namespace: 'settingUserRole',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      list: [],
      currentSelectedUserRole: {
        filteredAccessRight: [],
        ...defaultDates,
      },
    },
    effects: {
      *fetchUserRoleByID ({ payload }, { call, put }) {
        const response = yield call(service.getUserRoleById, payload)
        const { isEdit } = payload
        let { data = {}, status } = response
        const { id, ...result } = data

        if (isEdit) {
          return yield put({
            type: 'updateUserRole',
            data: { ...data },
          })
        }

        data = result
        return yield put({
          type: 'loadAccessRight',
          data: [
            ...data.roleClientAccessRight,
          ],
        })
      },
      *fetchDefaultAccessRight ({ payload }, { call, put }) {
        const response = yield call(service.getAccessRight)
        const { data = [], status } = response

        const resultData = []
        data.map((d) => {
          const permission =
            (d.type === 'Module' && 'ReadWrite') ||
            (d.type === 'Action' && 'Enabled') ||
            (d.type === 'Field' && 'ReadWrite') ||
            'ReadWrite'
          return resultData.push({
            permission: d.permission || permission,
            ...d,
          })
        })

        return yield put({
          type: 'loadAccessRight',
          data: [
            ...resultData,
          ],
        })
      },
    },

    reducers: {
      updateUserRole (state, { data }) {
        return {
          ...state,
          currentSelectedUserRole: {
            ...data,
            filteredAccessRight: data.roleClientAccessRight,
          },
        }
      },
      loadAccessRight (state, { data }) {
        return {
          ...state,
          currentSelectedUserRole: {
            isUserMaintainable: true,
            filteredAccessRight: data,
            roleClientAccessRight: data,
            ...defaultDates,
          },
        }
      },
    },
  },
})
