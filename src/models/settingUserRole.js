import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '@/pages/Setting/UserRole/services'

const defaultDates = {
  effectiveStartDate: moment().formatUTC(),
  effectiveEndDate: moment('2099-12-31T23:59:59').formatUTC(false),
}

const compare = (a, b) => {
  const f = a.module.localeCompare(b.module)
  if (f !== 0) return f
  return a.sortOrder - b.sortOrder
}

const getClinicRoleBitValues = clinicRoleBitValue => {
  let items = []
  let values = []
  let x = clinicRoleBitValue
  while (x > 0) {
    items.push(x % 2)
    x = parseInt(x / 2, 10)
  }

  items.forEach((item, index) => {
    if (item === 1) {
      values.push(2 ** index)
    }
  })
  return values
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
        ...defaultDates,
      },
    },
    effects: {
      *fetchUserRoleByID({ payload }, { call, put }) {
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
          data: [...data.roleClientAccessRight],
        })
      },
      *fetchDefaultAccessRight({ payload }, { call, put }) {
        const response = yield call(service.getAccessRight)
        const { data = [], status } = response

        const resultData = data.map(d => {
          const permission =
            (d.type === 'Module' && 'ReadWrite') ||
            (d.type === 'Action' && 'Enable') ||
            (d.type === 'Field' && 'ReadWrite') ||
            'ReadWrite'
          return {
            permission: d.permission || permission,
            ...d,
          }
        })

        return yield put({
          type: 'loadAccessRight',
          data: [...resultData],
        })
      },
      *fetchActiveUsers({ payload }, { call, put }) {
        try {
          const response = yield call(service.getActiveUsers)
          const { data } = response
          return data
        } catch (error) {
          console.log(error)
          return false
        }
      },
    },

    reducers: {
      updateUserRole(state, { data }) {
        return {
          ...state,
          currentSelectedUserRole: {
            ...data,
            roleClientAccessRight: data.roleClientAccessRight
              .sort(compare)
              .map(item => ({
                ...item,
                clinicRoleBitValues: getClinicRoleBitValues(
                  item.clinicRoleBitValue,
                ),
              })),
          },
        }
      },
      loadAccessRight(state, { data }) {
        return {
          ...state,
          currentSelectedUserRole: {
            isUserMaintainable: true,
            roleClientAccessRight: data.sort(compare).map(item => ({
              ...item,
              clinicRoleBitValues: getClinicRoleBitValues(
                item.clinicRoleBitValue,
              ),
            })),
            ...defaultDates,
          },
        }
      },
    },
  },
})
