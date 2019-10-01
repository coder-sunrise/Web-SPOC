import React from 'react'
import { connect } from 'dva'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { GridContainer, GridItem } from '@/components'
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
    payload: {},
  }

  handleResetClick = (values) => {
    getOTP(values).then((response) => {
      console.log({ response })

      this.setState({
        step: 2,
      })
    })
  }

  handleCancelClick = () => {}

  handleBackClick = () => {
    this.setState({ step: 1 })
  }

  handleChangePasswordClick = () => {}

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
