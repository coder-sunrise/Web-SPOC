import React, { PureComponent } from 'react'
import { connect } from 'dva'
import withStyles from '@material-ui/core/styles/withStyles'
import _ from 'lodash'
import { SizeContainer } from '@/components'
import ReferralLetter from './ReferralLetter'
import Memo from './Memo'
import MedicalCertificate from './MedicalCertificate'
import CertificateAttendance from './CertificateAttendance'
import Others from './Others'
import SpectaclePrescription from './SpectaclePrescription'
import SpectacleOrderForm from './SpectacleOrderForm'
import ContactLensPrescription from './ContactLensPrescription'
import ContactLensOrderForm from './ContactLensOrderForm'
import MedicalReport from './MedicalReport'

const styles = theme => ({})
@connect(
  ({ consultationDocument, user, codetable, visitRegistration, patient }) => ({
    consultationDocument,
    user,
    codetable,
    visitEntity: visitRegistration.entity || {},
    patient,
  }),
)
class AddConsultationDocument extends PureComponent {
  constructor(props) {
    super(props)
  }

  getNextSequence = () => {
    const {
      consultationDocument: { rows, type },
    } = this.props
    const allDocs = rows.filter(s => !s.isDeleted)
    let nextSequence = 1
    if (allDocs && allDocs.length > 0) {
      const { sequence } = _.maxBy(allDocs, 'sequence')
      nextSequence = sequence + 1
    }
    return nextSequence
  }
  render() {
    const { consultationDocument } = this.props
    const { type } = consultationDocument
    const cfg = {
      ...this.props,
      getNextSequence: this.getNextSequence,
    }

    return (
      <div style={{ margin: '0px 8px' }}>
        {type === '1' && <SpectaclePrescription {...cfg} />}
        {type === '2' && <SpectacleOrderForm {...cfg} />}
        {type === '3' && <ContactLensPrescription {...cfg} />}
        {type === '4' && <ContactLensOrderForm {...cfg} />}
        {type === '5' && <ReferralLetter {...cfg} />}
        {type === '6' && <MedicalReport {...cfg} />}
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })(props => (
  <SizeContainer size='sm'>
    {extraProps => {
      return <AddConsultationDocument {...props} {...extraProps} />
    }}
  </SizeContainer>
))
