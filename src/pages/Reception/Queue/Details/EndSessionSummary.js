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
    visitCount: 10,
    totalCharges: 400,
    outstandingBalance: 20,
  },
]

const styles = () => ({
  divider: {
    margin: '10px 0px',
  },
  buttonGroup: {
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
        <h4>
          <FormattedMessage id='reception.queue.summaryOfSession' />
        </h4>
        <CommonTableGrid2
          {...summaryTableProps}
          rows={rowData}
          FuncProps={{ pager: false }}
        />
        <Divider className={classnames(classes.divider)} variant='fullWidth' />
        <h4>
          <FormattedMessage id='reception.queue.paymentCollected' />
        </h4>
        <CommonTableGrid2
          {...paymentCollectedTableProps}
          rows={[]}
          FuncProps={{ pager: false }}
        />
        <div className={classnames(classes.buttonGroup)}>
          <Button>
            <FormattedMessage id='reception.queue.endSession.printLabel' />
          </Button>
          <Button>
            <FormattedMessage id='reception.queue.endSession.printSummary' />
          </Button>
          <Button>
            <FormattedMessage id='reception.queue.endSession.printDetails' />
          </Button>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(EndSessionSummary)
