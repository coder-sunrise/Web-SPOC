import React from 'react'
import classnames from 'classnames'
// material ui
import { withStyles } from '@material-ui/core'

const styles = () => ({
  statusContainer: {
    display: 'inline-block',
    backgroundColor: '#999', // default color
    color: 'white',
    fontSize: '1rem',
    fontWeight: '700',
    textAlign: 'center',
    borderRadius: '10px',
    textTransform: 'uppercase',
    verticalAlign: 'baseline',
    padding: '5px',
    lineHeight: 1,
    margin: '15px 0',
  },
  statusDraft: {
    backgroundColor: '#00acc1',
  },
  statusFinalized: {
    backgroundColor: '#25bc29',
  },
})

const StatusIndicator = ({ classes, status }) => {
  const statusIndicatorClasses = classnames({
    [classes.statusContainer]: true,
    [classes.statusDraft]: status === 'draft',
    [classes.statusFinalized]: status === 'finalized',
  })

  return (
    <div className={statusIndicatorClasses}>
      <p style={{ margin: '5px' }}>{status}</p>
    </div>
  )
}

export default withStyles(styles)(StatusIndicator)
