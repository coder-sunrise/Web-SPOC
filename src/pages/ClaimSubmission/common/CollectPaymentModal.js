import React, { PureComponent } from 'react'
import { connect } from 'dva'
import Yup from '@/utils/yup'
import { withStyles } from '@material-ui/core'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { IntegratedSummary } from '@devexpress/dx-react-grid'
import styles from './styles'
import {
  CommonTableGrid,
  Field,
  NumberInput,
  withFormikExtend,
  GridContainer,
  GridItem,
  FastField,
  DatePicker,
  CodeSelect,
  OutlinedTextField,
} from '@/components'
import { CollectPaymentColumns, amountProps } from './variables'

const paymentListSchema = Yup.object().shape({
  amountReceived: Yup.number().required(),
})

@connect(({ claimSubmissionApproved }) => ({
  claimSubmissionApproved,
}))
@withFormikExtend({
  name: 'claimSubmissionCollectPayment',
  mapPropsToValues: ({ claimSubmissionApproved }) => {
    return claimSubmissionApproved.entity || {}
  },
  validationSchema: Yup.object().shape({
    paymentDate: Yup.string().required(),
    paymentModeFK: Yup.number().required(),
    rows: Yup.array().of(paymentListSchema),
  }),
})
class CollectPaymentModal extends PureComponent {
  calculateSummarySubTotal = () => {
    const { values } = this.props
    const { rows } = values
    let invoiceAmountSubTotal = 0
    let claimAmountSubTotal = 0
    let approvedAmountSubTotal = 0
    let amountReceivedSubTotal = 0

    if (rows || rows.length > 0) {
      rows.map((payment) => {
        invoiceAmountSubTotal += payment.invoiceAmount
        claimAmountSubTotal += payment.claimAmount
        approvedAmountSubTotal += payment.approvedAmount
        amountReceivedSubTotal += payment.amountReceived
        return payment
      })
    }

    return {
      invoiceAmountSubTotal,
      claimAmountSubTotal,
      approvedAmountSubTotal,
      amountReceivedSubTotal,
    }
  }

  render () {
    const { classes, values, footer } = this.props
    const { rows } = values

    return (
      <React.Fragment>
        <CommonTableGrid
          className={classes.colPayTableGrid}
          rows={rows}
          columns={CollectPaymentColumns}
          columnExtensions={[
            {
              columnName: 'invoiceAmount',
              type: 'currency',
            },
            {
              columnName: 'claimAmount',
              type: 'currency',
            },
            {
              columnName: 'approvedAmount',
              type: 'currency',
            },
            {
              columnName: 'amountReceived',
              render: (row) => {
                return (
                  <Field
                    name={`rows[${row.rowIndex}].amountReceived`}
                    render={(args) => {
                      return (
                        <NumberInput label={undefined} currency {...args} />
                      )
                    }}
                  />
                )
              },
            },
          ]}
          // {...CollectPaymentTableConfig}
          FuncProps={{
            pager: true,
            summary: true,
            summaryConfig: {
              state: {
                totalItems: [],
              },
              integrated: {
                calculator: (type, r, getValue) => {
                  return IntegratedSummary.defaultCalculator(type, r, getValue)
                },
              },
              row: {
                messages: {},
                totalRowComponent: (p) => {
                  const {
                    invoiceAmountSubTotal,
                    claimAmountSubTotal,
                    approvedAmountSubTotal,
                    amountReceivedSubTotal,
                  } = this.calculateSummarySubTotal()
                  const newChildren = [
                    <Table.Cell colSpan={4} key={1}>
                      <span
                        style={{
                          float: 'right',
                          fontWeight: 'bold',
                        }}
                      >
                        Total:
                      </span>
                    </Table.Cell>,
                    <Table.Cell colSpan={1} key={1}>
                      <NumberInput
                        value={invoiceAmountSubTotal}
                        disabled
                        currency
                        {...amountProps}
                      />
                    </Table.Cell>,
                    <Table.Cell colSpan={1} key={1}>
                      <NumberInput
                        value={claimAmountSubTotal}
                        disabled
                        currency
                        {...amountProps}
                      />
                    </Table.Cell>,
                    <Table.Cell colSpan={1} key={1}>
                      <NumberInput
                        value={approvedAmountSubTotal}
                        disabled
                        currency
                        {...amountProps}
                      />
                    </Table.Cell>,
                    <Table.Cell colSpan={1} key={1}>
                      <NumberInput
                        value={amountReceivedSubTotal}
                        disabled
                        currency
                        {...amountProps}
                      />
                    </Table.Cell>,
                  ]
                  return <Table.Row>{newChildren}</Table.Row>
                },
              },
            },
          }}
        />
        <GridContainer className={classes.paymentDetails}>
          <GridItem xs={4}>
            <h4 style={{ marginTop: 20, fontWeight: 'bold' }}>
              Payment Details
            </h4>
          </GridItem>
          <GridItem xs={8} />
          <GridItem xs={4}>
            <FastField
              name='paymentDate'
              render={(args) => {
                return <DatePicker label='Payment Date' {...args} />
              }}
            />
            <FastField
              name='paymentModeFK'
              render={(args) => {
                return (
                  <CodeSelect
                    label='Payment Mode'
                    labelField='displayValue'
                    code='CTPaymentMode'
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={8} />
          <GridItem xs={4}>
            <FastField
              name='remark'
              render={(args) => {
                return (
                  <OutlinedTextField
                    label='Remarks'
                    multiline
                    rowsMax={2}
                    rows={2}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={8} />
        </GridContainer>
        {footer &&
          footer({
            onConfirm: this.props.handleSubmit,
            confirmBtnText: 'Save',
            confirmProps: {
              disabled: false,
            },
          })}
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { name: 'CollectPaymentModal' })(
  CollectPaymentModal,
)
