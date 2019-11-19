import React, { PureComponent } from 'react'
import { FastField } from 'formik'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { withStyles } from '@material-ui/core'
import { Search } from '@material-ui/icons'
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
    const { effectiveDates, statementInvoice, ...restValues } = values
    const { dispatch, history } = props
    statementInvoice.forEach((o) => {
      delete o.id
    })
    dispatch({
      type: 'statement/upsert',
      payload: {
        ...restValues,
        statementInvoice,
      },
    }).then((r) => {
      if (r) {
        resetForm()
        history.push('/finance/statement')
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
          : 'patientPayableAmount',
        title: 'Payable Amount',
      },
      {
        name: this.props.statement.entity
          ? 'outstandingAmount'
          : 'patientOutstanding',
        title: 'Outstanding Amount',
      },
      { name: 'remark', title: 'Remarks' },
    ],
    columnExtensions: [
      {
        columnName: this.props.statement.entity
          ? 'payableAmount'
          : 'patientPayableAmount',
        type: 'number',
        currency: true,
      },
      {
        columnName: this.props.statement.entity
          ? 'outstandingAmount'
          : 'patientOutstanding',
        type: 'number',
        currency: true,
      },
      {
        columnName: 'invoiceDate',
        type: 'date',
        format: { dateFormatLong },
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
    defaultSelectedRows: [],
  }

  handleSelectionChange = (rows) => {
    const { setValues, values } = this.props
    const { invoiceRows, defaultSelectedRows, selectedRows } = this.state
    const found = selectedRows.some((r) => defaultSelectedRows.indexOf(r) >= 0)
    if (found) {
      return
    }
    this.setState({ selectedRows: rows })
    let statementInvoiceRows = []
    rows.forEach((o) => {
      const invoice = invoiceRows.find((r) => r.id === o)
      if (invoice) {
        invoice.invoicePayerFK = values.copayerFK
        invoice.invoiceFK = o
        statementInvoiceRows.push(invoice)
      }
    })
    setValues({
      ...values,
      statementInvoice: statementInvoiceRows,
    })
  }

  getInvoiceList = (e) => {
    const { dispatch, values, statement } = this.props
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
        this.setState((prevState) => {
          if (statement.entity) {
            const updatedInvoiceRows = [
              ...prevState.invoiceRows,
              ...data,
            ]
            return {
              invoiceRows: updatedInvoiceRows,
            }
          }

          return {
            invoiceRows: data,
          }
        })
      }
    })
  }

  goBackToPreviousPage = () => {
    const { history, resetForm } = this.props
    resetForm()
    history.goBack()
  }

  componentDidMounts () {
    this.setState({
      invoiceRows: this.props.values.statementInvoice,
    })
    let defaultIds = []
    this.props.values.statementInvoice.forEach((o) => {
      defaultIds.push(o.id)
    })
    this.setState({
      defaultSelectedRows: defaultIds,
    })
    this.setState({
      selectedRows: defaultIds,
    })
  }

  render () {
    const {
      classes,
      theme,
      values,
      history,
      handleSubmit,
      statement,
    } = this.props
    const { invoiceRows, columns, columnExtensions } = this.state
    // console.log('values', values)
    // console.log('state', this.state)
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
                    max={999}
                    inputProps={{ maxLength: 3 }}
                    maxLength={3}
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
              rows={invoiceRows}
              columns={columns}
              columnExtensions={columnExtensions}
              FuncProps={{ selectable: true }}
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
            <ProgressButton color='primary' onClick={() => handleSubmit()}>
              Save
            </ProgressButton>
          </GridItem>
        </CardContainer>
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { withTheme: true })(AddNewStatement)
