import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'

import { connect } from 'dva'
import classNames from 'classnames'
import { formatMessage, FormattedMessage } from 'umi/locale'
import SweetAlert from 'react-bootstrap-sweetalert'
import moment from 'moment'
import lodash from 'lodash'
import * as Yup from 'yup'
import numeral from 'numeral'
import Tooltip from '@material-ui/core/Tooltip'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import CustomInput from 'mui-pro-components/CustomInput'
import Modal from '@material-ui/core/Modal'
import ReactPDF, {
  Text,
  Document,
  Font,
  Page,
  StyleSheet,
  Image,
  View,
} from '@react-pdf/renderer'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import { withStyles } from '@material-ui/core/styles'
import {
  SummaryState,
  IntegratedSummary,
  DataTypeProvider,
  GroupingState,
  IntegratedGrouping,
} from '@devexpress/dx-react-grid'
import {
  Grid as DevGrid,
  Table,
  TableHeaderRow,
  TableSummaryRow,
  TableGroupRow,
  GroupingPanel,
  DragDropProvider,
  TableFixedColumns,
} from '@devexpress/dx-react-grid-material-ui'
import {
  withFormik,
  Formik,
  Form,
  Field,
  FastField,
  ErrorMessage,
} from 'formik'
import Button from 'mui-pro-components/CustomButtons'
import Print from '@material-ui/icons/Print'
import Info from '@material-ui/icons/Info'
import Clear from '@material-ui/icons/Clear'

import SimpleTable from 'mui-pro-components/Table'
import { sleep } from '@/utils/utils'
import {
  SimpleModal,
  CommonModal,
  DownloadPDF,
  MyDocument,
  CommonTableGrid,
} from '@/components'
import AddPayment from './AddPayment'
import AddCreditNote from './AddCreditNote'

const currencyFormat = '$0,0.00'
const percentageFormat = '0.00%'
const qtyFormat = '0.0'
const NumberFormatter = ({ value, color = 'darkblue' }) => {
  if (value && `${value}`.indexOf('-') === 0) color = 'red'
  // console.log(value, color)
  return <b style={{ color }}>{numeral(value).format(currencyFormat)}</b> // `$${value}`
}
const QtyFormatter = ({ value }) => numeral(value).format(qtyFormat) // `$${value}`

const NumberTypeProvider = (props) => (
  <DataTypeProvider formatterComponent={NumberFormatter} {...props} />
)
const QtyTypeProvider = (props) => (
  <DataTypeProvider formatterComponent={QtyFormatter} {...props} />
)

