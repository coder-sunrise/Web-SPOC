import tablestyles from '../../PatientHistory/PatientHistoryStyle.less'
import React from 'react'
import {
  GridContainer,
  GridItem,
  MultipleTextField,
  RadioGroup,
} from '@/components'
import { Table } from 'antd'

export default props => {
  const { formContent, classes } = props
  return (
    <GridContainer style={{ marginTop: 8 }}>
      <GridItem md={12}>
        <span style={{ fontWeight: 500, fontSize: '1rem', marginRight: 8 }}>
          Assessment & Plan
        </span>
      </GridItem>
      <GridItem md={12} style={{ marginTop: 4 }}>
        <Table
          size='small'
          bordered
          pagination={false}
          columns={[
            {
              dataIndex: 'sequence',
              title: 'S/N',
              width: 60,
            },
            {
              dataIndex: 'assessment',
              title: 'Assessment',
            },
            {
              dataIndex: 'managementPlan',
              title: 'Plan',
            },
          ]}
          dataSource={formContent.corManagement_Item || []}
          rowClassName={(record, index) => {
            return index % 2 === 0 ? tablestyles.once : tablestyles.two
          }}
          className={tablestyles.table}
        />
      </GridItem>
      <GridItem md={12} style={{ marginTop: 10 }}>
        <span style={{ fontWeight: 500, fontSize: '1rem', marginRight: 8 }}>
          Referral Timeline (If applicable)
        </span>
      </GridItem>
      <GridItem md={12} style={{ marginTop: 5 }}>
        <RadioGroup
          valueField='code'
          textField='description'
          disabled
          value={formContent.referralTimeline}
          options={[
            {
              code: 'NonUrgent',
              description: 'Non-Urgent (Within 2-4 weeks)',
            },
            {
              code: 'Early',
              description: 'Early (Within 2 weeks)',
            },
            {
              code: 'UrgentReferral',
              description: 'Urgent referral (same day)',
            },
            {
              code: 'Immediate',
              description: 'Immediate (A&E)',
            },
          ]}
          noUnderline
        />
      </GridItem>
      <GridItem md={12} style={{ marginTop: 10 }}>
        <span style={{ fontWeight: 500, fontSize: '1rem', marginRight: 8 }}>
          Follow Up Action & Next Review
        </span>
      </GridItem>
      <GridItem md={12}>
        <div className={classes.textWithBorder} style={{ minHeight: 84 }}>
          {formContent.followUpActionAndNextPreview}
        </div>
      </GridItem>
    </GridContainer>
  )
}
