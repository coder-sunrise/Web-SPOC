import React, { PureComponent } from 'react'
import { FastField } from 'formik'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { withStyles } from '@material-ui/core'
import { Search } from '@material-ui/icons'
import { connect } from 'dva'
import Yup from '@/utils/yup'
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

  handleSubmit: (values, { props }) => {
    const { effectiveDates, ...restValues } = values
    const { dispatch, history } = props
    console.log('submit', values)
    // return
    dispatch({
      type: 'statement/upsert',
      payload: {
        ...restValues,
      },
    }).then((r) => {
      if (r) {
        history.push('/finance/statement')
      }
    })
  },
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
  }

  componentDidMount () {
    console.log('statement', this.props.values.statement)
    this.setState({
      invoiceRows: this.props.values.statementInvoice,
    })
    // this.setState({
    //   selectedRows: this.props.values.statementInvoice,
    // })
  }

  handleSelectionChange = (rows) => {
    const { setValues, values } = this.props
    const { invoiceRows } = this.state
    this.setState({ selectedRows: rows })
    let statementInvoiceRows = []
    rows.forEach((o) => {
      const invoice = invoiceRows.find((r) => r.id === o)
      invoice.invoicePayerFK = values.copayerFK
      invoice.invoiceFK = o
      statementInvoiceRows.push(invoice)
    })
    console.log('statementInvoiceRows', statementInvoiceRows)
    setValues({
      ...values,
      statementInvoice: statementInvoiceRows,
    })
  }

  getInvoiceList = (e) => {
    const { dispatch, statement } = this.props
    dispatch({
      type: 'statement/queryInvoiceList',
      payload: {
        'invoicePayer.CompanyFK': e,
      },
    }).then((invoiceList) => {
      const { data } = invoiceList.data
      this.setState({ invoiceRows: data })
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
    console.log('state', this.state)
    console.log('props', this.props)

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
                        onChange={(e) => this.getInvoiceList(e)}
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
                    if (values.adminChargeType === 'ExactAmount') {
                      return (
                        <NumberInput currency label='Admin Charge' {...args} />
                      )
                    }
                    return (
                      <NumberInput percentage label='Admin Charge' {...args} />
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
            {/* <GridItem
            xs
            lg={4}
            container
            direction='column'
            justify='flex-start'
            alignItems='stretch'
          >
            <GridItem>
              <FastField
                name='StatementDate'
                render={(args) => (
                  <DatePicker
                    {...args}
                    label={formatMessage({
                      id: 'finance.statement.statementDate',
                    })}
                  />
                )}
              />
            </GridItem> */}
            {/* <GridItem>
              <FastField
                name='Company'
                render={(args) => (
                  <Select
                    label={formatMessage({
                      id: 'finance.statement.company',
                    })}
                    options={[
                      { name: 'AIA', value: 'aia' },
                      { name: 'Singapore Airline', value: 'singapore airline' },
                      { name: 'CHAS', value: 'chas' },
                      { name: 'KTPH', value: 'ktph' },
                      { name: 'MEDISAVE', value: 'medisave' },
                    ]}
                    {...args}
                  />
                )}
              />
            </GridItem> */}

            {/* <GridItem>
              <FastField
                name='Remarks'
                render={(args) => (
                  <TextField
                    label={formatMessage({
                      id: 'finance.statement.details.remarks',
                    })}
                    {...args}
                  />
                )}
              />
            </GridItem> */}
          </GridContainer>
          <div
            style={{
              marginLeft: 9,
              marginTop: 20,
            }}
            // style={{
            //   marginLeft: theme.spacing(1),
            //   marginRight: theme.spacing(1),
            //   marginTop: theme.spacing(3),
            // }}
          >
            <h4 className={classes.header}>
              <b>
                Select outstanding invoices to be included in this statement
              </b>
            </h4>
          </div>
          <GridContainer style={{ margin: theme.spacing(2), marginTop: 0 }}>
            {/* <GridItem
              xs
              lg={8}
              container
              direction='column'
              justify='flex-start'
              alignItems='stretch'
            > */}
            {/* <GridItem>
                <h5 style={{ textAlign: 'left' }}>
                  <FormattedMessage id='finance.statement.title.selectInvoiceSub' />
                </h5>
              </GridItem> */}
            <GridItem container direction='row' spacing={0}>
              <GridItem xs md={3}>
                <FastField
                  name='InvoiceNo'
                  render={(args) => (
                    <TextField
                      label='Invoice No'
                      {...args}
                      // label={formatMessage({
                      //   id: 'finance.invoice.search.invoice',
                      // })}
                    />
                  )}
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
              {/* <GridItem xs md={3}>
                <FastField
                  name='StatementDate'
                  render={(args) => (
                    <DatePicker
                      {...args}
                      label={formatMessage({
                        id: 'finance.statement.statementDate',
                      })}
                    />
                  )}
                />
              </GridItem>
              <GridItem xs md={3}>
                <FastField
                  name='StatementDate'
                  render={(args) => (
                    <DatePicker
                      {...args}
                      label={formatMessage({
                        id: 'finance.statement.statementDate',
                      })}
                    />
                  )}
                />
              </GridItem> */}
              <GridItem classes={{ grid: classes.searchBtn }} xs md={3}>
                <Button color='primary'>
                  <Search />
                  <FormattedMessage id='form.search' />
                </Button>
              </GridItem>
            </GridItem>
            <CommonTableGrid
              style={{ margin: theme.spacing(2) }}
              rows={invoiceRows}
              columns={columns}
              columnExtensions={columnExtensions}
              FuncProps={{ selectable: !statement.entity }}
              selection={this.state.selectedRows}
              onSelectionChange={this.handleSelectionChange}
            />
          </GridContainer>
          <GridItem
            container
            style={{
              marginTop: 10,
              justifyContent: 'flex-end',
            }}
          >
            <Button color='danger' onClick={() => history.goBack()}>
              Cancel
            </Button>
            <Button color='primary' onClick={() => handleSubmit()}>
              Save
            </Button>
          </GridItem>
        </CardContainer>
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { withTheme: true })(AddNewStatement)
