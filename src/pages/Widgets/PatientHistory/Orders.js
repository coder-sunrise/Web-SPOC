import { Table } from 'antd'
import numeral from 'numeral'
import { currencySymbol } from '@/utils/config'
import tablestyles from './PatientHistoryStyle.less'
import DrugMixtureInfo from '@/pages/Widgets/Orders/Detail/DrugMixtureInfo'

const wrapCellTextStyle = {
  wordWrap: 'break-word',
  whiteSpace: 'pre-wrap',
}

const drugMixtureIndicator = (row) => {
  if (row.type !== 'Medication' || !row.isDrugMixture) return null

  return (
    <div style={{ position: 'relative', top: 2 }}>
      <DrugMixtureInfo values={row.prescriptionDrugMixture} />
    </div>
  )
}

export default ({ current }) => {
  return (
    <div style={{ marginBottom: 8, marginTop: 8 }}>
      <Table
        size='small'
        bordered
        pagination={false}
        columns={[
          {
            dataIndex: 'type',
            title: 'Type',
            width: 150,
            render: (text, row) => {
              return (
                <div style={{ position: 'relative' }}>
                  <div style={wrapCellTextStyle}>
                    {row.type}
                    {drugMixtureIndicator(row)}
                  </div>
                </div>
              )
            },
          },
          { dataIndex: 'name', title: 'Name', width: 300 },
          {
            dataIndex: 'description',
            title: 'Description',
            render: (text) => <div style={wrapCellTextStyle}>{text}</div>,
          },
          {
            dataIndex: 'quantity',
            title: 'Quantity',
            align: 'right',
            width: 90,
            render: (text, row) => (
              <div
                style={{
                  color: 'darkBlue',
                  fontWeight: 500,
                }}
              >
                {`${numeral(row.quantity || 0).format('0,0.0')}`}
              </div>
            ),
          },
          { dataIndex: 'dispenseUOMDisplayValue', title: 'UOM', width: 100 },
          {
            dataIndex: 'adjAmt',
            title: 'Adj.',
            width: 120,
            align: 'right',
            render: (text, row) => (
              <div
                style={{
                  color: 'darkBlue',
                  fontWeight: 500,
                }}
              >
                {`${currencySymbol}${numeral(row.adjAmt || 0).format(
                  '0,0.00',
                )}`}
              </div>
            ),
          },
          {
            dataIndex: 'totalAfterItemAdjustment',
            title: 'Total',
            width: 120,
            align: 'right',
            render: (text, row) => (
              <div
                style={{
                  color: 'darkBlue',
                  fontWeight: 500,
                }}
              >
                {`${currencySymbol}${numeral(
                  row.totalAfterItemAdjustment || 0,
                ).format('0,0.00')}`}
              </div>
            ),
          },
        ]}
        dataSource={current.orders || []}
        rowClassName={(record, index) => {
          return index % 2 === 0 ? tablestyles.once : tablestyles.two
        }}
        className={tablestyles.table}
      />
    </div>
  )
}
