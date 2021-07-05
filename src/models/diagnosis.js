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
        corDiagnosis: [ {} ],
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
          type: payload.type,
        })

        if (r === 204) return true

        return false
      },
      *getUserPreference ({ payload }, { call, put }) {
        const r = yield call(getUserPreference, payload.type)
        const { status, data } = r

        if (status === '200') {
          if (data) {
            const parsedFavouriteDiagnosisSetting = JSON.parse(data)
            let favouriteDiagnosis
            let favouriteDiagnosisCategory
            let favouriteDiagnosisLanguage
            if (payload.type === '6') {
              favouriteDiagnosis = parsedFavouriteDiagnosisSetting.find((o) => o.Identifier === 'FavouriteDiagnosis')
              parsedFavouriteDiagnosisSetting.find((o) => o.Identifier === 'FavouriteDiagnosisCategory')
            } else if (payload.type === '7') {
              favouriteDiagnosis = parsedFavouriteDiagnosisSetting.find(
                (o) => o.Identifier === 'FavouriteICD10Diagnosis'
              )
            } else if (payload.type === '8') {
              favouriteDiagnosisLanguage = parsedFavouriteDiagnosisSetting.find(
                (o) => o.Identifier === 'FavouriteDiagnosisLanguage'
              )
            }
            if (parsedFavouriteDiagnosisSetting.length > 0) {
              const resultFavouriteDiagnosis = {
                favouriteDiagnosis: favouriteDiagnosis ? favouriteDiagnosis.value : [],
                favouriteDiagnosisCategory: favouriteDiagnosisCategory ? favouriteDiagnosisCategory.value : [],
                favouriteDiagnosisLanguage: favouriteDiagnosisLanguage ? favouriteDiagnosisLanguage.value : [],
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
