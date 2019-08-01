import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Remove from '@material-ui/icons/Remove'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import {
  CardContainer,
  CommonTableGrid,
  Tooltip,
  Button,
  GridContainer,
  GridItem,
} from '@/components'

const styles = () => ({
  displayDiv: {
    float: 'right',
    padding: '20px',
  },
})

const InventoryTypeListing = ({
  dispatch,
  tableParas,
  colExtensions,
  list,
  classes,
}) => {
  const Cell = ({ column, row, ...p }) => {
    if (column.name === 'Action') {
      return (
        <Table.Cell {...p}>
          <Tooltip title='Remove' placement='bottom'>
            <Button
              size='sm'
              onClick={() => console.log(row)}
              justIcon
              round
              color='primary'
              style={{ marginRight: 5 }}
            >
              <Remove />
            </Button>
          </Tooltip>
        </Table.Cell>
      )
    }
    return <Table.Cell {...p} />
  }
  const TableCell = (p) => Cell({ ...p, dispatch })

  return (
    <CardContainer
      hideHeader
      style={{
        marginLeft: 5,
        marginRight: 5,
      }}
    >
      <GridContainer>
        <GridItem xs={12} md={12}>
          <div className={classes.displayDiv}>
            <p>rerewrwe</p>
          </div>
        </GridItem>
        <GridItem xs={10} md={10}>
          <CommonTableGrid
            {...tableParas}
            columnExtensions={colExtensions}
            rows={list}
            FuncProps={{ pager: false }}
            ActionProps={{ TableCellComponent: TableCell }}
          />
        </GridItem>
        <GridItem xs={10} md={10}>
          <div className={classes.displayDiv}>
            <p>rerewrwe</p>
          </div>
        </GridItem>
      </GridContainer>
    </CardContainer>
  )
}
export default withStyles(styles, { withTheme: true })(InventoryTypeListing)
