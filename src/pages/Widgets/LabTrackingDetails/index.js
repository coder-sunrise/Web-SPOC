import React, { Fragment, PureComponent } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core'
import Detail from './Detail'
import { PATIENT_LAB } from '@/utils/constants'
import FilterBar from './FilterBar'
import OverallGrid from './OverallGrid'
import PatientGrid from './PatientGrid'
import CommonModal from '@/components/CommonModal'
import model from './models'


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

@connect(({labTrackingDetails})=>{
  labTrackingDetails
})

class LabTrackingDetails extends PureComponent{

  state = {
    height: 100,
  }

  componentDidMount () {
    this.resize()
    window.addEventListener('resize', this.resize.bind(this))
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resize.bind(this))
  }


  resize () {
    if (this.divElement) {
      const height = this.divElement.clientHeight
      if (height > 0) {
        this.setState({ height: height > 0 ? height / 2 - 144 : 300 })
      }
    }
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'labTrackingDetails/updateState',
      payload: {
        showModal: !this.props.LabTrackingDetails.showModal,
      },
    })
  }

  render () {
    const { resultType, dispatch,labTrackingDetails} = this.props

    const IsOverallGrid = resultType === PATIENT_LAB.LAB_TRACKING

    const cfg = {
      toggleModal: this.toggleModal,
    }

    return(
      <div>
        <FilterBar dispatch={dispatch} />
        {IsOverallGrid?
          (<OverallGrid
            {...cfg}
            {...this.props}
          />):(
            <PatientGrid
              {...cfg}
              {...this.props}
            />)}
        {/* <CommonModal */}
        {/*  open={labTrackingDetails.showModal} */}
        {/*  title='Edit Lab Tracking / Results' */}
        {/*  observe='LabResultsDetail' */}
        {/*  maxWidth='md' */}
        {/*  bodyNoPadding */}
        {/*  onClose={this.toggleModal} */}
        {/*  onConfirm={this.toggleModal} */}
        {/* /> */}
      </div>
    )
  }
}

export default withStyles(styles,{withTheme:true})(LabTrackingDetails)
