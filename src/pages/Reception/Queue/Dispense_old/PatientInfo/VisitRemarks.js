import React, { PureComponent } from 'react'
// material ui
import { Paper, withStyles, Zoom } from '@material-ui/core'
// custom components
import { Button, Transition } from '@/components'
// sub component
import CurrentRemarks from './CurrentRemarks'
import RemarksHistory from './RemarksHistory'

const styles = () => ({
  pageBtnBar: {
    margin: '10px',
    textAlign: 'left',
  },
  contentContainer: {
    display: 'flex',
  },
})

const VIEWS = {
  CURRENT: 'current',
  HISTORY: 'history',
}

class VisitRemarks extends PureComponent {
  state = {
    activeView: VIEWS.CURRENT,
    show: false,
  }

  changeView = (view) => (event) => {
    const { show } = this.state
    this.setState({ activeView: view, show: !show })
  }

  render () {
    const { activeView, show } = this.state
    const { classes, handleCancel } = this.props
    return (
      <React.Fragment>
        <div className={classes.pageBtnBar}>
          <Button
            color='primary'
            onClick={this.changeView(VIEWS.CURRENT)}
            simple={activeView === VIEWS.HISTORY}
          >
            Current
          </Button>
          <Button
            color='primary'
            onClick={this.changeView(VIEWS.HISTORY)}
            simple={activeView === VIEWS.CURRENT}
          >
            History
          </Button>
        </div>

        {activeView === VIEWS.CURRENT && (
          <Transition show={activeView === VIEWS.CURRENT}>
            <CurrentRemarks handleCancel={handleCancel} />
          </Transition>
        )}
        {activeView === VIEWS.HISTORY && (
          <Transition show={activeView === VIEWS.HISTORY}>
            <RemarksHistory />
          </Transition>
        )}
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(VisitRemarks)