const sumReducer = (p, n) => {
  return p + n
}
const summaryCalculator = (type, rows, getValue) => {
  // console.log(type, rows, getValue)
  if (rows && rows.length > 0) {
    let fRows = rows.filter((o) => !o.voided)
    if (type === 'outstanding') {
      return (
        IntegratedSummary.defaultCalculator('sum', fRows, getValue) -
        fRows[0].totalPayable
      )
    }
    if (type === 'subTotal') {
      return IntegratedSummary.defaultCalculator('sum', fRows, getValue)
    }
    if (type === 'total') {
      return fRows.map((o) => o.amount).reduce(sumReducer) * 1.07
    }
    return IntegratedSummary.defaultCalculator(type, fRows, getValue)
  }
  return null
}
const data = [
  {
    id: 1,
    category: 'Patient',
    name: 'Charly WRX',
    itemType: 'Payment',
    createDate: '07-01-2019',
    itemCode: 'RC-000264',
    discount: '',
    amount: 84.5,
    totalPayable: 148.5,
  },
  {
    id: 2,
    category: 'Patient',
    name: 'Charly WRX',
    itemType: 'Credit Note',
    createDate: '07-01-2019',
    itemCode: 'CN-000023',
    discount: '',
    amount: 50,
    totalPayable: 148.5,
  },
  {
    id: 3,
    category: 'Company',
    name: 'Singapore AirLine',
    itemType: 'Payment',
    createDate: '07-01-2019',
    itemCode: 'RC-000263',
    discount: '',
    amount: 2,
    totalPayable: 24300,
    voided: true,
  },
  {
    id: 4,
    category: 'Company',
    name: 'Singapore AirLine',
    itemType: 'Payment',
    createDate: '07-01-2019',
    itemCode: 'RC-000265',
    discount: '',
    amount: 24300,
    totalPayable: 24300,
  },
]
const styles = (theme) => ({
  lightTooltip: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none',
  },
})
@connect(({ creditDebitNote, loading }) => ({
  creditDebitNote,
  submitting: loading.effects['form/submitRegularForm'],
}))
@withFormik({
  mapPropsToValues: () => ({}),
  validationSchema: Yup.object().shape({
    VoidReason: Yup.string().required(),
  }),
  // Custom sync validation
  // validate: values => {
  //   const errors = {}

  //   if (!values.title) {
  //     errors.title = 'Required'
  //   }

  //   return errors
  // },

  handleBlur: (a, b, c) => {
    console.log(a, b, c)
    // handleChange(e);
    // setFieldTouched(name, true, false);
  },

  handleSubmit: (values, { setSubmitting, setStatus }) => {
    // console.log(this)
    // setTimeout(() => {
    //   alert(JSON.stringify(values, null, 2))
    //   setSubmitting(false)

    // }, 1000)
    setStatus({
      submissionStatus: 'pending',
    })
    return sleep(2000).then(() => {
      console.log(JSON.stringify(values, null, 2))
      setSubmitting(false)
      setStatus({
        submissionStatus: 'done',
      })
    })
  },
  displayName: 'Payment',
})
class Payment extends React.Component {
  constructor (props) {
    super(props)

    const { theme, classes } = props

    const TableCell = (p) => {
      const { row, column } = p
      let style = {}
      if (row.voided) {
        style.textDecoration = 'line-through'
        style.color = 'grey'
      }
      // console.log(row.id,this.state[`openInfo${row.id}`])
      if (column.name === 'LeftAction') {
        console.log(p)
        return (
          <Table.Cell {...p}>
            <ClickAwayListener
              onClickAway={() => {
                if (this.state[`openInfo${row.id}`]) {
                  this.setState({ [`openInfo${row.id}`]: false })
                }
              }}
            >
              <Tooltip
                PopperProps={{
                  // disablePortal: true,
                  style: { opacity: 1 },
                }}
                onClose={() => {
                  this.setState({ [`openInfo${row.id}`]: false })
                }}
                open={this.state[`openInfo${row.id}`]}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                classes={{ tooltip: classes.lightTooltip }}
                title={
                  <SimpleTable
                    hover
                    tableHeaderColor='warning'
                    tableHead={[
                      'ID',
                      'Name',
                      'Qty',
                      'Unit Price',
                    ]}
                    tableData={[
                      [
                        '1',
                        'Cash',
                        '1.0',
                        NumberFormatter({ value: 39 }),
                      ],
                      [
                        '2',
                        'Credit Card',
                        '1.0',
                        NumberFormatter({ value: 4623 }),
                      ],
                    ]}
                  />
                }
                placement='top'
              >
                <Button
                  size='sm'
                  onClick={() => this.setState({ [`openInfo${row.id}`]: true })}
                  justIcon
                  round
                  color={row.voided ? 'gray' : 'primary'}
                  // title="View Details"
                  style={{ marginRight: theme.spacing.unit }}
                >
                  <Info />
                </Button>
              </Tooltip>
            </ClickAwayListener>
            <Button
              size='sm'
              onClick={() => {}}
              justIcon
              round
              color={row.voided ? 'gray' : 'primary'}
              title='Print'
              style={{ marginRight: theme.spacing.unit }}
            >
              <Print />
            </Button>
            <Button
              size='sm'
              onClick={() => (row.voided ? false : this.showVoid(row))}
              justIcon
              round
              color={row.voided ? 'gray' : 'danger'}
              title='Void'
            >
              <Clear />
            </Button>
          </Table.Cell>
        )
      }
      return (
        <Table.Cell
          {...p}
          // eslint-disable-next-line no-alert
          // onClick={() => alert(JSON.stringify(row))}
          style={{
            // cursor: 'pointer',
            ...style,
            // ...styles[row.sector.toLowerCase()],
          }}
        />
      )
    }

    const GroupCellContent = ({ column, row }) => {
      // console.log(column, row)
      const fRows = data.filter((o) => !o.voided && o.category === row.value)
      // console.log(fRows)
      return (
        <span style={{ verticalAlign: 'middle' }}>
          <strong>{row.value}</strong>
          <span style={{ float: 'right', lineHeight: '41px' }}>
            <strong>Total Payable:&nbsp;&nbsp;</strong>
            {NumberFormatter({
              value: fRows[0].totalPayable,
            })}
          </span>
        </span>
      )
    }

    const SummaryRow = (p) => {
      const rowCfg = {
        container: true,
        justify: 'center',
        spacing: 8,
      }
      const colCfg = {
        item: true,
        xs: true,
      }

      const { children, ...restProps } = p
      // console.log(children, restProps)
      const newChildren = [
        <Table.Cell colSpan={5} key={1}>
          <Grid {...rowCfg}>
            <Grid {...colCfg}>
              <Button size='sm' onClick={this.addPayment} color='info'>
                Add Payment
              </Button>
            </Grid>
            <Grid {...colCfg}>
              <Button size='sm' onClick={this.addCreditNote} color='info'>
                Add C.N
              </Button>
            </Grid>
            <Grid {...colCfg}>
              <Button size='sm' onClick={this.addDebitNote} color='info'>
                Add D.N
              </Button>
            </Grid>
            <Grid {...colCfg}>
              {/* <DownloadPDF /> */}
              <Button
                size='sm'
                onClick={() => {
                  ReactDOM.render(
                    <MyDocument />,
                    document.getElementById('test123'),
                  )
                }}
                color='info'
              >
                Print Label
              </Button>
            </Grid>
            <Grid {...colCfg}>
              <Button size='sm' onClick={this.addPayment} color='info'>
                Print Invoice
              </Button>
            </Grid>
          </Grid>
        </Table.Cell>,
        children[5],
      ]
      return <Table.Row {...p}>{newChildren}</Table.Row>
    }

    this.tableParas = {
      columns: [
        { name: 'LeftAction', title: ' ' },

        { name: 'category', title: 'Category' },
        { name: 'itemType', title: ' ' },
        { name: 'createDate', title: ' ' },
        { name: 'itemCode', title: ' ' },
        // { name: 'discount', title: 'Discount' },
        { name: 'amount', title: 'Amount' },
      ],
      columnExtensions: [
        {
          columnName: 'amount',
          type: 'number',
          currency: true,
          align: 'right',
        },

        { columnName: 'LeftAction', width: 105 },
      ],
      ActionProps: {
        TableCellComponent: TableCell,
      },
      FuncProps: {
        pager: false,
        grouping: true,
        groupingConfig: {
          showToolbar: false,
          state: {
            grouping: [
              { columnName: 'category' },
            ],
            defaultExpandedGroups: [
              'Patient',
              'Company',
            ],
          },
          row: {
            contentComponent: GroupCellContent,
          },
        },
        summary: true,
        summaryConfig: {
          state: {
            totalItems: [],
            groupItems: [
              { columnName: 'amount', type: 'subTotal' },
              { columnName: 'amount', type: 'outstanding' },
            ],
          },
          integrated: {
            calculator: summaryCalculator,
          },
          row: {
            groupRowComponent: SummaryRow,
            messages: {
              subTotal: 'Total Paid',
              outstanding: 'Outstanding',
              total: 'Total',
            },
          },
        },
      },
    }
  }

