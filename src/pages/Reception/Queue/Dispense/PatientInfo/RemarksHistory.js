import React, { PureComponent } from 'react'
// material ui
import { Paper, withStyles } from '@material-ui/core'
import { Accordion } from '@/components'
// sub components
import CurrentRemarks from './CurrentRemarks'

const styles = (theme) => ({
  paperSpacing: {
    margin: theme.spacing.unit,
    padding: theme.spacing.unit * 2,
  },
})

class RemarksHistory extends PureComponent {
  render () {
    const { classes } = this.props
    return (
      <Paper className={classes.paperSpacing}>
        <Accordion
          active={0}
          collapses={[
            {
              title: '25 Sep 2018',
              content: <CurrentRemarks readOnly />,
            },
            {
              title: '15 Oct 2018',
              content: <CurrentRemarks readOnly />,
            },
            {
              title: '22 January 2019',
              content: <CurrentRemarks readOnly />,
            },
          ]}
        />
      </Paper>
    )
  }
}

export default withStyles(styles)(RemarksHistory)
