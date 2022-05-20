import { Table } from 'antd'
import numeral from 'numeral'
import { currencySymbol } from '@/utils/config'
import { GridContainer, GridItem, Tooltip } from '@/components'
import AmountSummary from '@/pages/Widgets/PatientHistory/AmountSummary'
const showMoney = (v = 0) => {
  if (v < 0)
    return (
      <span
        style={{ fontWeight: 'bold', color: 'red' }}
      >{`(${currencySymbol}${numeral(v * -1.0).format('0.00')})`}</span>
    )
  return (
    <span
      style={{ fontWeight: 'bold', color: 'darkblue' }}
    >{`${currencySymbol}${numeral(v).format('0.00')}`}</span>
  )
}
const InvoicePaymentDetails = ({ invoice = {} }) => {
  const { invoiceNo, invoiceItems = [], invoiceAdjustments = [] } = invoice
  return (
    <GridContainer hideHeader>
      <GridItem md={12}>
        <h4>Invoice Summary: {invoiceNo}</h4>
      </GridItem>
      <GridItem md={12}>
        <Table
          size='small'
          bordered
          pagination={false}
          dataSource={invoiceItems.map(item => ({
            ...item,
            outstanding: item.totalAfterGst - item.totalClaim - item.paidAmount,
          }))}
          columns={[
            {
              dataIndex: 'itemType',
              title: 'Category ',
              width: 130,
            },
            {
              dataIndex: 'itemDescription',
              title: 'Name',
            },
            {
              dataIndex: 'quantity',
              title: 'Qty.',
              align: 'right',
              width: 80,
              render: (_, row) => {
                const qty = numeral(row.quantity).format('0.0')
                return (
                  <Tooltip title={qty}>
                    <span>{qty}</span>
                  </Tooltip>
                )
              },
            },
            {
              dataIndex: 'uom',
              title: 'UOM',
              width: 100,
            },
            {
              dataIndex: 'subTotal',
              title: 'Sub Total',
              align: 'right',
              width: 110,
              render: (_, row) => {
                return showMoney(row.subTotal)
              },
            },
            {
              dataIndex: 'adjAmt',
              title: 'Adj.',
              align: 'right',
              width: 80,
              render: (_, row) => {
                return showMoney(row.adjAmt)
              },
            },
            {
              dataIndex: 'gstAmount',
              title: 'GST',
              align: 'right',
              width: 80,
              render: (_, row) => {
                return showMoney(row.gstAmount)
              },
            },
            {
              dataIndex: 'totalAfterGst',
              title: 'Total',
              align: 'right',
              width: 110,
              render: (_, row) => {
                return showMoney(row.totalAfterGst)
              },
            },
            {
              dataIndex: 'totalClaim',
              title: 'Co-Payer O/S',
              align: 'right',
              width: 110,
              render: (_, row) => {
                return showMoney(row.totalClaim)
              },
            },
            {
              dataIndex: 'outstanding',
              title: 'Patient O/S',
              align: 'right',
              width: 110,
              render: (_, row) => {
                return showMoney(row.outstanding)
              },
            },
            {
              dataIndex: 'paidAmount',
              title: 'Paid Amt.',
              align: 'right',
              width: 110,
              render: (_, row) => {
                return showMoney(row.paidAmount)
              },
            },
            {
              dataIndex: 'receiptNo',
              title: 'Receipt No.',
              width: 180,
              render: (_, row) => {
                return (
                  <div>
                    {(row.invoiceItemPayments || []).map(payment => {
                      return (
                        <div>
                          <span>{payment.receiptNo}</span>&nbsp;&nbsp;
                          <span>{showMoney(payment.paidAmount)}</span>
                        </div>
                      )
                    })}
                  </div>
                )
              },
            },
            {
              dataIndex: 'status',
              title: 'Status',
              width: 80,
              render: (_, row) => {
                let status = 'Paid'
                if (row.outstanding > 0) {
                  status = 'Outstanding'
                } else if (row.outstanding < 0) {
                  status = 'Overpaid'
                }
                return <span>{status}</span>
              },
            },
          ]}
        ></Table>
      </GridItem>
      <GridItem md={7} />
      <GridItem md={5}>
        <div style={{ paddingRight: 90, marginTop: 8 }}>
          <AmountSummary
            adjustments={invoiceAdjustments}
            invoice={{
              invoiceTotal: invoice.total,
              invoiceTotalAftGST: invoice.totalAftGst,
              invoiceGSTAmt: invoice.gstAmount,
              isGSTInclusive: invoice.isGstInclusive,
              gstValue: invoice.gstValue,
            }}
          />
        </div>
      </GridItem>
    </GridContainer>
  )
}
export default InvoicePaymentDetails
