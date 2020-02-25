import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '../services'
import { timeFormat } from '@/components'

const calculateDuration = (startTime, endTime) => {
  const duration = moment.duration(
    moment(endTime, timeFormat).diff(moment(startTime, timeFormat)),
  )
  const hours = parseInt(duration.asHours(), 10)
  const mins = parseInt(duration.asMinutes(), 10) - hours * 60

  let string = ''
  if (hours > 0) {
    string = hours > 1 ? `${hours} HRS` : `${hours} HR `
    string += ' '
    if (mins > 0) {
      string += mins > 1 ? ` ${mins} MINS` : `${mins} MIN`
    }
  } else if (mins > 0) {
    string = mins > 1 ? ` ${mins} MINS` : `${mins} MIN`
  }

  if (hours === 0 && mins === 0) string = '0 MIN'
  return string
}

export default createListViewModel({
  namespace: 'appointment',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      default: {},
    },
    effects: {
      *queryAllAppointments ({ payload }, { call, put }) {
        const response = yield call(service.queryList, payload)
        yield put({
          type: 'queryDone',
          payload:
            response.status === '200'
              ? { ...response.data, forPrint: true }
              : {},
        })
      },
    },
    reducers: {
      queryOneDone (st, { payload }) {
        const { data } = payload
        data.effectiveDates = [
          data.effectiveStartDate,
          data.effectiveEndDate,
        ]
        return {
          ...st,
          entity: data,
        }
      },

      queryDone (st, { payload }) {
        const { forPrint, data } = payload
        const list = forPrint ? data : data.data
        let formattedList = []
        for (let i = 0; i < list.length; i++) {
          const { appointment_Resources, ...restValues } = list[i]
          const currentPatientAppts = appointment_Resources.map((appt, idx) => {
            const {
              roomFk,
              startTime,
              clinicianFK,
              endTime,
              appointmentFK,
            } = appt

            const commonValues = {
              ...restValues,
              id: appt.id,
              roomFk,
              appointmentFK,
              apptTime: startTime,
              doctor: clinicianFK,
              duration: calculateDuration(startTime, endTime),
            }

            if (idx === 0) {
              return {
                ...commonValues,
                countNumber: 1,
                rowspan: appointment_Resources.length,
              }
            }
            return {
              ...commonValues,
              countNumber: 0,
              rowspan: 0,
            }
          })

          formattedList = [
            ...formattedList,
            ...currentPatientAppts,
          ]
        }
        const returnProperty = forPrint ? 'printList' : 'list'
        return {
          ...st,
          [returnProperty]: formattedList,
        }
      },
    },
  },
})
