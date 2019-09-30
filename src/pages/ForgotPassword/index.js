import React, { PureComponent } from 'react'
import { connect } from 'dva'
import NProgress from 'nprogress'
import router from 'umi/router'
// material ui
import { MuiThemeProvider, withStyles } from '@material-ui/core'
// Login Component
import LoginCard from './LoginCard'
import NavBar from './NavBar'
import { SizeContainer } from '@/components'
// Import static files
import authStyle from '../../assets/jss/material-dashboard-pro-react/layouts/authStyle'
import loginBackground from '../../assets/img/login.jpeg'

const styles = (theme) => ({
  ...authStyle(theme),
})
@connect(({ login, loading, global }) => ({ login, loading, global }))
class LoginPage extends PureComponent {
  getBgImage = () => {
    return loginBackground
  }

  render () {
    const { classes, loading, ...rest } = this.props
    NProgress.start()
    if (!loading.global) {
      NProgress.done()
    }
    return (
      <div className={classes.wrapper}>
        <SizeContainer size='lg'>
          <React.Fragment>
            <div>Forgot Password</div>
          </React.Fragment>
        </SizeContainer>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(LoginPage)
