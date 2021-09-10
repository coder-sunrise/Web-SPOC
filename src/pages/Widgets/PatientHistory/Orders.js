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

const drugMixtureIndicator = (row, right) => {
  if (row.type !== 'Medication' || !row.isDrugMixture) return null

  return <DrugMixtureInfo values={row.prescriptionDrugMixture} right={right} />
}

export default ({ current, classes, showDrugLabelRemark }) => {
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
              let paddingRight = 0
              if (row.isPreOrder && row.isExclusive) {
                paddingRight = 52
              } else if (row.isPreOrder || row.isExclusive) {
                paddingRight = 24
              }
              if (row.isDrugMixture) {
                paddingRight = 10
              }
              return (
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      wordWrap: 'break-word',
                      whiteSpace: 'pre-wrap',
                      paddingRight: paddingRight,
                    }}
                  >
                    {row.isDrugMixture ? 'Drug Mixture' : row.type}
                    <div style={{ position: 'relative', top: 2 }}>
                      {drugMixtureIndicator(row, -20)}
                      {row.isPreOrder && (
                        <Tooltip title='Pre-Order'>
                          <div
                            className={classes.rightIcon}
                            style={{
                              right: -27,
                              borderRadius: 10,
                              backgroundColor: '#4255bd',
                            }}
                          >
                            {' '}
                            Pre
                          </div>
                        </Tooltip>
                      )}
                      {row.isExclusive && (
                        <Tooltip title='The item has no local stock, we will purchase on behalf and charge to patient in invoice'>
                          <div
                            className={classes.rightIcon}
                            style={{
                              right: row.isPreOrder ? -60 : -30,
                              borderRadius: 4,
                              backgroundColor: 'green',
                            }}
                          >
                            Excl.
                          </div>
                        </Tooltip>
                      )}
                    </div>
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
                    {`Code: ${row.code}`}
                    <br />
                    {`Name: ${row.name}`}
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
              const existsDrugLabelRemarks =
                showDrugLabelRemark &&
                row.drugLabelRemarks &&
                row.drugLabelRemarks.trim() !== ''
              return (
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      wordWrap: 'break-word',
                      whiteSpace: 'pre-wrap',
                      paddingRight: existsDrugLabelRemarks ? 10 : 0,
                    }}
                  >
                    {row.remarks || ' '}
                  </div>
                  {existsDrugLabelRemarks && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: -2,
                        right: -8,
                      }}
                    >
                      <Tooltip
                        title={
                          <div>
                            <div style={{ fontWeight: 500 }}>
                              Drug Label Remarks
                            </div>
                            <div>{row.drugLabelRemarks}</div>
                          </div>
                        }
                      >
                        <FileCopySharp style={{ color: '#4255bd' }} />
                      </Tooltip>
                    </div>
                  )}
                </div>
              )
            },
          },
          {
            dataIndex: 'quantity',
            title: 'Qty.',
            align: 'right',
            width: 80,
            render: (text, row) => (
              <Tooltip
                title={
                  <div>{`${numeral(row.quantity || 0).format('0,0.0')}`}</div>
                }
              >
                <div
                  style={{
                    color: 'darkBlue',
                    fontWeight: 500,
                  }}
                >
                  {`${numeral(row.quantity || 0).format('0,0.0')}`}
                </div>
              </Tooltip>
            ),
          },
          {
            dataIndex: 'dispenseUOMDisplayValue',
            title: 'UOM',
            width: 80,
            render: (text, row) => (
              <Tooltip title={row.dispenseUOMDisplayValue}>
                <div style={wrapCellTextStyle}>{text}</div>
              </Tooltip>
            ),
          },
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
