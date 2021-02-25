import React, {Component} from 'react'
import { withStyles } from '@material-ui/core'
import { GridContainer,CardContainer,withFormikExtend,GridItem,Button } from '@/components'
import { connect } from 'dva'
import Authorized from '@/utils/Authorized'
import ReferralGrid from './ReferralGrid'

const styles = () =>({})

@connect(({ patientHistory, clinicSettings, codetable, user }) => ({
  patientHistory,
  clinicSettings,
  codetable,
  user,
}))
@withFormikExtend({
  mapPropsToValues: ({ patientHistory = {} }) => {
    return {rows : patientHistory.PatientReferralHistory.entity.data}
  },

handleSubmit: async (values,{props}) => {
  const {patientHistory,dispatch} = props
  const response = await dispatch({
    type: 'patientHistory/saveReferralHistory',
    payload: { 
      id: patientHistory.patientID,
      referralPersonHistory: values.rows,
     
     },
  })
},
})

class PatientReferral extends Component {
  constructor (props) {
    super(props)

    this.myRef = React.createRef()
    this.state = {}
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
                        {...this.props}
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