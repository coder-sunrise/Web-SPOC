import { createListViewModel } from 'medisys-model'
import service from '../services'

export default createListViewModel({
  namespace: 'corporateBilling',
  config: {
    queryOnLoad: true,
  },
  param: {
    service,
    state: {},
  },
})
