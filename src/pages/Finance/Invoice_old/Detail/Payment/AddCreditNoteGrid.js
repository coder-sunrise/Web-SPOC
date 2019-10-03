import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'dva'
import { formatMessage, FormattedMessage } from 'umi/locale'
import router from 'umi/router'
import numeral from 'numeral'
import lodash from 'lodash'
// import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
// import { TooltipComponent } from '@syncfusion/ej2-react-popups'
// import {TextBox as TextBoxComponent , TextArea,RadioButtonGroup} from '@/components'
// import { ButtonComponent, RadioButtonComponent } from '@syncfusion/ej2-react-buttons'
// import { DateRangePickerComponent } from '@syncfusion/ej2-react-calendars'
import moment from 'moment'
import * as Yup from 'yup'
import { withFormik, Formik, Form, Field, FastField, FieldArray } from 'formik'

import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import { CustomInput, Button, Timeline } from 'mui-pro-components'
import {
  AccountCircle,
  Search,
  Replay,
  Person,
  Delete,
  Save,
  Edit,
  Cancel,
} from '@material-ui/icons'
import { TableCell, MenuItem, Input, IconButton } from '@material-ui/core'
import { Getter } from '@devexpress/dx-react-core'
import {
  Column,
  FilteringState,
  GroupingState,
  SummaryState,
  IntegratedSummary,
  EditingState,
  IntegratedFiltering,
  IntegratedGrouping,
  IntegratedPaging,
  IntegratedSelection,
  IntegratedSorting,
  PagingState,
  SelectionState,
  SortingState,
  DataTypeProvider,
  DataTypeProviderProps,
} from '@devexpress/dx-react-grid'
import {
  DragDropProvider,
  VirtualTable,
  Grid as DevGrid,
  GroupingPanel,
  PagingPanel,
  Table,
  TableFilterRow,
  TableGroupRow,
  TableSummaryRow,
  TableHeaderRow,
  TableSelection,
  Toolbar,
  TableFixedColumns,
  TableEditRow,
  TableEditColumn,
  TableColumnReordering,
} from '@devexpress/dx-react-grid-material-ui'
import { getUniqueGUID } from '@/utils/cdrss'
import {
  QtyTypeProvider,
  DateTypeProvider,
  NumberTypeProvider,
  TextTypeProvider,
} from '@/components/Grid'
import { sleep, sumReducer, NumberFormatter, difference } from '@/utils/utils'
import { Select, CommonModal, MyDocument } from '@/components'

