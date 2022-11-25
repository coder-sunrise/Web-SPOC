import { Table } from 'antd'
import { GridContainer, GridItem } from '@/components'
import tablestyles from '../PatientHistoryStyle.less'
export default ({ formContent, classes }) => {
  return (
    <GridContainer>
      <GridItem md={12}>
        <span style={{ fontSize: '1.1rem', fontWeight: 500, marginRight: 8 }}>
          Investigative Tests
        </span>
      </GridItem>
      <GridItem md={12} container>
        <Table
          size='small'
          bordered
          pagination={false}
          columns={[
            {
              dataIndex: 'sequence',
              title: 'S/N',
              align: 'center',
              width: 90,
            },
            {
              dataIndex: 'typeOfTest',
              title: 'Type Of Test',
              width: '30%',
            },
            {
              dataIndex: 'findings',
              title: 'Findings',
            },
          ]}
          dataSource={formContent.corInvestigativeTests_Item || []}
          rowClassName={(record, index) => {
            return index % 2 === 0 ? tablestyles.once : tablestyles.two
          }}
          className={tablestyles.table}
        />
      </GridItem>
    </GridContainer>
  )
}
