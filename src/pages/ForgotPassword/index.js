import React from 'react'
import { connect } from 'dva'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { GridContainer, GridItem, notification } from '@/components'
// sub component
import ResetPassForm from './ResetPasswordForm'
import NewPassForm from './NewPasswordForm'
// medisys component
import { LoadingWrapper } from '@/components/_medisys'
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
    gettingOTP: false,
    firstStepPayload: {
      countryCode: '65',
    },
  }

  handleResetClick = (values) => {
    this.setState({
      gettingOTP: true,
    })
    getOTP(values)
      .then((response) => {
        const { data } = response
        if (data && data.succeeded)
          this.setState({
            step: 2,
            gettingOTP: false,
            firstStepPayload: { ...values },
          })
        else {
          this.setState({
            gettingOTP: false,
          })
        }
      })
      .catch((error) => {
        console.log({ error })
      })
  }

  handleCancelClick = () => {
    this.props.history.push('/user/login')
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
        history.push('/user/login')
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
    const { firstStepPayload, step, gettingOTP } = this.state

    return (
      <div className={classes.container}>
        <GridContainer justify='center'>
          <GridItem md={5}>
            {step === 1 && (
              <ResetPassForm
                loading={gettingOTP}
                payload={firstStepPayload}
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
