import React, {Component} from 'react'
import { withStyles } from '@material-ui/core'
import { GridContainer,CardContainer,withFormikExtend,GridItem,Button } from '@/components'
import { connect } from 'dva'
import { queryReferralHistory } from '@/services/patientHistory'
import { findGetParameter } from '@/utils/utils'
import Authorized from '@/utils/Authorized'
import ReferralGrid from './ReferralGrid'

const styles = () =>({})

@withFormikExtend({
  mapPropsToValues: ({ patientHistory }) => {},

handleSubmit: async (props) => {
  const {referralPersonHistory,patientHistory,dispatch} = props
  console.log('Dispatch',dispatch)
  // console.log ('SubmitpatientHistory',patientHistory)
  // console.log ('SubmitreferralPersonHistory',referralPersonHistory)
  const response = await dispatch({
    type: 'patientHistory/saveReferralHistory',
    payload: { 
      id: patientHistory.patientID,
      referralPersonHistory,
     
     },
  })
},
})
@connect(({ patientHistory, clinicSettings, codetable, user }) => ({
  patientHistory,
  clinicSettings,
  codetable,
  user,
}))


class PatientReferral extends Component {
  constructor (props) {
    super(props)

    this.myRef = React.createRef()

    // this.widgets = WidgetConfig.widget(props).filter((o) => {
    //   if(o.authority === undefined) return true
    //   const accessRight = Authorized.check(o.authority)
    //     return accessRight && accessRight.rights !== 'hidden'
    // })

    this.state = {
      // pageIndex: 0,
    }

  }


  


  componentWillMount () {
    const {dispatch,patientHistory,pageSize,pageIndex,values } =this.props

    dispatch({
      type :'patientHistory/queryReferralHistory',
      payload: {
        pageIndex:  1,
        pageSize: 9999,
        patientProfileId: patientHistory.patientID,
      },
    })

  }
    

    render () {
        const {
          classes,
          dispatch,
          patientHistory,
          values,
          schema,
          entity,
          user,
          theme,
          setValues,
          global,
          data,
          dis,
          ...restProps
        } = this.props

        const {PatientReferralHistory} = patientHistory
        // console.log('referralEntityData',referralHistory.entity.data)
        // console.log('props',this.props)
        // const accessRight = Authorized.check(
        //   'patientdatabase.patientprofiledetails.patienthistory.referralhistory',
        // )
    
        // console.log(accessRight) 
        return (
          <Authorized authority='patientdatabase.patientprofiledetails.patienthistory.referralhistory'>
            {({ rights: referralhistoryAccessRight }) => (
              <Authorized.Context.Provider
                value={{
                rights:
                referralhistoryAccessRight === 'readwrite' ||
                referralhistoryAccessRight === 'enable'
                    ? 'enable'
                    : referralhistoryAccessRight,
              }}
              >
                <React.Fragment>
                  <CardContainer hideHeader size='sm'>
                    <GridContainer>
                      <ReferralGrid
                        rows={PatientReferralHistory.entity.data}
                        // schema={schema}
                        dispatch={this.dispatch}
                        values={this.props}
                        {...restProps}
                      />
                    </GridContainer>
                  </CardContainer>
                  <GridItem md={12} style={{ textAlign: 'end' }}>
                    <Button color='primary' onClick={this.props.handleSubmit}>
                      Save
                    </Button>
                  </GridItem>
                </React.Fragment>
              </Authorized.Context.Provider>
            )}
          </Authorized>
         
         
        )

    }
}

export default withStyles(styles,{ withTheme:true })(PatientReferral)