import { createFormViewModel } from 'medisys-model'
import { connect } from 'dva'
import service from '../services'
import moment from 'moment'

let companyTypes = [
  { id: 1, name: 'copayer' },
  { id: 2, name: 'supplier' },
  { id: 3, name: 'manufacturer' },
]

const { queryOne } = service

export default createFormViewModel({
  namespace: 'copayerDetail',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    currentId: '',
    state: {
      default: {
        isUserMaintainable: true,
        effectiveDates: [
          moment().formatUTC(),
          moment('2099-12-31T23:59:59').formatUTC(false),
        ],
        adminCharge: 0,
        adminChargeType: 'Percentage',
        autoInvoiceAdjustmentType: 'Percentage',
        autoInvoiceAdjustment: 0,
        statementAdjustmentType: 'Percentage',
        statementAdjustment: 0,
        coPayerTypeFK: 1,
        isGSTEnabled: false,
        isAutoGenerateStatementEnabled: false,
        defaultStatementAdjustmentRemarks: '',
        contactPersons: [],
        informations: [],
        website: '',
        address: {
          blockNo: '',
          buildingName: '',
          countryCode: '',
          countryDisplayValue: '',
          postcode: '',
          street: '',
          unitNo: '',
        },
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen((loct, method) => {
        const { pathname, query = {} } = loct

        if (pathname === '/finance/copayer/editcopayer') {
          dispatch({
            type: 'queryCopayerDetails',
            payload: { id: query.id },
          })
        }
      })
    },
    effects: {
      *queryCopayerDetails({ payload }, { call, put }) {
        const response = yield call(queryOne, payload)
        yield put({
          type: 'copayerDetailsResult',
          payload: response.status === '200' ? response.data : {},
        })
        return response.data
      },
    },
    reducers: {
      copayerDetailsResult(state, { payload }) {
        const data = payload
        if (data.contactPersons && data.contactPersons.length > 0) {
          for (let i = 0; i < data.contactPersons.length; i++) {
            data.contactPersons[i].key = i
            data.contactPersons[i].recordStatus = 'Existing'
            data.contactPersons[i].isNewRecord = false
          }
        }

        if (data.informations && data.informations.length > 0) {
          for (let i = 0; i < data.informations.length; i++) {
            data.informations[i].key = i
            data.informations[i].recordStatus = 'Existing'
            data.informations[i].isNewRecord = false
          }
        }

        return {
          ...state,
          entity: {
            ...data,
            effectiveDates: [data.effectiveStartDate, data.effectiveEndDate],
          },
        }
      },
    },
  },
})
