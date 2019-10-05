import React, { PureComponent } from 'react'
import moment from 'moment'
import { FastField } from 'formik'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { withStyles, Divider } from '@material-ui/core'
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
  mapPropsToValues: ({ statement }) => statement.entity || statement.default,

  validationSchema: Yup.object().shape({
    code: Yup.string().required(),
    displayValue: Yup.string().required(),
    effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
  }),

  handleSubmit: (values, { props }) => {
    const { effectiveDates, ...restValues } = values
    const { dispatch, onConfirm } = props
    dispatch({
      type: 'statement/upsert',
      payload: {
        ...restValues,
        effectiveStartDate: effectiveDates[0],
        effectiveEndDate: effectiveDates[1],
      },
    }).then((r) => {
      if (r) {
        if (onConfirm) onConfirm()
        dispatch({
          type: 'statement/query',
        })
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
      { name: 'invoiceAmt', title: 'Payable Amount' },
      { name: 'outstandingAmount', title: 'Outstanding Amount' },
      { name: 'remark', title: 'Remarks' },
    ],
    columnExtensions: [
      {
        columnName: 'invoiceAmt',
        type: 'number',
        currency: true,
      },
      {
        columnName: 'outstandingBalance',
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
    rows: [
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
    this.setState({
      rows: this.props.values.statementInvoice,
    })
  }

  handleSelectionChange = (selection) => {
    this.setState({ selectedRows: selection })
  }

  getInvoiceList = (e) => {
    this.props.dispatch({
      type: 'statement/queryInvoiceList',
      payload: {
        'invoicePayer.CompanyFK': e,
      },
    })
  }

  render () {
    const { classes, footer, onConfirm, theme, values, history } = this.props
    const {
      rows,
      columns,
      currencyColumns,
      dateColumns,
      columnExtensions,
    } = this.state
    const editRow = (row, e) => {
      history.push(`/finance/statement`)
    }
    console.log('statementInvoice', this.state.rows)
    return (
      <React.Fragment>
        <CardContainer hideHeader>
          {/* <GridContainer>
          <GridItem xs lg={4}>
            <h4>
              <FormattedMessage id='finance.statement.detailsTitle' />
            </h4>
          </GridItem>
          <GridItem xs lg={8}>
            <h4>
              <FormattedMessage id='finance.statement.title.selectInvoice' />
            </h4>
          </GridItem>
        </GridContainer> */}
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
                name='PaymentTerms'
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
                    if (values.adminChargeType) {
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
                  name='adminChargeType'
                  render={(args) => (
                    <Switch
                      checkedChildren='$'
                      unCheckedChildren='%'
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
              rows={rows}
              columns={columns}
              // currencyColumns={currencyColumns}
              // dateColumns={dateColumns}
              columnExtensions={columnExtensions}
              // height={300}
              FuncProps={{ selectable: true }}
              selection={this.state.selectedRows}
              onSelectionChange={this.handleSelectionChange}
            />
            {/* // rows={rows}
            // columns={columns}
            // currencyColumns={currencyColumns}
            // dateColumns={dateColumns}
            // height={300}
            // />
            {/* <GridItem classes={{ grid: classes.invoicesList }}>
              <EditableTableGrid
                rows={rows}
                columns={columns}
                currencyColumns={currencyColumns}
                dateColumns={dateColumns}
                height={300}
              />
            </GridItem> */}
            {/* </GridItem> */}
          </GridContainer>
          {/* {footer &&
            footer({
              onConfirm,
              confirmBtnText: formatMessage({
                id: 'form.create',
              }),
              confirmProps: {
                disabled: false,
              },
            })} */}
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
            <Button color='primary'>Save</Button>
          </GridItem>
        </CardContainer>
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { withTheme: true })(AddNewStatement)
