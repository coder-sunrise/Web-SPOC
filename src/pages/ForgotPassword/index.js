import React from 'react'
import { connect } from 'dva'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { GridContainer, GridItem, notification } from '@/components'
// sub component
import ResetPassForm from './ResetPasswordForm'
import NewPassForm from './NewPasswordForm'
// services
import { getOTP, resetPassword } from '@/services/user'
// styles
import { container } from '@/assets/jss'

const styles = (theme) => ({
  container: {
    ...container,
    zIndex: '4',
    [theme.breakpoints.down('sm')]: {
      paddingBottom: '100px',
    },
  },
})

@connect(({ login, loading, global }) => ({ login, loading, global }))
class ForgotPassword extends React.Component {
  state = {
    step: 1,
    firstStepPayload: {},
  }

  handleResetClick = (values) => {
    getOTP(values).then((response) => {
      const { data } = response
      if (data && data.succeeded)
        this.setState({
          step: 2,
          firstStepPayload: { ...values },
        })

      if (!response) {
        notification.error({
          message: 'Please wait one minute to get validation code again',
        })
      }
    })
  }

  handleCancelClick = () => {
    this.props.history.push('/login')
  }

  handleBackClick = () => {
    this.setState({ step: 1 })
  }

  handleChangePasswordClick = (values) => {
    const { firstStepPayload } = this.state
    const { history } = this.props
    resetPassword({ ...firstStepPayload, ...values }).then((response) => {
      const { data } = response
      if (data && data.succeeded) {
        notification.success({
          message: 'Reset password success',
        })
        history.push('/login')
      }

      if (!response) {
        notification.error({
          message: 'Failed to reset password',
        })
      }
    })
  }

  handleResendOTP = () => this.handleResetClick(this.state.firstStepPayload)

  render () {
    const { classes } = this.props
    const { step } = this.state

    return (
      <div className={classes.container}>
        <GridContainer justify='center'>
          <GridItem md={5}>
            {step === 1 && (
              <ResetPassForm
                onCancelClick={this.handleCancelClick}
                onResetClick={this.handleResetClick}
              />
            )}
            {step === 2 && (
              <NewPassForm
                onBackClick={this.handleBackClick}
                onResendClick={this.handleResendOTP}
                onChangePasswordClick={this.handleChangePasswordClick}
              />
            )}
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(ForgotPassword)
