import React from 'react'
import * as Yup from 'yup'
// common components
import { withStyles } from '@material-ui/core'
import {
  GridContainer,
  GridItem,
  NumberInput,
  Checkbox,
  EditableTableGrid,
  CommonTableGrid,
} from '@/components'
import { Alert } from 'antd'

class DrugLeafletSelection extends React.PureComponent {
  state = {
    data: [],
    selectedRows: [],
  }
  columns = [
    {
      name: 'displayName',
      title: 'Item',
    },
  ]
  colExtensions = [
    {
      columnName: 'displayName',
      render: row => {
        console.log(row)
        return <div>{row.displayName}</div>
      },
    },
  ]

  tableConfig = {
    FuncProps: {
      pager: false,
      selectable: true,
      selectConfig: {
        showSelectAll: true,
        selectByRowClick: false,
        rowSelectionEnabled: () => true,
      },
    },
  }
  componentWillMount = () => {
    let { visitid, dispatch } = this.props
  }
  constructor(props) {
    super(props)
  }

  handleSelectionChange = rows => {
    this.setState(() => ({
      selectedRows: rows,
    }))
  }

  handleCommitChanges = ({ rows }) => {
    this.setState({
      data: [...rows],
    })
  }

  render() {
    const {
      onConfirmPrintLeaflet,
      footer,
      rows,
      classes,
      showInvoiceAmountNegativeWarning,
    } = this.props
    return (
      <div>
        <GridContainer>
          <GridItem md={12}>
            {this.state.data && (
              <div className={classes.tableContainer}>
                <CommonTableGrid
                  size='sm'
                  columns={this.columns}
                  columnExtensions={this.colExtensions}
                  rows={rows}
                  {...this.tableConfig}
                  selection={this.state.selectedRows}
                  onSelectionChange={this.handleSelectionChange}
                />
              </div>
            )}
          </GridItem>
        </GridContainer>
        {footer({
          onConfirm: () => {
            const { selectedRows } = this.state
            const selectedData = rows.filter(item =>
              selectedRows.includes(item.id),
            )
            onConfirmPrintLeaflet(selectedData)
          },
          confirmBtnText: 'Confirm',
        })}
      </div>
    )
  }
}

export default DrugLeafletSelection
