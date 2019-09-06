import { createListViewModel } from 'medisys-model'
// import * as service from '../services'
import { getUniqueId } from '@/utils/utils'

const sharedMedicationValue = {
  quantity: 1,
  corPrescriptionItemPrecaution: [
    {},
  ],
  corPrescriptionItemInstruction: [
    {
      usageMethodFK: 1,
      dosageFK: 1,
      prescribeUOMFK: 1,
      drugFrequencyFK: 1,
      dispenseUOMFK: 1,
      duration: 1,
      stepdose: 'AND',
    },
  ],
}
export default createListViewModel({
  namespace: 'orders',
  config: {
    queryOnLoad: false,
  },
  param: {
    service: {},
    state: {
      editType: '1',
      rows: [],
      defaultMedication: {
        ...sharedMedicationValue,
      },
      default: {
        corPrescriptionItemPrecaution: [
          {
            action: '1',
            count: 1,
            unit: '1',
            frequency: '1',
            day: 1,
            // precaution: '1',
            operator: '1',
          },
        ],
        descriptions: [
          {
            action: '1',
            count: 1,
            unit: '1',
            frequency: '1',
            day: 1,
            precaution: '1',
            operator: '1',
          },
        ],
        quantity: 1,
        total: 20,
        totalAfterAdj: 18,
      },
    },
    subscriptions: ({ dispatch, history }) => {
      // history.listen(async (loct, method) => {
      //   const { pathname, search, query = {} } = loct
      // })
    },
    effects: {},
    reducers: {
      upsertRow (state, { payload }) {
        let { rows } = state
        if (payload.uid) {
          rows = rows.map((row) => {
            const n =
              row.uid === payload.uid
                ? {
                    ...row,
                    ...payload,
                  }
                : row
            return n
          })
        } else {
          rows.push({
            ...payload,
            uid: getUniqueId(),
          })
        }

        return {
          ...state,
          rows,
          entity: undefined,
        }
      },

      deleteRow (state, { payload }) {
        const { rows } = state

        return {
          ...state,
          rows: rows.map((o) => {
            if (o.uid === payload.id) o.isDeleted = true
            return o
          }),
        }
      },
    },
  },
})
