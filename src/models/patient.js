import router from 'umi/router'
import { createFormViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '@/services/patient'
import {
  getRemovedUrl,
  getAppendUrl,
  getRefreshChasBalanceStatus,
} from '@/utils/utils'

export default createFormViewModel({
  namespace: 'patient',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      menuErrors: {},
      currentComponent: '1',
      default: {
        effectiveStartDate: moment().formatUTC(),
        effectiveEndDate: moment('2099-12-31').formatUTC(),
        patientAccountNo: '',
        patientEmergencyContact: [],
        patientAllergy: [],
        patientAllergyMetaData: [],
        patientMedicalAlert: [],
        patientScheme: [],
        schemePayer: [],
        referredBy: '',
        // dob: new Date(),
        contact: {
          contactAddress: [
            {
              // Id: getUniqueGUID(),
              countryFK: undefined,
              isPrimary: true,
              isMailing: true,
            },
          ],
          contactEmailAddress: {
            emailAddress: '',
          },
          mobileContactNumber: {
            number: undefined,
            countryCodeFK: 1,
          },
          homeContactNumber: {
            number: '',
            countryCodeFK: 1,
          },
          officeContactNumber: {
            number: '',
            countryCodeFK: 1,
          },
          faxContactNumber: {
            number: '',
            countryCodeFK: 1,
          },
          contactWebsite: {
            website: '',
          },
        },
        patientPdpaConsent: [
          {
            pdpaConsentTypeFK: 1,
            isConsent: true,
          },
          {
            pdpaConsentTypeFK: 2,
            isConsent: false,
          },
          {
            pdpaConsentTypeFK: 3,
            isConsent: false,
          },
        ],
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct

        setTimeout(() => {
          if (query.md === 'pt' && query.cmt) {
            dispatch({
              type: 'updateState',
              payload: {
                currentComponent: query.cmt,
              },
            })
            dispatch({
              type: 'initState',
              payload: {
                md: query.md,
                newPatient: query.new,
                version: Number(query.v) || undefined,
                currentId: Number(query.pid) || undefined,
              },
            })
          }
        }, 1)
      })
    },
    effects: {
      *initState ({ payload }, { call, put, select, take }) {
        let { currentId, version, currentComponent, md, newPatient } = payload
        if (newPatient) {
          yield put({ type: 'updateState', payload: { entity: null } })
        }

        const patient = yield select((state) => state.patient)
        if (
          !newPatient &&
          (patient.version !== version ||
            (patient.entity && patient.entity.id !== currentId))
        ) {
          yield put({
            type: 'query',
            payload: {
              id: currentId,
              version,
            },
          })
          yield take('patient/query/@@end')
        }
        if (md === 'pt')
          yield put({
            type: 'global/updateState',
            payload: {
              fullscreen: true,
              showPatientInfoPanel: true,
            },
          })
      },
      *waitLoadComplete ({ payload }, { call, put, select, take }) {
        // let { currentId, version, currentComponent } = payload

        yield take('patient/query/@@end')
        return ''
        // const patient = yield select((state) => state.patient)
        // if (
        //   patient.version !== version ||
        //   (patient.entity && patient.entity.id !== currentId)
        // )
        //   yield put({
        //     type: 'query',
        //     payload: {
        //       id: currentId,
        //       version,
        //     },
        //   })
      },
      // *fetchList ({ payload }, { call, put }) {
      //   const response = yield call(service.queryList)
      //   console.log(response)
      //   yield put({
      //     type: 'updateState',
      //     payload: {
      //       list: Array.isArray(response) ? response : [],
      //     },
      //   })
      // },
      *closePatientModal ({ payload }, { all, put }) {
        const { history } = payload || { history: undefined }

        // do not remove PID query in these URLs
        const exceptionalPaths = [
          'billing',
          'dispense',
          'patientdashboard',
        ]

        const matchesExceptionalPath = exceptionalPaths.reduce(
          (matched, url) =>
            history.location.pathname.indexOf(url) > 0 ? true : matched,
          false,
        )

        let shouldRemoveQueries = [
          'md',
          'cmt',
          'pid',
          'new',
          'qid',
          'v',
        ]
        if (matchesExceptionalPath) {
          shouldRemoveQueries = [
            'md',
            'cmt',
            'new',
          ]
        }
        router.push(getRemovedUrl(shouldRemoveQueries))
        // yield put({
        //   type: 'updateState',
        //   payload: {
        //     entity: undefined,
        //   },
        // })
        yield all([
          yield put({
            type: 'global/updateAppState',
            payload: {
              disableSave: false,
              showPatientInfoPanel: false,
              fullscreen: false,
              currentPatientId: null,
            },
          }),
          yield put({
            type: 'updateState',
            paylad: {
              callback: undefined,
            },
          }),
        ])
      },

      *openPatientModal ({ payload = { callback: undefined } }, { call, put }) {
        if (payload.callback) {
          yield put({
            type: 'updateState',
            payload: { callback: payload.callback },
          })
        }
        router.push(
          getAppendUrl({
            md: 'pt',
            cmt: '1',
            new: 1,
          }),
        )
      },
      // *queryOne ({ payload }, { call, put }) {
      //   const response = yield call(service.query, payload)
      //   yield put({
      //     type: 'updateState',
      //     payload: {
      //       entity: response.data,
      //     },
      //   })
      //   return response.data
      // },
      // *submit ({ payload }, { call }) {
      //   // console.log(payload)
      //   return yield call(service.upsert, payload)
      // },
      *refreshChasBalance ({ payload }, { call }) {
        const { patientAccountNo, patientCoPaymentSchemeFK } = payload
        const newPayload = {
          patientNric: patientAccountNo,
          patientCoPaymentSchemeFK,
          year: moment().year(),
          isSaveToDb: true,
        }

        const response = yield call(service.requestChasBalance, newPayload)
        console.log('call api ', response)
        const { data } = response
        let result = { isSuccessful: false }

        if (data) {
          const status = getRefreshChasBalanceStatus(data.status)
          return { ...data, ...status }
        }

        return result
      },
    },
    reducers: {
      queryDone (st, { payload }) {
        const { data } = payload
        // console.log(payload)
        data.patientScheme.forEach((ps) => {
          if (ps.validFrom && ps.validTo)
            ps.validRange = [
              ps.validFrom,
              ps.validTo,
            ]
          if (ps.coPaymentSchemeFK === null) {
            ps.coPaymentSchemeFK = undefined
          }
        })
        return {
          ...st,
          entity: data,
        }
      },
    },
  },
})
