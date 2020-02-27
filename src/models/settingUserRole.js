import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '@/pages/Setting/UserRole/services'

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
        isEdit: false,
        filteredAccessRight: [],
        effectiveStartDate: moment().formatUTC(),
        effectiveEndDate: moment('2099-12-31T23:59:59').formatUTC(false),
      },
    },
    effects: {
      *fetchUserRoleByID ({ payload }, { call, put }) {
        const response = yield call(service.getUserRoleById, payload)
        const { isEdit } = payload
        const { data = {}, status } = response
        const nameList = [
          'module',
          'displayValue',
        ]
        return yield put({
          type: 'updateUserRole',
          data: { ...data, isEdit },
        })
      },
      *fetchDefaultAccessRight ({ payload }, { call, put }) {
        const response = yield call(service.getAccessRight)
        const { data = [], status } = response
        const nameList = [
          'module',
          'displayValue',
        ]

        const resultData = []
        data.map((d) => {
          const permission =
            (d.type === 'Module' && 'ReadOnly') ||
            (d.type === 'Action' && 'Disabled') ||
            (d.type === 'Field' && 'ReadOnly') ||
            'Hidden'
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
            effectiveStartDate:
              state.currentSelectedUserRole.effectiveStartDate,
            effectiveEndDate: state.currentSelectedUserRole.effectiveEndDate,
            filteredAccessRight: data,
            roleClientAccessRight: data,
          },
        }
      },
      filter (state, { criteria }) {
        const accessRight = [
          ...state.currentSelectedUserRole.roleClientAccessRight,
        ]
        let result = accessRight
        // eslint-disable-next-line guard-for-in
        for (let key in criteria) {
          result = accessRight.filter((el) => {
            return el[key] === criteria[key]
          })
        }
        return {
          ...state,
          currentSelectedUserRole: {
            ...state.currentSelectedUserRole,
            filteredAccessRight: result,
          },
        }
      },
    },
  },
})
