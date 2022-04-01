import { Table } from 'antd'
import { Collapse } from 'antd'
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
  const { data, acknowledge } = props
  console.log(data)
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
  return (
    <div>
      <Collapse defaultActiveKey={[_.take(data)]} className='noPaddingCollapse'>
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
    </div>
  )
}
export default withStyles(styles, { name: 'LabExaminations', withTheme: true })(
  LabExaminations,
)
