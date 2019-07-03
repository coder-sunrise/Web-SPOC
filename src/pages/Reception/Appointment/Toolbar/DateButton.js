import React, { PureComponent } from 'react'
import classnames from 'classnames'
import moment from 'moment'
import { connect } from 'dva'
// material ui
import { Popover, withStyles } from '@material-ui/core'
// react-datetime
import Datetime from 'react-datetime'
// custom component
import { Button } from '@/components'

const styles = () => ({
  dateButton: {
    // marginTop: theme.spacing.unit,
    fontSize: '1.5rem',
    paddingBottom: '8px !important',
  },
})

@connect(({ appointment }) => ({ appointment }))
class DateButton extends PureComponent {
  state = { showOverlay: false, anchor: null }

  onClick = (event) => {
    this.setState({ showOverlay: true, anchor: event.target })
  }

  onClose = () => {
    this.setState({
      showOverlay: false,
      anchor: null,
    })
  }

  onDateChange = (newDate) => {
    const { dispatch } = this.props

    dispatch({ type: 'appointment/dateChange', date: newDate })
    this.setState({
      showOverlay: false,
    })
  }

  render () {
    const { showOverlay, anchor } = this.state
    const { classes, appointment } = this.props

    return (
      <div>
        <Button
          block
          simple
          size='lg'
          className={classnames(classes.dateButton)}
          color='primary'
          onClick={this.onClick}
        >
          {appointment.displayDate}
        </Button>
        <Popover
          id='react-datetime'
          open={showOverlay}
          anchorEl={anchor}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          onClose={this.onClose}
          style={{ width: 500, height: 500 }}
        >
          <Datetime
            onChange={this.onDateChange}
            value={moment(appointment.currentDate)}
            dateFormat='YYYY-MM-DD'
            timeFormat={false}
            input={false}
          />
        </Popover>
      </div>
    )
  }
}

export default withStyles(styles, { name: 'DateButton ' })(DateButton)
