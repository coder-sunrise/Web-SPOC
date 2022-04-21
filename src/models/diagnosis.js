import { createFormViewModel } from 'medisys-model'
import { getUserPreference, saveUserPreference } from '@/services/user'
import { USER_PREFERENCE_TYPE } from '@/utils/constants'

export default createFormViewModel({
  namespace: 'diagnosis',
  config: {
    queryOnLoad: false,
  },
  param: {
    service: {},
    state: {
      default: {
        corDiagnosis: [{}],
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {
      *removeWidget({ payload }, { call, put, select }) {
        yield put({
          type: 'updateState',
          payload: {
            entity: false,
          },
        })
      },
      *saveUserPreference({ payload }, { call, put, select }) {
        const r = yield call(saveUserPreference, {
          userPreferenceDetails: JSON.stringify(payload.userPreferenceDetails),
          itemIdentifier: payload.itemIdentifier,
          type: payload.type,
        })

        if (r === 204) return true

        return false
      },
      *getUserPreference({ payload }, { call, put }) {
        const r = yield call(getUserPreference, payload.type)
        const { status, data } = r
        if (status === '200') {
          if (data) {
            const parsedFavouriteDiagnosisSetting = JSON.parse(data)
            let favouriteDiagnosis
            let favouriteDiagnosisCategory
            let favouriteDiagnosisLanguage
            let resultFavouriteDiagnosis = {
              favouriteDiagnosisLanguage: 'EN',
            }
            if (
              payload.type === USER_PREFERENCE_TYPE['FAVOURITEDIAGNOSISSETTING']
            ) {
              favouriteDiagnosis = parsedFavouriteDiagnosisSetting.find(
                o => o.Identifier === 'FavouriteDiagnosis',
              )
              parsedFavouriteDiagnosisSetting.find(
                o => o.Identifier === 'FavouriteDiagnosisCategory',
              )

              resultFavouriteDiagnosis = {
                favouriteDiagnosis: favouriteDiagnosis
                  ? favouriteDiagnosis.value
                  : [],
                favouriteDiagnosisCategory: favouriteDiagnosisCategory
                  ? favouriteDiagnosisCategory.value
                  : [],
              }
            } else if (
              payload.type ===
              USER_PREFERENCE_TYPE['FAVOURITEICD10DIAGNOSISSETTING']
            ) {
              favouriteDiagnosis = parsedFavouriteDiagnosisSetting.find(
                o => o.Identifier === 'FavouriteICD10Diagnosis',
              )
              resultFavouriteDiagnosis = {
                favouriteDiagnosis: favouriteDiagnosis
                  ? favouriteDiagnosis.value
                  : [],
              }
            } else if (
              payload.type ===
              USER_PREFERENCE_TYPE['FAVOURITEDIAGNOSISLANGUAGESETTING']
            ) {
              favouriteDiagnosisLanguage = parsedFavouriteDiagnosisSetting.find(
                o => o.Identifier === 'FavouriteDiagnosisLanguage',
              )
              resultFavouriteDiagnosis = {
                favouriteDiagnosisLanguage: favouriteDiagnosisLanguage
                  ? favouriteDiagnosisLanguage.value
                  : 'EN',
              }
            }
            yield put({
              type: 'updateState',
              payload: resultFavouriteDiagnosis,
            })
            return resultFavouriteDiagnosis
          }
        }
        return null
      },
    },
    reducers: {},
  },
})