const styles = (theme) => ({
  root: {
    // padding: theme.spacing.unit * 2,
    // margin: 'auto',
    // maxWidth: 800,
  },
  grid: {
    '& > div > div': {
      height: 'calc(100vh - 279px) !important',
    },
    '& colgroup > col:nth-child(1)': {
      width: '10% !important',
    },
    '& colgroup > col:nth-child(2)': {
      width: '30% !important',
    },
    '& colgroup > col:nth-child(3)': {
      width: '15% !important',
    },
    '& colgroup > col:nth-child(4)': {
      width: '15% !important',
    },
    '& colgroup > col:nth-child(5)': {
      width: '15% !important',
    },
    '& colgroup > col:nth-child(6)': {
      width: '15% !important',
    },
  },
  lookupEditCell: {
    // paddingTop: theme.spacing.unit * 0.875,
    // paddingRight: theme.spacing.unit,
    // paddingLeft: theme.spacing.unit,
  },
  gridContent: {
    height: 'calc(100vh - 375px)',
  },
  commandButton: {
    marginRight: theme.spacing.unit,
  },
})
const summaryCalculator = (type, rows, getValue) => {
  // console.log(type, rows, getValue)
  if (type === 'gst') {
    return numeral(
      rows.map((o) => o.Amount).reduce(sumReducer, 0) * 0.07,
    ).value()
  }
  if (type === 'subTotal') {
    return IntegratedSummary.defaultCalculator('sum', rows, getValue)
  }
  if (type === 'total') {
    return numeral(
      rows.map((o) => o.Amount).reduce(sumReducer, 0) * 1.07,
    ).value()
  }
  return IntegratedSummary.defaultCalculator(type, rows, getValue)
}
const inoviceItems = [
  {
    Id: 0,
    Code: 'SVC001',
    Description: 'Sample Service 1',
    CanAdd: false,
    UnitPrice: 100,
  },
  {
    Id: 1,
    Code: 'SV24',
    Description: 'Root Planing & Gum Curettage (1)',
    CanAdd: true,
    UnitPrice: 50,
  },
  {
    Id: 2,
    Code: 'SV16',
    Description: 'Brackets Bonding',
    CanAdd: true,
    UnitPrice: 500,
  },
]
const drugs = [
  {
    Id: 0,
    Code: 'MED 06',
    Description: 'Chlorhexidine Mouthrinse',
    UnitPrice: 10,
    StockUOM: 'Bottle',
  },
  {
    Id: 1,
    Code: 'MED 05',
    Description: 'Clindamycin 150mg Cap',
    UnitPrice: 1.5,
    StockUOM: 'Capsule',
  },
  {
    Id: 2,
    Code: 'CYCIN TABLET',
    Description: 'CYCIN TABLET 500MG',
    UnitPrice: 15,
    StockUOM: 'Tablet',
  },
]
const services = [
  {
    Id: 0,
    Code: 'SV16',
    Description: 'Brackets Bonding',
    UnitPrice: 50,
    Center: 1,
  },
  {
    Id: 1,
    Code: 'BG',
    Description: 'Bridging',
    UnitPrice: 500,
    Center: 1,
  },
  {
    Id: 2,
    Code: 'SV15',
    Description: 'Ceramic Braces',
    UnitPrice: 50,
    Center: 1,
  },
]
const serviceCenters = [
  {
    Id: 0,
    Description: 'Day OT',
  },
  {
    Id: 1,
    Description: 'Doctor Consultation',
  },
  {
    Id: 2,
    Description: 'External Service Centre',
  },
  {
    Id: 3,
    Description: 'Physical Therapy',
  },
  {
    Id: 4,
    Description: 'Radiolog Imaging',
  },
]
const consumables = [
  {
    Id: 0,
    Code: 'COM 05',
    Description: 'Colgate Phos-Flur',
    UnitPrice: 30,
  },
  {
    Id: 1,
    Code: 'COM 06',
    Description: 'Colgate Thothbrush',
    UnitPrice: 5,
  },
  {
    Id: 2,
    Code: 'COM 08',
    Description: 'Dexaltin Oral Paste',
    UnitPrice: 12,
  },
]
const getRowId = (row) => row.Id
const AddButton = ({ onExecute }) => (
  <div style={{ textAlign: 'center' }}>
    <Button color='primary' onClick={onExecute} title='Create new row'>
      New
    </Button>
  </div>
)

const EditButton = ({ onExecute }) => (
  <Button
    size='sm'
    onClick={onExecute}
    justIcon
    round
    color='primary'
    title='Edit'
  >
    <Edit />
  </Button>
)

const DeleteButton = ({ onExecute }) => (
  <Button
    size='sm'
    onClick={onExecute}
    justIcon
    round
    color='primary'
    title='Delete'
  >
    <Delete />
  </Button>
)

const CommitButton = ({ onExecute }) => (
  <Button
    size='sm'
    onClick={async (e) => {
      onExecute(e)
    }}
    justIcon
    round
    color='primary'
    title='Delete'
  >
    <Save />
  </Button>
)

const CancelButton = ({ onExecute }) => (
  <Button
    size='sm'
    onClick={onExecute}
    justIcon
    round
    color='danger'
    title='Delete'
  >
    <Cancel />
  </Button>
)

const commandComponents = {
  add: AddButton,
  edit: EditButton,
  delete: DeleteButton,
  commit: CommitButton,
  cancel: CancelButton,
}

