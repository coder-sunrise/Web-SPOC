import React, { PureComponent } from 'react'
import { FastField } from 'formik'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { withStyles } from '@material-ui/core'
import Search from '@material-ui/icons/Search'
import { connect } from 'dva'
import Yup from '@/utils/yup'
import { navigateDirtyCheck } from '@/utils/utils'
import {
  Button,
  DatePicker,
  GridContainer,
  GridItem,
  NumberInput,
  TextField,
  CardContainer,
  Switch,
  DateRangePicker,
  Field,
  CommonTableGrid,
  dateFormatLong,
  CodeSelect,
  withFormikExtend,
  ProgressButton,
} from '@/components'

const styles = () => ({
  root: { padding: '10px' },
  invoicesList: {
    marginTop: '10px',
    marginBottom: '15px',
  },
  searchBtn: {
    paddingTop: '10px !important',
  },
  header: {
    fontWeight: 400,
  },
})

@connect(({ statement }) => ({
  statement,
}))
@withFormikExtend({
  enableReinitialize: true,
  mapPropsToValues: ({ statement }) => {
    const returnValue = statement.entity || statement.default
    const adminChargeValueType =
      returnValue.adminChargeValueType || 'Percentage'
    return {
      ...returnValue,
      adminChargeValueType,
    }
  },
  validationSchema: Yup.object().shape({
    copayerFK: Yup.number().required(),
    statementDate: Yup.date().required(),
    paymentTerm: Yup.number().required(),
  }),

  handleSubmit: (values, { props, resetForm }) => {
    const {
      effectiveDates,
      statementInvoice,
      invoiceRows,
      selectedRows,
      ...restValues
    } = values
    const { dispatch, history } = props

    // filter out unselected new invoice
    const selectedAndExistingInvoices = invoiceRows.filter(
      (o) => selectedRows.includes(o.id) || o.statementInvoicePayment,
    )

    const newStatementInvoice = selectedAndExistingInvoices.map((o) => {
      const statementInvoiceObj = {
        ...o,
        invoiceFK: o.invoiceFK || o.id,
        id: o.statementInvoicePayment ? o.id : undefined,
        invoicePayerFK: o.copayerInvoicePayerId || o.invoicePayerFK,
        payableAmount: o.copayerPayableAmount || o.payableAmount,
        outstandingAmount: o.copayerOutstanding || o.outstandingAmount,
        invoiceAmt: o.copayerPayableAmount || o.invoiceAmt,
      }

      // check if the invoice is selected && is the invoice has existing payment
      if (
        selectedRows.includes(o.id) ||
        o.statementInvoicePayment.find(
          (i) => i.invoicePayment.isCancelled === false,
        )
      ) {
        return {
          ...statementInvoiceObj,
        }
      }
      return {
        ...statementInvoiceObj,
        isDeleted: true,
      }
    })

    dispatch({
      type: 'statement/upsert',
      payload: {
        ...restValues,
        statementInvoice: newStatementInvoice,
      },
    }).then((r) => {
      if (r) {
        resetForm()
        // history.push('/finance/statement')
        history.goBack()
      }
    })
  },
  displayName: 'statementDetails',
})
class AddNewStatement extends PureComponent {
  state = {
    columns: [
      { name: 'invoiceNo', title: 'Invoice No' },
      { name: 'invoiceDate', title: 'Invoice Date' },
      { name: 'patientName', title: 'Patient Name' },
      {
        name: this.props.statement.entity
          ? 'payableAmount'
          : 'copayerPayableAmount',
        title: 'Payable Amount',
      },
      {
        name: this.props.statement.entity
          ? 'outstandingAmount'
          : 'copayerOutstanding',
        title: 'Outstanding Amount',
      },
      { name: 'remark', title: 'Remarks' },
    ],
    columnExtensions: [
      {
        columnName: 'invoiceNo',
        sortingEnabled: false,
      },
      {
        columnName: 'patientName',
        sortingEnabled: false,
      },
      {
        columnName: 'remark',
        sortingEnabled: false,
      },
      {
        columnName: this.props.statement.entity
          ? 'payableAmount'
          : 'copayerPayableAmount',
        type: 'number',
        currency: true,
        sortingEnabled: false,
      },
      {
        columnName: this.props.statement.entity
          ? 'outstandingAmount'
          : 'copayerOutstanding',
        type: 'number',
        currency: true,
        sortingEnabled: false,
      },
      {
        columnName: 'invoiceDate',
        type: 'date',
        format: dateFormatLong,
        sortingEnabled: false,
      },
    ],
    // currencyColumns: [
    //   'amount',
    //   'outstandingBalance',
    // ],
    // dateColumns: [
    //   'invoiceDate',
    // ],
    invoiceRows: [
      // {
      //   id: 'PT-000001A',
      //   invoiceNo: 'IV-000001',
      //   invoiceDate: moment()
      //     .add(Math.ceil(Math.random() * 100) - 100, 'days')
      //     .format('LLL'),
      //   patientName: 'Patient 01',
      //   amount: 100,
      //   outstandingBalance: 100,
      // },
    ],
    selectedRows: [],
  }

