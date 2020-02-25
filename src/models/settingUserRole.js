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
        for (let i = 0; i < nameList.length; i++) {
          yield put({
            type: 'genList',
            data: [
              ...data.roleClientAccessRight,
            ],
            name: nameList[i],
          })
        }
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

        for (let i = 0; i < nameList.length; i++) {
          yield put({
            type: 'genList',
            data: [
              ...data,
            ],
            name: nameList[i],
          })
        }
        console.log(data)
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

        console.log(resultData)
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
      genEffectiveDate (state) {
        return { ...state }
      },
      genList (state, { name, data }) {
        let set = new Set()
        let result = []
        data.map((d) => {
          return set.add(d[name])
        })
        let list = [
          ...set,
        ]
        list.map((s) => {
          return result.push({
            name: s,
            value: s,
          })
        })
        return {
          ...state,
          [name.concat('List')]: [
            ...result,
          ],
        }
      },
    },
  },
})
