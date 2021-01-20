import { createFormViewModel } from 'medisys-model'
import { getUserPreference, saveUserPreference } from '@/services/user'

export default createFormViewModel({
  namespace: 'diagnosis',
  config: {
    queryOnLoad: false,
  },
  param: {
    service: {},
    state: {
      default: {
        corDiagnosis: [
          {},
        ],
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {
      *removeWidget ({ payload }, { call, put, select }) {
        yield put({
          type: 'updateState',
          payload: {
            entity: false,
          },
        })
      },
      *saveUserPreference ({ payload }, { call, put, select }) {
        const r = yield call(saveUserPreference, {
          userPreferenceDetails: JSON.stringify(payload.userPreferenceDetails),
          itemIdentifier: payload.itemIdentifier,
          type: 6,
        })

        if (r === 204) return true

        return false
      },
      *getUserPreference ({ payload }, { call, put }) {
        const r = yield call(getUserPreference, 6)
        const { status, data } = r

        if (status === '200') {
          if (data) {
            const parsedFavouriteDiagnosisSetting = JSON.parse(data)
            if (parsedFavouriteDiagnosisSetting.length > 0) {
              const favouriteDiagnosis = parsedFavouriteDiagnosisSetting.find(
                (o) => o.Identifier === 'FavouriteDiagnosis',
              )
              const favouriteDiagnosisCategory = parsedFavouriteDiagnosisSetting.find(
                (o) => o.Identifier === 'FavouriteDiagnosisCategory',
              )
              const resultFavouriteDiagnosis = {
                favouriteDiagnosis: favouriteDiagnosis
                  ? favouriteDiagnosis.value
                  : [],
                favouriteDiagnosisCategory: favouriteDiagnosisCategory
                  ? favouriteDiagnosisCategory.value
                  : [],
              }
              yield put({
                type: 'updateState',
                payload: resultFavouriteDiagnosis,
              })
              return resultFavouriteDiagnosis
            }
          }
        }
        return null
      },
    },
    reducers: {},
  },
})
