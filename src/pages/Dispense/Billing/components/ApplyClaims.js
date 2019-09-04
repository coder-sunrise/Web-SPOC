import React from 'react'
// material ui
import { Paper, withStyles } from '@material-ui/core'
import Edit from '@material-ui/icons/Edit'
import Add from '@material-ui/icons/AddCircle'
import Reset from '@material-ui/icons/Cached'
// common components
import { Button, GridItem } from '@/components'
// sub components
import TableData from '../../DispenseDetails/TableData'
import {
  ItemData,
  ItemTableColumn,
  ItemTableColumnExtensions,
} from '../variables'

const styles = (theme) => ({
  gridRow: {
    margin: theme.spacing.unit,
    paddingBottom: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,

    '& > h5': {
      paddingTop: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
    },
  },
})

const ApplyClaims = ({
  classes,
  handleClaimSeqClick,
  handleCoPaymentClick,
}) => {
  return (
    <React.Fragment>
      <GridItem md={2}>
        <h5>Apply Claims</h5>
      </GridItem>
      <GridItem md={10} container justify='flex-end'>
        <Button color='primary' size='sm' onClick={handleClaimSeqClick}>
          <Edit />
          Claim Seq
        </Button>
        <Button color='primary' size='sm' onClick={handleCoPaymentClick}>
          <Add />
          Co-Payment
        </Button>
        <Button color='primary' size='sm' disabled>
          <Reset />
          Reset
        </Button>
      </GridItem>
      <GridItem md={12}>
        <Paper className={classes.gridRow}>
          <TableData
            height={200}
            columns={ItemTableColumn}
            colExtensions={ItemTableColumnExtensions}
            data={ItemData}
            title='Corporate A'
          />
        </Paper>
      </GridItem>
      <GridItem md={12}>
        <Paper className={classes.gridRow}>
          <TableData
            height={200}
            columns={ItemTableColumn}
            colExtensions={ItemTableColumnExtensions}
            data={ItemData}
            title='Corporate B'
          />
        </Paper>
      </GridItem>
    </React.Fragment>
  )
}

export default withStyles(styles, { name: 'ApplyClaims' })(ApplyClaims)
