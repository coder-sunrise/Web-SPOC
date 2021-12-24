import moment from 'moment'
import { createListViewModel } from 'medisys-model'
// common components
import { notification } from '@/components'
import * as service from '@/services/doctorBlock'

export default createListViewModel({
  namespace: 'doctorBlock',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      currentViewDoctorBlock: {},
      isEditedAsSingleDoctorBlock: false,
      mode: 'single',
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async location => {
        const { pathname } = location
        if (pathname === '/setting/doctorblock') {
          const dateFrom = moment().formatUTC()
          const dateTo = moment()
            .add(6, 'months')
            .endOf('day')
            .formatUTC(false)
          dispatch({
            type: 'query',
            payload: {
              // pagesize: 999,
              lgteql_startDateTime: dateFrom,
              lsteql_endDateTime: dateTo,
            },
          })
        }
      })
    },
    effects: {
      *refresh(_, { call, put }) {
        yield put({
          type: 'queryAll',
        })
      },
      *update({ payload }, { call }) {
        const result = yield call(service.save, payload)
        if (result) {
          notification.success({ message: 'Doctor Block(s) updated' })
          return true
        }
        return false
      },
      *getDoctorBlockDetails({ payload }, { call, put }) {
        const result = yield call(service.query, payload)
        const { status, data } = result
        if (parseInt(status, 10) === 200) {
          yield put({
            type: 'setDoctorBlockView',
            payload: data,
          })
          yield put({
            type: 'setEditType',
            payload: payload.mode,
          })
          return true
        }
        return false
      },
      *copyDoctorBlock({ payload }, { call, put }) {
        const { updateReource, ...other } = payload
        const result = yield call(service.query, other)
        const { status, data } = result
        if (parseInt(status, 10) === 200) {
          const {
            id,
            recurrenceDto,
            doctorBlockRecurrenceFK,
            ...restData
          } = data
          const doctorBlock = data.doctorBlocks[0]
          let doctorBlockUserFk = restData.doctorBlockUserFk
          let start = moment(doctorBlock.startDateTime)
          let end = moment(doctorBlock.endDateTime)
          if (updateReource) {
            const { newStartTime, newEndTime, newResourceId } = updateReource
            start = moment(newStartTime)
            end = moment(newEndTime)
            if (newResourceId) {
              doctorBlockUserFk = newResourceId
            }
          }
          const copyBlock = {
            ...restData,
            doctorBlocks: data.doctorBlocks.map(item => {
              const { id, doctorBlockGroupFK, ...restItem } = item
              return {
                ...restItem,
                startDateTime: start,
                endDateTime: end,
                isEditedAsSingleDoctorBlock: true,
              }
            }),
            doctorBlockUserFk,
            isEnableRecurrence: false,
            isFromCopy: true,
          }
          yield put({
            type: 'setDoctorBlockView',
            payload: copyBlock,
          })
          yield put({
            type: 'setEditType',
            payload: payload.mode,
          })
          return true
        }
        return false
      },
    },
    reducers: {
      queryOneDone(state, { payload }) {
        return { ...state, currentViewDoctorBlock: payload.data }
      },
      setDoctorBlockView(state, { payload }) {
        return { ...state, currentViewDoctorBlock: payload }
      },
      setEditType(state, { payload }) {
        return { ...state, mode: payload }
      },
    },
  },
})
