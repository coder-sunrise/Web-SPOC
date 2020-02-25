import { createListViewModel } from 'medisys-model'
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
        filteredAccessRight: [],
        clientAccessRight: [],
      },
    },
    effects: {
      *fetchUserRoleByID ({ payload }, { call, put }) {
        const response = yield call(service.getUserRoleById, payload)
        const { data = {}, status } = response
        const nameList = [
          'module',
          'displayValue',
          'permission',
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
          data: { ...data },
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
      filter (state, { criteria }) {
        console.log(criteria)
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
