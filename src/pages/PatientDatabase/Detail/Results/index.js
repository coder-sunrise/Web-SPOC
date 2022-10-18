import React, { PureComponent } from 'react'
import { connect } from 'dva'
import Authorized from '@/utils/Authorized'
import { withStyles } from '@material-ui/core/styles'
import { Tooltip, Button, CommonModal, Tabs } from '@/components'
import BasicData from './BasicData'
import ExternalTracking from './ExternalTracking'

const patientResultTabs = props => {
  const viewBasiceDataRight = Authorized.check(
    'patientdatabase.patientprofiledetails.patientresults.viewbasicdata',
  ) || { rights: 'hidden' }
  const viewExternalTrackingRight = Authorized.check(
    'patientdatabase.patientprofiledetails.patientresults.viewexternaltracking',
  ) || { rights: 'hidden' }

  let options = []
  if (viewBasiceDataRight.rights === 'enable') {
    options.push({
      name: <span>Basic Data</span>,
      content: <BasicData {...props} height={props.height - 220} />,
    })
  }
  if (viewExternalTrackingRight.rights === 'enable') {
    options.push({
      name: <span>External Tracking</span>,
      content: <ExternalTracking {...props} />,
    })
  }
  return options.map((item, index) => ({ ...item, id: index }))
}

const styles = () => ({})

@connect(({ clinicSettings }) => ({ clinicSettings }))
class PatientResult extends PureComponent {
  render() {
    const { theme, defaultActiveKey } = this.props
    const options = patientResultTabs(this.props)
    const activeKey = options.length > 1 ? '1' : '0'
    return (
      <div style={{ minHeight: 500, height: '100%' }} className='fullHeightTab'>
        <Tabs defaultActiveKey={defaultActiveKey} options={options} />
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })(PatientResult)
