import { createFormViewModel } from 'medisys-model'
// import * as service from '../services'
import { getUniqueGUID } from 'utils'
import moment from 'moment'

export default createFormViewModel({
  namespace: 'refractionForm',
  config: {
    queryOnLoad: false,
  },
  param: {
    service: {},
    state: {
      default: {
        corRefractionForm: {
          formData: {
            Tenometry: {
              R: '',
              L: '',
            },
            EyeDominance: {
              Left: false,
              Right: false,
            },
            VanHerick: '',
            PupilSize: {
              R: '',
              L: '',
            },
            Remarks: '',
            Tests: [
              {
                EyeRefractionTestTypeFK: 0,
                EyeRefractionTestType: '',
                SphereOD: '',
                CylinderOD: '',
                AxisOD: '',
                VaOD: '',
                SphereOS: '',
                CylinderOS: '',
                AxisOS: '',
                VaOS: '',
              },
            ],
            NearAdd: {
              NearAddNOD: '',
              NearAddcmOD: '',
              NearAddDOD: '',
              NearAddPHOD: '',
              NearAddNOS: '',
              NearAddcmOS: '',
              NearAddDOS: '',
              NearAddPHOS: '',
            },
            TestRemarks: '',
          },
        },
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {},
    reducers: {},
  },
})
