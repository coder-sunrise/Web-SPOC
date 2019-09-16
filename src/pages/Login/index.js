import React, { PureComponent } from 'react'
import { connect } from 'dva'
import NProgress from 'nprogress'
import router from 'umi/router'
// material ui
import { MuiThemeProvider, withStyles } from '@material-ui/core'
// Login Component
import LoginCard from './LoginCard'
import ApplicationCard from './ApplicationCard'
import NavBar from './NavBar'
import Footer from './Footer'
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

  onLogin = (username, password, clinicCode) => {
    const { dispatch } = this.props
    const credential = { username, password, clinic_code: clinicCode }
    dispatch({
      type: 'login/getToken',
      credentialPayload: credential,
    })
      .then((props) => {
        const { payload } = props
        const validLogin = payload.access_token !== undefined

        if (validLogin) {
          localStorage.setItem('clinicCode', clinicCode)
          router.push('/')
        }
      })
      .catch((error) => {
        console.log('error', error)
      })
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
            <NavBar {...rest} />
            <div className={classes.content}>
              <div
                className={classes.fullPage}
                style={{ backgroundImage: `url(${this.getBgImage()})` }}
              >
                <LoginCard handleLogin={this.onLogin} />

                <Footer fluid />
              </div>
            </div>
          </React.Fragment>
        </SizeContainer>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(LoginPage)
