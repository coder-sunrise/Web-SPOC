import React from 'react'
import { connect } from 'dva'
// custom components
import { Card, CardBody } from '@/components'
import { PatientInfoSideBanner } from 'medisys-components'

const PatientInfoCard = ({ entity }) => (
  <Card profile>
    <CardBody profile>
      <PatientInfoSideBanner entity={entity} />
    </CardBody>
  </Card>
)

export default connect(({ visitRegistration }) => ({
  entity: visitRegistration.patientInfo,
}))(PatientInfoCard)
