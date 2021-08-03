import { Table } from 'antd'
import numeral from 'numeral'
import { currencySymbol, currencyFormat } from '@/utils/config'
import tablestyles from './PatientHistoryStyle.less'
import DrugMixtureInfo from '@/pages/Widgets/Orders/Detail/DrugMixtureInfo'
import { Tooltip } from '@/components'
import { FileCopySharp } from '@material-ui/icons'

const wrapCellTextStyle = {
  wordWrap: 'break-word',
  whiteSpace: 'pre-wrap',
}

const drugMixtureIndicator = row => {
  if (row.type !== 'Medication' || !row.isDrugMixture) return null

  return (
    <div style={{ position: 'relative', top: 5 }}>
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
            width: 140,
            render: (text, row) => {
              return (
                <div style={{ position: 'relative' }}>
                  <div style={{
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-wrap',
                    paddingRight: row.isPreOrder ? 24 : 0
                  }}>
                    {row.isDrugMixture ? 'Drug Mixture' : row.type}
                    {drugMixtureIndicator(row)}
                    {row.isPreOrder && (
                      <Tooltip title='Pre-Order'>
                        <div
                          style={{
                            position: 'absolute',
                            top: 0,
                            right: -6,
                            borderRadius: 10,
                            backgroundColor: '#4255bd',
                            fontWeight: 500,
                            color: 'white',
                            fontSize: '0.7rem',
                            padding: '1px 3px',
                            height: 20,
                          }}
                        > Pre</div>
                      </Tooltip>
                    )}
                  </div>
                </div>
              )
            },
          },
          {
            dataIndex: 'name',
            title: 'Name',
            width: 250,
            render: (text, row) => (
              <Tooltip
                title={
                  <div>
                    {`Code/Name: ${row.code} / ${row.name}`}
                    <br />
                    {`UniPrice/UOM: ${currencySymbol}${numeral(
                      row.unitPrice,
                    ).format(currencyFormat)} / ${row.dispenseUOMDisplayValue ||
                      '-'}`}
                  </div>
                }
              >
                <div style={wrapCellTextStyle}>{text}</div>
              </Tooltip>
            ),
          },
          {
            dataIndex: 'description',
            title: 'Instructions',
            render: (text, row) => (
              <Tooltip title={row.description}>
                <div style={wrapCellTextStyle}>{text}</div>
              </Tooltip>
            ),

            width: 250,
          },
          {
            dataIndex: 'remarks',
            title: 'Remarks',
            render: (text, row) => {
              const existsDrugLabelRemarks = row.drugLabelRemarks && row.drugLabelRemarks.trim() !== ''
              return <div style={{ position: 'relative', paddingRight: existsDrugLabelRemarks ? 10 : 0 }}>
                <div
                  style={{
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-wrap',
                  }}
                >{row.remarks || ' '}</div>
                {existsDrugLabelRemarks &&
                  <div style={{
                    position: 'absolute',
                    bottom: -2,
                    right: -5,
                  }}>
                    <Tooltip title={
                      <div>
                        <div style={{ fontWeight: 500 }}>Drug Label Remarks</div>
                        <div>{row.drugLabelRemarks}
                        </div>
                      </div>
                    }>
                      <FileCopySharp style={{ color: 'blue' }} />
                    </Tooltip>
                  </div>
                }
              </div>
            },
          },
          {
            dataIndex: 'quantity',
            title: 'Qty.',
            align: 'right',
            width: 80,
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
          { dataIndex: 'dispenseUOMDisplayValue', title: 'UOM', width: 80 },
          {
            dataIndex: 'adjAmt',
            title: 'Adj.',
            width: 100,
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
            width: 100,
            align: 'right',
            render: (text, row) => (
              <div
                style={{
                  color: 'darkBlue',
                  fontWeight: 500,
                }}
              >
                {`${currencySymbol}${numeral(
                  row.isPreOrder && !row.isChargeToday
                    ? 0
                    : row.totalAfterItemAdjustment || 0,
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
