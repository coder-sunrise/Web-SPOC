import { Collapse, Empty, Table } from 'antd'
import { useState, useEffect } from 'react'
import { ResultTable } from './ResultTable'
import { OrderDetailsTable } from './OrderDetailsTable'
import { SpecimenTable } from './SpecimenTable'
import { VisitTypeTag } from '@/components/_medisys'
import { SpecimenStatusTag } from '@/pages/Lab/Worklist/components/SpecimenStatusTag'
import _ from 'lodash'
import { withStyles } from '@material-ui/core/styles'
import moment from 'moment'
import { notification } from '@/components'
import { useDispatch } from 'react-redux'
const { Panel } = Collapse

const styles = theme => ({})
export const LabExaminations = props => {
  const { data, activeKey, examinationPanelOnChange, acknowledge } = props
  const dispatch = useDispatch()
  const genExtra = lab => (
    <div>
      Visit Date:{' '}
      <span
        style={{
          display: 'inline-block',
          marginLeft: 5,
          marginRight: 10,
        }}
      >
        {moment(lab.visitDate).format('DD MMM YYYY')}
      </span>
      <VisitTypeTag type={lab.visitTypeFK}></VisitTypeTag>
      <SpecimenStatusTag statusId={lab.status}></SpecimenStatusTag>
    </div>
  )
  const changed = key => {
    if (examinationPanelOnChange) {
      examinationPanelOnChange(key)
    }
  }
  const hasData = data && data.length > 0
  return (
    <div>
      {hasData && (
        <Collapse
          onChange={changed}
          activeKey={activeKey}
          className='noPaddingCollapse'
        >
          {data.map(lab => {
            return (
              <Panel header={lab.testPanels} key={lab.id} extra={genExtra(lab)}>
                <ResultTable data={lab} acknowledge={acknowledge}></ResultTable>
                <OrderDetailsTable data={lab}></OrderDetailsTable>
                <SpecimenTable data={lab}></SpecimenTable>
              </Panel>
            )
          })}
        </Collapse>
      )}
      {!hasData && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
    </div>
  )
}
export default withStyles(styles, { name: 'LabExaminations', withTheme: true })(
  LabExaminations,
)
