import React, { PureComponent } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { withStyles } from '@material-ui/core'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { IntegratedSummary } from '@devexpress/dx-react-grid'
import Yup from '@/utils/yup'
import styles from './styles'
import {
  CommonTableGrid,
  SizeContainer,
  NumberInput,
  withFormikExtend,
  GridContainer,
  GridItem,
  FastField,
  DatePicker,
  CodeSelect,
  OutlinedTextField,
  Field,
  Select,
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
    creditCardTypeFK: Yup.number().when('paymentModeFK', {
      is: (val) => val === 1,
      then: Yup.number().required(),
    }),
  }),
  handleSubmit: (values, { props }) => {
    const { dispatch } = props
    const { rows, ...restValues } = values

    const payload = {
      ...values,
    }
    dispatch({
      type: 'claimSubmissionApproved/submitInvoicePayment',
      payload,
    })
  },
})
class CollectPaymentModal extends PureComponent {
  state = { isCardPayment: false }

  componentDidMount () {
    this.getBizList(moment().formatUTC('YYMMDD'))
  }

  calculateSummarySubTotal = () => {
    const { values, setFieldValue } = this.props
    const { rows } = values
    let invoiceAmountSubTotal = 0
    let claimAmountSubTotal = 0
    let approvedAmountSubTotal = 0
    let collectedPayment = 0
    let amountReceivedSubTotal = 0

    if (rows || rows.length > 0) {
      rows.map((payment) => {
        invoiceAmountSubTotal += payment.invoiceAmount || 0
        claimAmountSubTotal += payment.claimAmount || 0
        approvedAmountSubTotal += payment.approvedAmount || 0
        collectedPayment += payment.collectedPayment || 0
        amountReceivedSubTotal += payment.amountReceived || 0
        return payment
      })
    }
    setTimeout(() => setFieldValue('totalAmtPaid', amountReceivedSubTotal), 100)

    return {
      invoiceAmountSubTotal,
      claimAmountSubTotal,
      approvedAmountSubTotal,
      collectedPayment,
      amountReceivedSubTotal,
    }
  }

  onChangePaymentMode = (event) => {
    const { setFieldValue } = this.props
    const selectedValue = event || ''

    if (selectedValue === 1) {
      this.setState({ isCardPayment: true })
      setFieldValue('creditCardTypeFK', 1)
    } else {
      this.setState({ isCardPayment: false })
      setFieldValue('creditCardTypeFK', undefined)
    }
  }

  getBizList = (e) => {
    const { dispatch, setFieldValue } = this.props
    dispatch({
      type: 'claimSubmissionApproved/getAllBizSession',
      payload: {
        sessionNoPrefix: e,
        pagesize: 999999,
      },
    }).then(() => {
      const { bizSessionList } = this.props.claimSubmissionApproved
      setFieldValue(
        'paymentCreatedBizSessionFK',
        bizSessionList.length === 0 || bizSessionList === undefined
          ? undefined
          : bizSessionList[0].value, // bizSessionList.slice(-1)[0].value,
      )
    })
  }

  onChangeDate = (event) => {
    const { isDeposit } = this.props
    const selectedDate = moment(event).format('YYMMDD')

    if (isDeposit && selectedDate === moment().format('YYMMDD')) {
      this.setState({ isSessionRequired: false })
    } else {
      this.setState({ isSessionRequired: true })
      this.getBizList(selectedDate)
    }
  }

  render () {
    const { classes, values, footer, claimSubmissionApproved } = this.props
    const { bizSessionList } = claimSubmissionApproved
    const { rows } = values

    return (
      <React.Fragment>
        <GridContainer>
          <CommonTableGrid
            size='sm'
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
                columnName: 'collectedPayment',
                type: 'currency',
              },
              {
                columnName: 'amountReceived',
                render: (row) => {
                  return (
                    <SizeContainer size='sm'>
                      <FastField
                        name={`rows[${row.rowIndex}].amountReceived`}
                        render={(args) => {
                          return (
                            <NumberInput
                              size='sm'
                              label={undefined}
                              currency
                              {...args}
                            />
                          )
                        }}
                      />
                    </SizeContainer>
                  )
                },
              },
            ]}
            // {...CollectPaymentTableConfig}
            FuncProps={{
              pager: false,
              summary: true,
              summaryConfig: {
                state: {
                  totalItems: [],
                },
                integrated: {
                  calculator: (type, r, getValue) => {
                    return IntegratedSummary.defaultCalculator(
                      type,
                      r,
                      getValue,
                    )
                  },
                },
                row: {
                  messages: {},
                  totalRowComponent: (p) => {
                    const {
                      invoiceAmountSubTotal,
                      claimAmountSubTotal,
                      approvedAmountSubTotal,
                      collectedPayment,
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
                          text
                          currency
                          {...amountProps}
                        />
                      </Table.Cell>,
                      <Table.Cell colSpan={1} key={1}>
                        <NumberInput
                          value={claimAmountSubTotal}
                          text
                          currency
                          {...amountProps}
                        />
                      </Table.Cell>,
                      <Table.Cell colSpan={1} key={1}>
                        <NumberInput
                          value={approvedAmountSubTotal}
                          text
                          currency
                          {...amountProps}
                        />
                      </Table.Cell>,
                      <Table.Cell colSpan={1} key={1}>
                        <NumberInput
                          value={collectedPayment}
                          text
                          currency
                          {...amountProps}
                        />
                      </Table.Cell>,
                      <Table.Cell colSpan={1} key={1}>
                        {/* <NumberInput
                          value={amountReceivedSubTotal}
                          disabled
                          currency
                          {...amountProps}
                        /> */}
                        <FastField
                          name='totalAmtPaid'
                          render={(args) => {
                            return (
                              <NumberInput
                                text
                                label={undefined}
                                currency
                                {...args}
                              />
                            )
                          }}
                        />
                      </Table.Cell>,
                    ]
                    return <Table.Row>{newChildren}</Table.Row>
                  },
                },
              },
            }}
          />
        </GridContainer>
        <GridContainer className={classes.paymentDetails}>
          <GridItem direction='column' xs={12}>
            <GridItem xs={4}>
              <h4 style={{ marginTop: 20, fontWeight: 'bold' }}>
                Payment Details
              </h4>
            </GridItem>
            <GridItem xs={4}>
              <FastField
                name='paymentDate'
                render={(args) => {
                  return (
                    <DatePicker
                      label='Payment Date'
                      timeFomat={false}
                      onChange={this.onChangeDate}
                      disabledDate={(d) => !d || d.isAfter(moment())}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={4}>
              <Field
                name='paymentCreatedBizSessionFK'
                render={(args) => (
                  <Select label='Session' options={bizSessionList} {...args} />
                )}
              />
            </GridItem>
            <GridItem xs={4}>
              <FastField
                name='paymentModeFK'
                render={(args) => {
                  return (
                    <CodeSelect
                      label='Payment Mode'
                      labelField='displayValue'
                      code='CTPaymentMode'
                      onChange={(e) => this.onChangePaymentMode(e)}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            {this.state.isCardPayment && (
              <GridItem xs={4}>
                <FastField
                  name='creditCardTypeFK'
                  render={(args) => (
                    <CodeSelect
                      label='Card Type'
                      code='ctCreditCardType'
                      {...args}
                    />
                  )}
                />
              </GridItem>
            )}
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
          </GridItem>
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
