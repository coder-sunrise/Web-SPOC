import React, { PureComponent } from 'react'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { Tooltip, withStyles } from '@material-ui/core'
import { Edit, Search } from '@material-ui/icons'
// import tooltipsStyle from 'assets/jss/material-kit-pro-react/tooltipsStyle.jsx'
import { Button, CommonTableGrid2 } from '@/components'

class Grid extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      pageSizes: [
        5,
        10,
        15,
      ],
      selection: [],
      showDepositRefundModal: false,
    }
  }

  componentDidMount () {
    const { type, dispatch } = this.props
    dispatch({
      type: `${type}/query`,
    })
  }

  showDetail = (row, vmode) => () => {
    const { type } = this.props
    this.props.history.push(
      `/inventory/master/${type}?uid=${row.Id}&vmode=${vmode}`,
    )
  }

  Cell = ({ column, row, dispatch, classes, ...props }) => {
    if (column.name === 'Action') {
      return (
        <Table.Cell {...props}>
          <Tooltip title='Detail' placement='bottom'>
            <Button
              size='sm'
              onClick={this.showDetail(row)}
              justIcon
              round
              color='primary'
              style={{ marginRight: 5 }}
            >
              <Search />
            </Button>
          </Tooltip>
          <Tooltip title='Edit' placement='bottom'>
            <Button
              size='sm'
              onClick={this.showDetail(row, 1)}
              justIcon
              round
              color='primary'
              style={{ marginRight: 5 }}
            >
              <Edit />
            </Button>
          </Tooltip>
        </Table.Cell>
      )
    }
    return <Table.Cell {...props} />
  }

  render () {
    const { tableParas, colExtensions, type, dispatch } = this.props
    const { list } = this.props[type]
    const TableCell = (p) => this.Cell({ ...p, dispatch })
    const ActionProps = { TableCellComponent: TableCell }

    return (
      <React.Fragment>
        <CommonTableGrid2
          rows={list}
          columnExtensions={colExtensions}
          ActionProps={ActionProps}
          FuncProps={{ pager: true }}
          {...tableParas}
        />
      </React.Fragment>
    )
  }
}

export default Grid
