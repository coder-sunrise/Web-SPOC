import React, { Fragment, PureComponent } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core'
import Detail from './Detail'
import { PATIENT_LAB } from '@/utils/constants'
import FilterBar from './FilterBar'
import OverallGrid from './OverallGrid'
import PatientGrid from './PatientGrid'
import model from './models'
import { CommonModal } from '@/components'
import {findGetParameter} from "@/utils/utils"

window.g_app.replaceModel(model)

const styles = (theme) => ({
  gridRow: {
    marginTop: theme.spacing(1),
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    height: 'calc(100vh - 80px)',
  },
})


@connect(({ labTrackingDetails }) => ({
  labTrackingDetails,
}))
class LabTrackingDetails extends PureComponent{

  state = {
    height: 100,
  }

  componentDidMount () {
    this.resize()
    window.addEventListener('resize', this.resize.bind(this))

    const {dispatch, patientId,resultType} = this.props

    const IsOverallGrid = resultType === PATIENT_LAB.LAB_TRACKING
    let patientID = patientId || Number(findGetParameter('pid')) || undefined
    const payload = IsOverallGrid ? undefined : {
      visitFKNavigation: patientID ? {
        patientProfileFK : patientID,
      }:undefined,
      lgteql_visitDate:undefined,
      lsteql_visitDate:undefined,
      labTrackingStatusFK:undefined,
      apiCriteria:undefined,
      serviceName:undefined,
    }

    dispatch({
      type: 'labTrackingDetails/query',
      payload,
    })

  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resize.bind(this))
  }

  toggleModal = () => {
    const {labTrackingDetails} = this.props
    this.props.dispatch({
      type: 'labTrackingDetails/updateState',
      payload: {
        showModal: !labTrackingDetails.showModal,
      },
    })
  }

  resize () {
    if (this.divElement) {
      const height = this.divElement.clientHeight
      if (height > 0) {
        this.setState({ height: height > 0 ? height / 2 - 144 : 300 })
      }
    }
  }

  render () {
    const { resultType, dispatch, labTrackingDetails, patientId } = this.props
    const IsOverallGrid = resultType === PATIENT_LAB.LAB_TRACKING

    const cfg = {
      toggleModal: this.toggleModal,
    }

    return(
      <div>
        <FilterBar dispatch={dispatch} IsOverallGrid={IsOverallGrid} patientId={patientId} />
        <div style={{margin:10}}>
          {IsOverallGrid?
            (<OverallGrid
              dispatch={dispatch}
              {...cfg}
              {...this.props}
            />):(
              <PatientGrid
                dispatch={dispatch}
                {...cfg}
                {...this.props}
              />)}
        </div>
        <CommonModal
          open={labTrackingDetails.showModal}
          title='Edit Lab Tracking / Results'
          observe='LabResultsDetail'
          maxWidth='md'
          bodyNoPadding
          onClose={this.toggleModal}
          onConfirm={this.toggleModal}
        >
          <Detail {...cfg} {...this.props} mode='integrated' />
        </CommonModal>
      </div>
    )
  }
}

export default withStyles(styles,{withTheme:true})(LabTrackingDetails)