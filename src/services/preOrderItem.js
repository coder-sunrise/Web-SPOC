import * as service from '@/services/common'
import { axiosRequest } from '@/utils/request'

const url = '/api/patientpreorderitem'

const fns ={
    queryList: params => service.queryList(url,params),
    upsert: params => service.upsert(url,params),

}

export default fns