@connect(({ addCreditNote }) => ({
  addCreditNote,
}))
@withFormik({
  mapPropsToValues: ({ addCreditNote }) => {
    // console.log(com)
    return addCreditNote.entity.Items
  },
  validationSchema: Yup.object().shape({
    EditingItems: Yup.array().of(
      Yup.object().shape({
        Description: Yup.string().required('Description is required'),
        UnitPrice: Yup.number().required('Unit Price is required'),
      }),
    ),
    // VoidReason: Yup.string().required(),
  }),

  handleSubmit: (values, { props }) => {
    // props.dispatch({
    //   type:'addPayment/submit',
    //   payload:values,
    // }).then(r=>{
    //   if(r.message==='Ok'){
    //     // toast.success('test')
    //     notification.success({
    //       // duration:0,
    //       message:'Done',
    //     })
    //     if(props.onConfirm)props.onConfirm()
    //   }
    // })
  },
  displayName: 'AddCreditNoteGrid',
})
class AddCreditNoteGrid extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      columns: [
        { name: 'Code', title: 'Item Description' },
        { name: 'Description', title: 'Description' },

        { name: 'UnitPrice', title: 'Unit Price' },
        { name: 'Qty', title: 'Qty.' },
        { name: 'Amount', title: 'Amount' },
      ],
      totalSummaryItems: [
        { columnName: 'Amount', type: 'subTotal' },
        { columnName: 'Amount', type: 'total' },
      ],
      dateColumns: [
        'invoiceDate',
      ],
      qtyColumns: [
        'Qty',
      ],
      currencyColumns: [
        'Amount',
        'UnitPrice',
      ],
      textColumns: [
        'Code',
        'Description',
      ],
      pageSizes: [
        5,
        10,
        15,
      ],
      selection: [],
      editingRowIds: [],
      addedRows: [],
      rowChanges: {},
      deletingRows: [],

      selectedServiceFilter: 0,
    }

    const getStateDeletingRows = () => {
      const { deletingRows } = this.state
      return deletingRows
    }

    this.changeEditingRowIds = (editingRowIds) =>
      this.setState({ editingRowIds })
    this.changeAddedRows = (addedRows) =>
      this.setState({
        addedRows: addedRows.map(
          (row) =>
            Object.keys(row).length
              ? row
              : {
                  // amount: 0,
                  // discount: 0,
                  // saleDate: new Date().toISOString().split('T')[0],
                  // product: availableValues.product[0],
                  // region: availableValues.region[0],
                  // customer: availableValues.customer[0],
                },
        ),
      })
    this.changeRowChanges = (rowChanges) => this.setState({ rowChanges })
    this.changeCurrentPage = (currentPage) => this.setState({ currentPage })
    this.changePageSize = (pagesize) => this.setState({ pagesize })
    this.commitChanges = (p) => {
      const { added, changed, deleted } = p
      console.log(p)
      let { rows } = this.state
      if (added) {
        this.props.dispatch({
          type: 'addCreditNote/add',
          payload: added,
        })
        // const startingAddedId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 0
        // rows = [
        //   ...rows,
        //   ...added.map((row, index) => ({
        //     id: startingAddedId + index,
        //     ...row,
        //   })),
        // ]
      }
      if (changed) {
        this.props.dispatch({
          type: 'addCreditNote/change',
          payload: changed,
        })
        // rows = rows.map(row => {
        //   return changed[row.Id] ? { ...row, ...changed[row.Id] } : row
        // })
      }
      if (deleted) {
        this.props.dispatch({
          type: 'addCreditNote/delete',
          payload: deleted,
        })
      }
      console.log(p)
      // this.setState({ rows, deletingRows: deleted || getStateDeletingRows() })
    }
    this.cancelDelete = () => this.setState({ deletingRows: [] })
    this.deleteRows = () => {
      // const rows = getStateRows().slice()
      // getStateDeletingRows().forEach((rowId) => {
      //   const index = rows.findIndex(row => row.id === rowId)
      //   if (index > -1) {
      //     rows.splice(index, 1)
      //   }
      // })
      // this.setState({ rows, deletingRows: [] })
    }
    this.changeColumnOrder = (order) => {
      this.setState({ columnOrder: order })
    }

    this.EditCell = (p) => {
      const { column, row, value, onValueChange } = p
      // console.log(this)
      // console.log(p)

      // row[column.name]=value
      // this.setState({
      //   [`editing${row.Id}${column.name}`]:value,
      // })
      // row.Amount=row.UnitPrice*row.Qty
      const defaultCfg = {
        defaultValue: row.Code,
        labelField: 'name',
        simple: true,
        filterOption: (option, filter) => {
          if (!filter) return option
          if (
            `${option.data.Code.toLowerCase()}${option.data.Description.toLowerCase()}`.indexOf(
              filter.toLowerCase(),
            ) >= 0
          )
            return option
          return null
        },
        width: 600,
        onChange: (e, options) => {
          console.log(e, options)
          const selected = options.find((o) => o.Code === e.target.value)
          onValueChange(e.target.value)
          this.props.dispatch({
            type: 'addCreditNote/change',
            payload: {
              [row.Id]: {
                Code: selected.Code,
                Description: selected.Description,
                UnitPrice: selected.UnitPrice,
              },
            },
          })
        },
      }

      column.inputProps = {
        // name:`EditingItems[${row.Index}].${column.name}`,
        validBeforeChange: true,
        onChange: (e) => {
          onValueChange(e.target.value)

          if (column.name === 'UnitPrice' || column.name === 'Qty') {
            this.setState({
              [`editing${row.Id}${column.name}`]: e.target.value,
            })
          }
        },
      }
      if (
        column.name === 'Amount' ||
        (column.name === 'Code' && row.Type === 'Other')
      ) {
        column.inputProps.disabled = true
        column.inputProps.name = undefined
        if (column.name === 'Amount') {
          const newVal =
            (this.state[`editing${row.Id}UnitPrice`] || row.UnitPrice) *
            (this.state[`editing${row.Id}Qty`] || row.Qty)
          if (newVal !== value) {
            column.inputProps.value = newVal
          }
        }
      } else if (column.name === 'Code') {
        switch (row.Type) {
          case 'Drug':
            return (
              <Table.Cell {...p} colSpan={2}>
                <Select
                  {...defaultCfg}
                  label='Select Drug'
                  options={drugs.map((o) => {
                    return {
                      value: o.Code,
                      name: (
                        <p style={{ paddingTop: '15px', width: '100%' }}>
                          {`${o.Code}/${o.Description}`}{' '}
                          <span style={{ fontSize: 10, float: 'right' }}>
                            {`Stock UOM: ${o.StockUOM}`}
                          </span>
                        </p>
                      ),
                      selected: `${o.Code}/${o.Description}`,
                      ...o,
                      // disabled:!o.CanAdd,
                    }
                  })}
                />
              </Table.Cell>
            )
          case 'Service':
            const opt = services.find((o) => o.Code === row.Code) || {}
            const center = serviceCenters.find((o) => o.Id === opt.Center) || {}
            return (
              <Table.Cell {...p}>
                <Select
                  {...defaultCfg}
                  defaultValue={center.Id}
                  label='Service Center'
                  options={serviceCenters.map((o) => {
                    return {
                      value: o.Id,
                      name: o.Description,
                      ...o,
                    }
                  })}
                  onChange={(e, options) => {
                    // const selected=options.find(o=>o.Code===e.target.value)
                    // onValueChange(e.target.value)
                    console.log(e, options)
                    this.setState({
                      selectedServiceFilter: e.target.value,
                    })
                  }}
                />
              </Table.Cell>
            )
          case 'Consumable':
            return (
              <Table.Cell {...p} colSpan={2}>
                <Select
                  {...defaultCfg}
                  label='Consumable'
                  options={consumables.map((o) => {
                    return {
                      value: o.Code,
                      name: `${o.Code}-${o.Description}`,
                      ...o,
                    }
                  })}
                />
              </Table.Cell>
            )
          case 'InvoiceItem':
            return (
              <Table.Cell {...p} colSpan={2}>
                <Select
                  {...defaultCfg}
                  options={inoviceItems
                    .filter(
                      (o) =>
                        o.Centre === this.state.selectedServiceFilter ||
                        !this.state.selectedServiceFilter,
                    )
                    .map((o) => {
                      return {
                        value: o.Code,
                        name: `${o.Code}/${o.Description} ${NumberFormatter({
                          value: o.UnitPrice,
                          text: true,
                        })}`,
                        disabled: !o.CanAdd,
                        ...o,
                      }
                    })}
                />
              </Table.Cell>
            )
          default:
            break
        }
      } else if (column.name === 'Description') {
        switch (row.Type) {
          case 'InvoiceItem':
          case 'Drug':
          case 'Consumable':
            return null
          case 'Service':
            return (
              <Table.Cell {...p}>
                <Select
                  {...defaultCfg}
                  label='Service'
                  options={services.map((o) => {
                    return {
                      value: o.Code,
                      name: `${o.Code}/${o.Description} ${NumberFormatter({
                        value: o.UnitPrice,
                        text: true,
                      })}`,
                      ...o,
                    }
                  })}
                  onChange={(e, options) => {
                    const selected = options.find(
                      (o) => o.Code === e.target.value,
                    )
                    this.props.dispatch({
                      type: 'addCreditNote/change',
                      payload: {
                        [row.Id]: {
                          Code: selected.Code,
                          Description: selected.Description,
                          UnitPrice: selected.UnitPrice,
                        },
                      },
                    })
                  }}
                />
              </Table.Cell>
            )
          default:
            break
        }
      }
      // if (paras) {
      //   return <LookupEditCell {...p}
      //     row={row}
      //     paras={paras}
      //   />
      // }
      return <TableEditRow.Cell {...p} />
    }
  }

  static getDerivedStateFromProps (nextProps, preState) {
    const { values, addCreditNote, list, errors } = nextProps
    const newSt = {}
    if (addCreditNote) {
      newSt.rows = addCreditNote.entity.Items || []
      inoviceItems.forEach((o) => {
        o.CanAdd = !newSt.rows.find((m) => m.Code === o.Code)
      })
      // newSt.addedRows=values.EditingItems || []
    }
    // if(inoviceItems.filter(o=>o.CanAdd).length!==preState.invoiceItemLeftCount){
    //   newSt.invoiceItemLeftCount=inoviceItems.filter(o=>o.CanAdd).length
    // }
    if (Object.keys(newSt).length) {
      return newSt
    }
    return null
  }

  // shouldComponentUpdate (nextProps, nextStates){
  //   console.log(nextProps===this.props)
  //   console.log(nextProps.addCreditNote === this.props.addCreditNote)
  //   console.log(nextStates===this.state)
  //   console.log(lodash.isEqual(nextStates,this.state))

  //   console.log(difference(this.state,nextStates))
  //   // console.log()

  //   return true
  // }

  addItemCommon = (d = {}) => {
    const { addedRows, editingRowIds } = this.state
    const row = {
      Id: getUniqueGUID(),
      Index: addedRows.length,
      Qty: 1,
      UnitPrice: 0,
      Amount: 0,
      Description: '',
      ...d,
    }
    addedRows.push(row)
    // this.itemsArrayHelpers.push(row)
    this.commitChanges({
      added: [
        row,
      ],
    })
    editingRowIds.push(row.Id)
    this.changeEditingRowIds(editingRowIds)
  }

  addItemFromInvoice = () => {
    const d = inoviceItems.filter((o) => o.CanAdd)[0]
    this.addItemCommon({
      Type: 'InvoiceItem',
      Code: d.Code,
      Description: d.Description,
      UnitPrice: d.UnitPrice,
    })
  }

  addDrug = () => {
    this.addItemCommon({
      Type: 'Drug',
    })
  }

  addConsumable = () => {
    this.addItemCommon({
      Type: 'Consumable',
    })
  }

  addService = () => {
    this.addItemCommon({
      Type: 'Service',
    })
  }

  addOther = () => {
    this.addItemCommon({
      Type: 'Other',
      Code: 'OPCD',
    })
  }

  preview = () => {
    this.setState(
      {
        openPreview: true,
      },
      () => {
        setTimeout(() => {
          ReactDOM.render(<MyDocument />, document.getElementById('test123'))
        }, 1000)
      },
    )
  }

  render () {
    const { state, props } = this
    const {
      submitting,
      theme,
      dispatch,
      classes,
      addCreditNote,
      isDebitNote,
      ...resetProps
    } = props
    // console.log(this)
    const {
      rows,
      columns,
      tableColumnExtensions,
      sorting,
      editingRowIds,
      addedRows,
      rowChanges,
      currentPage,
      deletingRows,
      pagesize,
      pageSizes,
      columnOrder,
      percentColumns,
      leftFixedColumns,
      totalSummaryItems,
      currencyColumns,
      qtyColumns,
      textColumns,
      dateColumns,
      selection,
    } = state
    return (
      <Paper
        style={{ marginTop: theme.spacing.unit - 1 }}
        className={classes.grid}
      >
        <DevGrid
          rows={rows}
          columns={columns}
          getRowId={getRowId}
          className={classes.gridContent}
        >
          <SortingState
            defaultSorting={[
              // { columnName: 'invoiceDate', direction: 'desc' },
            ]}
          />

          <SelectionState
            selection={selection}
            onSelectionChange={this.changeSelection}
          />
          <SummaryState totalItems={totalSummaryItems} />
          <EditingState
            editingRowIds={editingRowIds}
            onEditingRowIdsChange={this.changeEditingRowIds}
            // rowChanges={rowChanges}
            // onRowChangesChange={this.changeRowChanges}
            // addedRows={addedRows}
            // onAddedRowsChange={this.changeAddedRows}
            onCommitChanges={this.commitChanges}
            // columnExtensions={[{ columnName: 'name', editingEnabled: false },]}
          />
          <IntegratedSorting />
          <IntegratedSummary calculator={summaryCalculator} />
          <DragDropProvider />
          <TextTypeProvider for={textColumns} />
          <NumberTypeProvider for={currencyColumns} />
          <QtyTypeProvider for={qtyColumns} />
          <DateTypeProvider for={dateColumns} />
          <VirtualTable
            // cellComponent={Cell}
            height={300}
            // className={classes.gridContent}
            columnExtensions={[
              {
                columnName: 'UnitPrice',
                align: 'right',
              },
              {
                columnName: 'Qty',
                align: 'right',
              },
              {
                columnName: 'Amount',
                align: 'right',
              },
              {
                columnName: 'Code',
              },
              {
                columnName: 'description',
              },
            ]}
          />
          <TableSelection
            // selectByRowClick
            highlightRow
            showSelectionColumn={false}
          />

          <TableHeaderRow
            showSortingControls
            rowComponent={(p) => {
              const { children, ...restProps } = p

              return (
                <Table.Row {...restProps}>
                  {children.map((o, i) => {
                    if (i === 0) {
                      return React.cloneElement(o, { colSpan: 2 })
                    }
                    if (i === 1) {
                      return null
                    }
                    return o
                  })}
                </Table.Row>
              )
            }}
          />
          <TableEditRow cellComponent={this.EditCell} />
          <TableEditColumn
            showAddCommand={false}
            showEditCommand
            showDeleteCommand
            commandComponent={({ id, onExecute }) => {
              const CommandButton = commandComponents[id]
              return <CommandButton onExecute={onExecute} {...resetProps} />
            }}
          />
          {/* <TableFixedColumns
            rightColumns={['action',TableEditColumn.COLUMN_TYPE]}
          /> */}
          <TableSummaryRow
            messages={{
              subTotal: 'Total Amount',
              gst: 'GST',
              total: 'Total Amount(GST)',
            }}
            totalRowComponent={(p) => {
              const { children, ...restProps } = p
              const shouldDisabled = Object.keys(this.props.errors).length > 0
              const newChildren = [
                <Table.Cell colSpan={4} key={1}>
                  {!isDebitNote && (
                    <Button
                      size='sm'
                      onClick={this.addItemFromInvoice}
                      className={classes.commandButton}
                      color='info'
                      disabled={
                        shouldDisabled ||
                        !inoviceItems.find((o) => o.CanAdd) ||
                        addedRows.find((o) => o.Type === 'InvoiceItem')
                      }
                    >
                      Select items from Invoice
                    </Button>
                  )}

                  {isDebitNote && (
                    <Button
                      size='sm'
                      onClick={this.addDrug}
                      color='info'
                      disabled={shouldDisabled}
                      className={classes.commandButton}
                    >
                      Add Drug
                    </Button>
                  )}
                  {isDebitNote && (
                    <Button
                      size='sm'
                      onClick={this.addService}
                      color='info'
                      disabled={shouldDisabled}
                      className={classes.commandButton}
                    >
                      Add Service
                    </Button>
                  )}
                  {isDebitNote && (
                    <Button
                      size='sm'
                      onClick={this.addConsumable}
                      color='info'
                      disabled={shouldDisabled}
                      className={classes.commandButton}
                    >
                      Add Consumable
                    </Button>
                  )}
                  {isDebitNote && (
                    <Button
                      size='sm'
                      onClick={this.preview}
                      color='info'
                      disabled={shouldDisabled}
                      className={classes.commandButton}
                    >
                      Preview
                    </Button>
                  )}

                  <Button
                    size='sm'
                    onClick={this.addOther}
                    color='info'
                    disabled={shouldDisabled}
                    className={classes.commandButton}
                  >
                    Add Other
                  </Button>
                </Table.Cell>,
                children[4],
                children[5],
              ]
              return (
                <Table.Row className={classes.footerRow}>
                  {newChildren}
                </Table.Row>
              )
            }}
          />
          <Getter
            name='tableColumns'
            computed={({ tableColumns }) => {
              // debugger
              const result = [
                ...tableColumns.filter(
                  (c) => c.type !== TableEditColumn.COLUMN_TYPE,
                ),
                {
                  key: 'editCommand',
                  type: TableEditColumn.COLUMN_TYPE,
                  width: 140,
                },
              ]
              return result
            }}
          />
        </DevGrid>
        {state.openPreview && (
          <CommonModal
            open={state.openPreview}
            title='PrintOut'
            // maxWidth='xl'
            onClose={() => {
              this.setState({
                openPreview: false,
              })
            }}
            showFooter={false}
            onConfirm={(e) => {
              this.setState({
                openPreview: false,
              })
            }}
          >
            <div id='test123' />
            {/* <MyDocument /> */}
            {/* <MyDocument /> */}
          </CommonModal>
        )}
      </Paper>
    )
  }
}

export default withStyles(styles, { withTheme: true })(AddCreditNoteGrid)
