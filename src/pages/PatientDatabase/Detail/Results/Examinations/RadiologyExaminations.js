import ReactHtmlParser from 'react-html-parser'
import { Descriptions } from 'antd'
import { VisitTypeTag } from '@/components/_medisys'
import _ from 'lodash'
import { Collapse } from 'antd'
import { withStyles } from '@material-ui/core/styles'
import { RadiologyStatusTag } from '@/pages/Radiology/Components/RadiologyStatusTag'
import moment from 'moment'
const { Panel } = Collapse
const styles = theme => ({})
const RadiologyExaminations = props => {
  const { data } = props
  const genExtra = radiology => (
    <div>
      Visit Date:{' '}
      <span
        style={{
          display: 'inline-block',
          marginLeft: 5,
          marginRight: 10,
        }}
      >
        {moment(radiology.visitDate).format('DD MMM YYYY')}
      </span>
      <VisitTypeTag type={radiology.visitTypeFK}></VisitTypeTag>
      <RadiologyStatusTag statusId={radiology.status}></RadiologyStatusTag>
    </div>
  )
  return (
    <div>
      <Collapse defaultActiveKey={[_.take(data)]} className='noPaddingCollapse'>
        {data.map(radiology => {
          return (
            <Panel
              header={radiology.name}
              key={radiology.id}
              extra={genExtra(radiology)}
            >
              <Descriptions
                bordered
                size='small'
                className='radiologyDescription'
              >
                <Descriptions.Item
                  label='Techonologist:'
                  labelStyle={{ width: 190 }}
                  span={3}
                >
                  {radiology.technologist ?? '-'}
                </Descriptions.Item>
                <Descriptions.Item label='Accession No.'>
                  {radiology.accesionNo ?? '-'}
                </Descriptions.Item>
                <Descriptions.Item
                  label='Order Created Date:'
                  labelStyle={{ width: 180 }}
                  contentStyle={{ width: 400 }}
                >
                  {moment(radiology.orderDate).format('DD MMM YYYY HH:mm')}
                </Descriptions.Item>
                <Descriptions.Item
                  label='Modality:'
                  labelStyle={{ width: 150 }}
                  contentStyle={{ width: 400 }}
                >
                  {radiology.modality ?? '-'}
                </Descriptions.Item>
                <Descriptions.Item label='Priority:'>
                  {radiology.priority ?? '-'}
                </Descriptions.Item>
                <Descriptions.Item label='Doctor Instructions:'>
                  {radiology.doctorInstruction ?? '-'}
                </Descriptions.Item>
                <Descriptions.Item label='Doctor Remarks:'>
                  {radiology.doctorRemarks ?? '-'}
                </Descriptions.Item>
                <Descriptions.Item label='Radiographer Comment:' span={3}>
                  {radiology.radiographerComment ?? '-'}
                </Descriptions.Item>
                <Descriptions.Item label='Findings:' span={3}>
                  {ReactHtmlParser(radiology.findings ?? '-')}
                </Descriptions.Item>
              </Descriptions>
            </Panel>
          )
        })}
      </Collapse>
    </div>
  )
}
export default withStyles(styles, {
  name: 'RadiologyExaminations',
  withTheme: true,
})(RadiologyExaminations)
