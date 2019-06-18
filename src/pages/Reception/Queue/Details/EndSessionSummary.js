import React, { PureComponent } from 'react'
import classnames from 'classnames'
// umi
import { FormattedMessage } from 'umi/locale'
// material ui
import { Divider, withStyles } from '@material-ui/core'
// custom components
import { Button, CommonTableGrid2 } from '@/components'

const rowData = [
  {
    sessionNo: '190429-01-1.0',
    visitCount: 0,
    totalCharges: 0,
    outstandingBalance: 0,
  },
]

const styles = (theme) => ({
  divider: {
    margin: '10px 0px',
  },
  sectionTitle: {
    padding: theme.spacing.unit,
  },
  buttonGroup: {
    textAlign: 'center',
    marginTop: '10px',
  },
})

class EndSessionSummary extends PureComponent {
  state = {
    summaryTableProps: {
      columns: [
        { name: 'sessionNo', title: 'Session No' },
        { name: 'visitCount', title: 'Visit Count' },
        { name: 'totalCharges', title: 'Total Charges' },
        { name: 'outstandingBalance', title: 'Total O/S Balance' },
      ],
      columnExtensions: [
        { columnName: 'visitCount', type: 'number' },
        { columnName: 'totalCharges', type: 'number', currency: true },
        { columnName: 'outstandingBalance', type: 'number', currency: true },
      ],
    },
    paymentCollectedTableProps: {
      columns: [
        { name: 'mode', title: 'Mode' },
        { name: 'currentSession', title: 'Current Session' },
        { name: 'pastSession', title: 'Past Session' },
        { name: 'subTotal', title: 'Sub Total' },
      ],
    },
  }

  render () {
    const { summaryTableProps, paymentCollectedTableProps } = this.state
    const { classes } = this.props
    return (
      <div>
        <h4 className={classes.sectionTitle}>
          <FormattedMessage id='reception.queue.summaryOfSession' />
        </h4>
        <CommonTableGrid2
          {...summaryTableProps}
          rows={rowData}
          FuncProps={{ pager: false }}
        />
        <Divider className={classnames(classes.divider)} variant='fullWidth' />
        <h4 className={classes.sectionTitle}>
          <FormattedMessage id='reception.queue.paymentCollected' />
        </h4>
        <CommonTableGrid2
          {...paymentCollectedTableProps}
          rows={[]}
          FuncProps={{ pager: false }}
        />
        <div className={classnames(classes.buttonGroup)}>
          <Button color='primary' disabled size='sm'>
            <FormattedMessage id='reception.queue.endSession.printLabel' />
          </Button>
          <Button color='primary' disabled size='sm'>
            <FormattedMessage id='reception.queue.endSession.printSummary' />
          </Button>
          <Button color='primary' disabled size='sm'>
            <FormattedMessage id='reception.queue.endSession.printDetails' />
          </Button>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(EndSessionSummary)
