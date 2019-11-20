import React from 'react'
import { connect } from 'dva'
// antd
import { Skeleton } from 'antd'
import { PatientInfoSideBanner } from 'medisys-components'
// custom components
import { Card, CardBody } from '@/components'

const PatientInfoCard = ({ entity, dispatch }) => (
  <Card profile>
    <CardBody profile>
      <div style={{ minHeight: '100px' }}>
        <Skeleton
          active
          loading={
            Object.keys(entity).length === 0 ||
            entity === undefined ||
            entity === null
          }
        >
          <PatientInfoSideBanner entity={entity} />
        </Skeleton>
      </div>
    </CardBody>
  </Card>
)

export default connect(({ patient }) => ({
  entity: patient.entity || {},
}))(PatientInfoCard)