  componentDidMount () {
    const { values, setValues } = this.props
    this.setState({
      invoiceRows: values.statementInvoice,
    })
    let defaultIds = []
    values.statementInvoice.forEach((o) => {
      if (
        (o.statementInvoicePayment.length === 0 && !o.isDeleted) ||
        o.statementInvoicePayment.find(
          (i) => i.invoicePayment.isCancelled === true,
        ) ||
        o.payableAmount === o.outstandingAmount
      ) {
        defaultIds.push(o.id)
      }
    })

    this.setState({
      selectedRows: defaultIds,
    })
    setValues({
      ...values,
      selectedRows: defaultIds,
      invoiceRows: values.statementInvoice,
    })
  }

  handleSelectionChange = (rows) => {
    const { setValues, values } = this.props
    if (rows) {
      setValues({
        ...values,
        selectedRows: rows,
      })
    }
    this.setState({ selectedRows: rows })
  }

  getInvoiceList = (e) => {
    const { dispatch, values, statement, setValues } = this.props
    const { InvoiceNo, effectiveDates, copayerFK } = values

    const payload = {
      'invoicePayer.CompanyFK': e || copayerFK,
      invoiceNo: InvoiceNo,
      lgteql_invoiceDate: effectiveDates ? effectiveDates[0] : undefined,
      lsteql_invoiceDate: effectiveDates ? effectiveDates[1] : undefined,
    }

    dispatch({
      type: 'statement/queryInvoiceList',
      payload,
    }).then((invoiceList) => {
      if (invoiceList) {
        const { data } = invoiceList.data
        const newData = data.map((o) => {
          return {
            ...o,
            payableAmount: o.copayerPayableAmount,
            outstandingAmount: o.copayerOutstanding,
          }
        })

        let statementInvoices = []
        if (statement.entity) {
          statementInvoices = [
            ...values.statementInvoice,
            ...newData,
          ]
        } else {
          statementInvoices = data
        }

        this.setState(() => {
          return {
            invoiceRows: statementInvoices,
          }
        })

        setValues({
          ...values,
          invoiceRows: statementInvoices,
        })
      }
    })
  }

  goBackToPreviousPage = () => {
    const { history, resetForm } = this.props
    resetForm()
    history.goBack()
  }

  clearInvoiceList = (e, op) => {
    const { setFieldValue } = this.props
    const { adminCharge, adminChargeType } = op
    setFieldValue('adminChargeValue', adminCharge)
    setFieldValue('adminChargeValueType', adminChargeType)
    this.setState(() => {
      return {
        invoiceRows: [],
        selectedRows: [],
      }
    })
  }

