import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import service from '../services'

export default createListViewModel({
    namespace:'settingFrameType',
    codetable:{
        message:'Frame Type updated',
        code:'frametype'
    },
    param:{
        service,
        state:{
            default:{
                isUserMaintainable: true,
                effectiveDates:[
                    moment().formatUTC(),
                    moment('2099-12-31T23:59:59').formatUTC(false),
                ],
                description:'',
            },
        },
        subscriptions:({history})=>{
            history.listen(async(loct)=>{
                const { pathname, search, query = {} } = loct
            })
        },
        effects:{},
        reducers:{
            
        }
    },
   
})