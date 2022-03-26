import React, { PureComponent } from 'react'
import { connect } from 'dva'
import Authorized from '@/utils/Authorized'
import { withStyles } from '@material-ui/core/styles'
import { Tooltip, Button, CommonModal, Tabs } from '@/components'
import BasicData from './BasicData'
import Examinations from './Examinations'
import ExternalTracking from './ExternalTracking'
import LabResults from './LabResults'

const patientResultTabs = props => {
  const viewExaminationsRight = Authorized.check(
    'patientdatabase.patientprofiledetails.patientresults.viewexaminations',
  ) || { rights: 'hidden' }
  const viewBasiceDataRight = Authorized.check(
    'patientdatabase.patientprofiledetails.patientresults.viewbasicdata',
  ) || { rights: 'hidden' }
  const viewLabResultsRight = Authorized.check(
    'patientdatabase.patientprofiledetails.patientresults.viewlabresults',
  ) || { rights: 'hidden' }
  const viewExternalTrackingRight = Authorized.check(
    'patientdatabase.patientprofiledetails.patientresults.viewexternaltracking',
  ) || { rights: 'hidden' }

  let options = []
  if (viewExaminationsRight.rights === 'enable') {
    options.push({
      name: <span>Examinations</span>,
      content: <Examinations {...props} />,
    })
  }
  if (viewBasiceDataRight.rights === 'enable') {
    options.push({
      name: <span>Basic Data</span>,
      content: <BasicData {...props} height={props.height - 220} />,
    })
  }
  if (viewLabResultsRight.rights === 'enable') {
    options.push({
      name: <span>Lab Results</span>,
      content: <LabResults {...props} />,
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
    const { theme } = this.props
    return (
      <div style={{ minHeight: 500 }}>
        <Tabs
          style={{ marginTop: theme.spacing(1) }}
          options={patientResultTabs(this.props)}
        />
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })(PatientResult)
