import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { CardContainer } from '@/components'
import LabTrackingDetails from '@/pages/Widgets/LabTrackingDetails'
import { PATIENT_LAB } from '@/utils/constants'
import Authorized from '@/utils/Authorized'

const styles = theme => ({
  bigviewBtn: {
    // width: 180,
    marginRight: 0,
    minHeight: 75,
  },
  longTextBtn: {
    '& span': {
      whiteSpace: 'initial',
    },
    '& svg': {
      width: 50,
      height: 50,
    },
  },
})

class LabTracking extends React.Component {
  render() {
    const accessRight = Authorized.check('reception/labtracking')
    let disabledByAccessRight = true
    if (accessRight) disabledByAccessRight = accessRight.rights !== 'enable'

    return (
      <CardContainer hideHeader>
        <LabTrackingDetails
          resultType={PATIENT_LAB.LAB_TRACKING}
          disabledByAccessRight={disabledByAccessRight}
        />
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(LabTracking)
