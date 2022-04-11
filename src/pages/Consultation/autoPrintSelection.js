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
import styles from './style'
import { Alert } from 'antd';

class AutoPrintSelection extends React.PureComponent {
  columns = [
    {
      name: 'item',
      title: 'Item',
    },
    {
      name: 'Copies',
      title: 'Copies',
    },
  ]

  colExtensions = [
    {
      columnName: 'item',
      disabled: true,
      render: (row) => {
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
    {
      columnName: 'Copies',
      type: 'number',
      width: 80,
      precision: 0,
      min: 1,
      // render: (row) => {
      //   return (
      //     <p>
      //       <NumberInput
      //         max={99}
      //         precision={0}
      //         min={1}
      //         value={row.Copies}
      //         defaultValue={1}
      //         onChange={(event) => {
      //           this.setState((prevState) => ({
      //             data: prevState.data.map((item) => row.id === item.id ? (
      //               {
      //                 ...item,
      //                 Copies: event.target.value,
      //               }) : item),
      //           }))
      //         }}
      //       />
      //     </p>
      //   )
      // },
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

  constructor (props) {
    super(props)
    let id = 0
    let data = props.data.reduce((pre, cur) => {
      let filterData = pre.filter((x) => x.item === cur.item)
      if (filterData && filterData.length > 0) {
        return pre
      }
      id += 1
      return [
        ...pre,
        { item: cur.item, Copies: cur.Copies, id: cur.item },
      ]
    }, [])
    this.state = {
      selectedRows: data.map((item) => item.id),
      data,
    }
  }

  handleSelectionChange = (rows) => {
    this.setState(() => ({
      selectedRows: rows,
    }))
  }

  handleCommitChanges = ({ rows }) => {
    this.setState({
      data: [
        ...rows,
      ],
    })
  }

  render () {
    const { handleSubmit, footer, classes, showInvoiceAmountNegativeWarning, triggerBy } = this.props
    const validationSchema = Yup.object().shape({
      Copies: Yup.number().min(1),
    })
    return (
      <div>
        <GridContainer>
          <GridItem md={12}>
            {this.state.data && (
              <div className={classes.tableContainer}>
                {showInvoiceAmountNegativeWarning ? <Alert style={{ padding: '5px 15px 5px 37px', marginBottom: '5px' }} message="Total invoice amount is negative." banner /> : undefined}
                <h5>{`Print the following document after ${triggerBy} `}</h5>
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
                  schema={validationSchema}
                />
              </div>
            )}
          </GridItem>
        </GridContainer>
        {footer({
          onConfirm: () => {
            const { selectedRows, data } = this.state

            const selectedData = data.filter((item) =>
              selectedRows.includes(item.id),
            )

            let printData = selectedData.reduce((pre, cur) => {
              let itemData = this.props.data.filter((x) => x.item === cur.item)
              return [
                ...pre,
                ...itemData.map((i) => ({ ...i, Copies: cur.Copies })),
              ]
            }, [])
            handleSubmit(printData)
          },
          confirmBtnText: 'Confirm',
        })}
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(AutoPrintSelection)