  state = {
    openModal: false,
    rows: data,
  }

  static getDerivedStateFromProps (nextProps, preState) {
    if (
      preState.openModal &&
      nextProps.status &&
      nextProps.status.submissionStatus === 'done'
    ) {
      return {
        openModal: false,
      }
    }
    return null
  }

  shouldComponentUpdate (nextProps, nextStates) {
    // console.log(nextProps, nextStates)
    const { values, errors, ...resetProps } = this.props
    const {
      values: newValues,
      errors: newErrors,
      ...resetNextProps
    } = nextProps
    if (!lodash.isEqual(nextStates, this.state)) return true
    if (!lodash.isEqual(errors, newErrors)) return true
    if (!lodash.isEqual(nextProps.status, this.props.status)) return true

    return false
    // console.log(nextProps===this.props, nextStates===this.state, resetProps===resetNextProps)

    // return nextProps!==this.props || nextStates!==this.state
  }

  // static getDerivedStateFromProps (nextProps, preState){
  //       console.log(, preState)
  //       if(nextProps.status && nextProps.status.done && preState.hide){
  //           return {
  //               hide:false,
  //           }
  //       }
  //       return null
  //   }

  showVoid = (row) => {
    this.props.setFieldValue('VoidReason', '', false)
    this.props.setStatus({
      submissionStatus: '',
    })
    this.setState({
      openModal: true,
      currentItemCode: row.itemCode,
    })
  }

