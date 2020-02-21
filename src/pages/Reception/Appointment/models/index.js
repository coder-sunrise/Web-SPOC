import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '../services'
import { timeFormat } from '@/components'

const calculateDuration = (startTime, endTime) => {
  const durationInMins = moment
    .duration(moment(endTime, timeFormat).diff(moment(startTime, timeFormat)))
    .asMinutes()
  return `${durationInMins} ${durationInMins > 1 ? 'MINS' : 'MIN'}`
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
    effects: {},
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
        const { data } = payload.data

        let formattedList = []
        for (let i = 0; i < data.length; i++) {
          const { appointment_Resources, ...restValues } = data[i]
          const currentPatientAppts = appointment_Resources.map((appt, idx) => {
            const { roomFk, startTime, clinicianFK, endTime } = appt

            const commonValues = {
              ...restValues,
              roomFk,
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

        return {
          ...st,
          list: formattedList,
        }
      },
    },
  },
})
