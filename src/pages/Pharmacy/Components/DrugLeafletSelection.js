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
      columnName: 'print',
      align: 'center',
      width: 80,
      render: row => {
        return (
          <Checkbox
            onChange={obj => {
              handleDrugLabelSelected(row.id, obj.target.value)
            }}
            checked={row.selected}
            simple
          />
        )
      },
    },
    {
      columnName: 'item',
      disabled: true,
      render: row => {
        return (
          <div style={{ position: 'relative' }}>
            <div
              style={{
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap',
              }}
            >
              {row.item}
            </div>
          </div>
        )
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
    dispatch({
      type: 'pharmacyDetails/queryLeafletDrugList',
      payload: {
        id: visitid,
      },
    }).then(r => {
      if (r) {
        this.setState({
          data: r.map(x => {
            return { ...x, isDeleted: false }
          }),
        })
      }
    })
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
      classes,
      showInvoiceAmountNegativeWarning,
    } = this.props
    return (
      <div>
        <GridContainer>
          <GridItem md={12}>
            {this.state.data && (
              <div className={classes.tableContainer}>
                <EditableTableGrid
                  size='sm'
                  forceRender
                  columns={this.columns}
                  columnExtensions={this.colExtensions}
                  rows={this.state.data}
                  {...this.tableConfig}
                  selection={this.state.selectedRows}
                  onSelectionChange={this.handleSelectionChange}
                  EditingProps={{
                    showAddCommand: false,
                    showDeleteCommand: false,
                    onCommitChanges: this.handleCommitChanges,
                    showCommandColumn: false,
                  }}
                />
              </div>
            )}
          </GridItem>
        </GridContainer>
        {footer({
          onConfirm: () => {
            const { selectedRows, data } = this.state
            const selectedData = data.filter(item =>
              selectedRows.includes(item.id),
            )

            let printData = selectedData.reduce((pre, cur) => {
              let itemData = this.props.data.filter(x => x.item === cur.item)
              return [...pre, ...itemData.map(i => ({ ...i }))]
            }, [])
            onConfirmPrintLeaflet(printData)
          },
          confirmBtnText: 'Confirm',
        })}
      </div>
    )
  }
}

export default DrugLeafletSelection
