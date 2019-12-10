import React from 'react'
import { connect } from 'dva'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { CommonModal, Button } from '@/components'

const styles = (theme) => ({
  actionsContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    textAlign: 'center',
  },
})

@connect(({ global }) => ({
  global,
}))
class CustomConfirm extends React.Component {
  onClose = () => {
    this.props.dispatch({
      type: 'global/updateState',
      payload: {
        showCustomConfirm: false,
        customConfirmCfg: undefined,
      },
    })
  }

  onClicks = (callback) => {
    if (callback) callback()
    this.onClose()
  }

  render () {
    const { global, classes } = this.props
    const { customConfirmCfg = {}, showCustomConfirm } = global
    const {
      actions = [],
      content = 'Confirm to proceed',
      title = 'Warning',
    } = customConfirmCfg
    return (
      <CommonModal
        open={showCustomConfirm}
        title={title}
        cancelText='Cancel'
        maxWidth='sm'
        onClose={this.onClose}
      >
        <div style={{ textAlign: 'center' }}>
          <h3>{content}</h3>
        </div>
        <div className={classes.actionsContainer}>
          {actions.map((action) => (
            <Button
              onClick={() => {
                this.onClicks(action.onClick)
              }}
              color={action.color || 'primary'}
            >
              {action.text}
            </Button>
          ))}
        </div>
      </CommonModal>
    )
  }
}

export default withStyles(styles, { name: 'CustomConfirm' })(CustomConfirm)
