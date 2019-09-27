import router from 'umi/router'
import { createFormViewModel } from 'medisys-model'
import * as service from '@/services/patient'
import { getRemovedUrl, getAppendUrl } from '@/utils/utils'

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
              countryFK: 107,
              isPrimary: true,
              isMailing: true,
            },
          ],
          contactEmailAddress: {
            emailAddress: '',
          },
          mobileContactNumber: {
            number: '',
          },
          homeContactNumber: {
            number: '',
          },
          officeContactNumber: {
            number: '',
          },
          faxContactNumber: {
            number: '',
          },
          contactWebsite: {
            website: '',
          },
        },
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
        // console.log({ pathname })
        // console.log(loct, method)
        // console.log(query)
        if (query.md === 'pt' && query.cmt) {
          dispatch({
            type: 'initState',
            payload: {
              version: Number(query.v) || undefined,
              currentComponent: query.cmt,
              currentId: Number(query.pid) || 0,
            },
          })
          // dispatch({
          //   type: 'updateState',
          //   payload: {
          //     currentComponent: query.cmt,
          //     currentId: Number(query.pid) || 0,
          //   },
          // })
          // if (query.pid) {
          //   dispatch({
          //     type: 'query',
          //     payload: {
          //       id: query.pid,
          //     },
          //   })
          // }
        }
        // if (
        //   query.new ||
        //   pathname === '/patientdb/new' ||
        //   pathname === '/reception/queue'
        // ) {
        //   dispatch({
        //     type: 'updateState',
        //     payload: {
        //       currentId: undefined,
        //       entity: null,
        //     },
        //   })
        // }
      })
    },
    effects: {
      *initState ({ payload }, { call, put, select, take }) {
        let { currentId, version, currentComponent } = payload
        yield put({
          type: 'updateState',
          payload: {
            currentComponent,
          },
        })
        const patient = yield select((state) => state.patient)
        if (
          patient.version !== version ||
          (patient.entity && patient.entity.id !== currentId)
        )
          yield put({
            type: 'query',
            payload: {
              id: currentId,
              version,
            },
          })
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
      *closePatientModal ({ payload }, { call, put }) {
        router.push(
          getRemovedUrl([
            'md',
            'cmt',
            'pid',
            'new',
            // 'v',
          ]),
        )
        // yield put({
        //   type: 'updateState',
        //   payload: {
        //     entity: undefined,
        //   },
        // })
        yield put({
          type: 'global/updateAppState',
          payload: {
            disableSave: false,
            showPatientInfoPanel: false,
            fullscreen: false,
            currentPatientId: null,
          },
        })
      },

      openPatientModal ({ payload }, { call, put }) {
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