  addPayment = () => {
    this.setState({
      openAddPayment: true,
    })
  }

  addCreditNote = () => {
    this.setState({
      openAddCreditNote: true,
      isDebitNote: false,
    })
  }

  addDebitNote = () => {
    this.setState({
      openAddCreditNote: true,
      isDebitNote: true,
    })
  }

  hideAlert () {
    this.setState({
      openModal: false,
    })
  }

  render () {
    // console.log(this)
    const { state, props } = this
    const { rows } = state

    // const TableCell =
    // console.log(this.props)
    const onParentConfirm = () => {}
    return (
      <div>
        <SimpleModal
          title={`Are you sure to void the Payment ${this.state
            .currentItemCode} ?`}
          open={this.state.openModal}
          status={this.props.status}
          onCancel={() => this.hideAlert()}
          onConfirm={() => {
            this.props.handleSubmit()
          }}
        >
          <FastField
            name='VoidReason'
            render={(args) => {
              return (
                <CustomInput
                  label={formatMessage({
                    id: 'finance.invoice.detail.payment.void.reason',
                  })}
                  autoFocus
                  multiline
                  // value={this.state.voidReason}
                  error={this.props.errors.VoidReason}
                  help={this.props.errors.VoidReason && 'Please type reason'}
                  // onChange={(e)=>{
                  //   this.setState({
                  //     voidReason:e.target.value,
                  //   })
                  //   // console.log(e.target.value)
                  // }}
                  {...args}
                />
              )
            }}
          />
        </SimpleModal>

        <Paper>
          <CommonTableGrid
            rows={rows}
            header={false}
            oddEven={false}
            {...this.tableParas}
          />
        </Paper>
        <div id='test123' />
        {state.openAddPayment && (
          <CommonModal
            open={state.openAddPayment}
            title='Make Payment'
            onClose={() => {
              this.setState({
                openAddPayment: false,
              })
            }}
            showFooter={false}
            onConfirm={(e) => {
              this.setState({
                openAddPayment: false,
              })
            }}
          >
            <AddPayment />
          </CommonModal>
        )}
        {state.openAddCreditNote && (
          <CommonModal
            open={state.openAddCreditNote}
            title='Credit Note Details'
            maxWidth='xl'
            onClose={() => {
              this.setState({
                openAddCreditNote: false,
              })
            }}
            showFooter={false}
            onConfirm={(e) => {
              this.setState({
                openAddCreditNote: false,
              })
            }}
          >
            <AddCreditNote isDebitNote={this.state.isDebitNote} />
          </CommonModal>
        )}
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })(Payment)