  render () {
    const { classes, theme, values, handleSubmit, statement } = this.props
    const { invoiceRows, columns, columnExtensions } = this.state
    const { entity } = statement
    const mode = entity && entity.id > 0 ? 'Edit' : 'Add'

    // console.log('values', values)
    // console.log('props', this.props)
    return (
      <React.Fragment>
        <CardContainer hideHeader>
          <GridContainer>
            <GridContainer>
              <GridItem md={3}>
                <FastField
                  name='copayerFK'
                  render={(args) => {
                    return (
                      <CodeSelect
                        label='Co-Payer'
                        code='ctcopayer'
                        labelField='displayValue'
                        localFilter={(item) => item.coPayerTypeFK === 1}
                        disabled={statement.entity}
                        onChange={(e, op = {}) => this.clearInvoiceList(e, op)}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
            </GridContainer>

            <GridItem md={3}>
              <FastField
                name='statementDate'
                render={(args) => (
                  <DatePicker label='Statement Date' {...args} />
                )}
              />
            </GridItem>

            <GridItem md={3}>
              <FastField
                name='paymentTerm'
                render={(args) => (
                  <NumberInput
                    suffix='Days'
                    qty
                    label={formatMessage({
                      id: 'finance.statement.paymentTerms',
                    })}
                    precision={0}
                    max={999}
                    min={0}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridContainer>
              <GridItem md={3}>
                <Field
                  name='adminChargeValue'
                  render={(args) => {
                    if (values.adminChargeValueType === 'ExactAmount') {
                      return (
                        <NumberInput currency label='Admin Charge' {...args} />
                      )
                    }
                    return (
                      <NumberInput
                        percentage
                        label='Admin Charge'
                        max={100}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem md={3}>
                <Field
                  name='adminChargeValueType'
                  render={(args) => (
                    <Switch
                      checkedChildren='$'
                      unCheckedChildren='%'
                      checkedValue='ExactAmount'
                      unCheckedValue='Percentage'
                      label=''
                      {...args}
                    />
                  )}
                />
              </GridItem>
            </GridContainer>

            <GridItem md={6}>
              <FastField
                name='remark'
                render={(args) => {
                  return <TextField label='Remarks' multiline {...args} />
                }}
              />
            </GridItem>
          </GridContainer>
          <div
            style={{
              marginLeft: 9,
              marginTop: 20,
            }}
          >
            <h4 className={classes.header}>
              <b>
                Select outstanding invoices to be included in this statement
              </b>
            </h4>
          </div>
          <GridContainer style={{ margin: theme.spacing(1), marginTop: 0 }}>
            <GridItem container direction='row' spacing={0}>
              <GridItem xs md={3}>
                <FastField
                  name='InvoiceNo'
                  render={(args) => <TextField label='Invoice No' {...args} />}
                />
              </GridItem>

              <GridItem md={6}>
                <FastField
                  name='effectiveDates'
                  render={(args) => {
                    return (
                      <DateRangePicker
                        label='Invoice From Date'
                        label2='Invoice To Date'
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem classes={{ grid: classes.searchBtn }} xs md={3}>
                <ProgressButton
                  color='primary'
                  disabled={!values.copayerFK}
                  onClick={() => this.getInvoiceList()}
                  icon={<p />}
                >
                  <Search />
                  <FormattedMessage id='form.search' />
                </ProgressButton>
              </GridItem>
            </GridItem>
            <CommonTableGrid
              style={{ margin: theme.spacing(2) }}
              rows={
                invoiceRows.length > 0 ? invoiceRows : values.statementInvoice
              }
              columns={columns}
              columnExtensions={columnExtensions}
              FuncProps={{
                selectable: true,
                selectConfig: {
                  showSelectAll: true,
                  rowSelectionEnabled: (row) => {
                    const {
                      statementInvoicePayment = [],
                      payableAmount,
                      outstandingAmount,
                    } = row
                    return (
                      !statementInvoicePayment.find(
                        (o) => o.invoicePayment.isCancelled === false,
                      ) && payableAmount === outstandingAmount
                    )
                  },
                },
              }}
              selection={this.state.selectedRows}
              onSelectionChange={this.handleSelectionChange}
            />
          </GridContainer>
          <GridItem
            container
            style={{
              marginTop: 10,
              justifyContent: 'center',
            }}
          >
            <Button
              color='danger'
              onClick={navigateDirtyCheck({
                onProceed: this.goBackToPreviousPage,
              })}
            >
              Close
            </Button>
            <ProgressButton
              color='primary'
              disabled={mode === 'Add' && this.state.selectedRows.length <= 0}
              onClick={() => {
                this.setState({ selectedRows: [] })
                handleSubmit()
              }}
            >
              Save
            </ProgressButton>
          </GridItem>
        </CardContainer>
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { withTheme: true })(AddNewStatement)
