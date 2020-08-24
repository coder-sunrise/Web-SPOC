import { Table } from 'antd'
import tablestyles from './TableStyle.less'

export default ({ current }) => {
  const { formData = {} } = current.corEyeExaminationForm
  return (
    <div>
      <Table
        size='small'
        bordered
        pagination={false}
        columns={[
          {
            dataIndex: 'RightEye',
            title: 'Right Eye',
            align: 'center',
          },
          {
            dataIndex: 'EyeExaminationType',
            title: ' ',
            align: 'center',
          },
          {
            dataIndex: 'LeftEye',
            title: 'Left Eye',
            align: 'center',
          },
        ]}
        dataSource={formData.EyeExaminations || []}
        rowClassName={(record, index) => {
          return index % 2 === 0 ? tablestyles.once : tablestyles.two
        }}
        className={tablestyles.table}
      />
    </div>
  )
}
