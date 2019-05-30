import React, { PureComponent } from 'react'
import { connect } from 'dva'
import router from 'umi/router'
import { withStyles } from '@material-ui/core'
// Login Component
import LoginCard from './LoginCard'
import ApplicationCard from './ApplicationCard'
import NavBar from './NavBar'
import Footer from './Footer'

// Import static files
import authStyle from '../../assets/jss/material-dashboard-pro-react/layouts/authStyle'
import loginBackground from '../../assets/img/login.jpeg'

const styles = (theme) => ({
  ...authStyle(theme),
})
@connect(({ loginSEMR }) => ({ loginSEMR }))
class LoginPage extends PureComponent {
  state = {
    step: 0,
  }

  componentDidMount = () => {
    const haveToken = localStorage.getItem('token')
    haveToken && router.push('reception/queue')
  }

  getBgImage = () => {
    const { route } = this.props
    if (route.path === '/login') {
      return loginBackground
    }
  }

  onLogin = (username, password, application) => {
    const { dispatch } = this.props
    const credential = { username, password }
    dispatch({
      type: 'loginSEMR/getToken',
      credentialPayload: credential,
      application,
    })
      .then((props) => {
        const { payload } = props
        // const { application } = payload
        // payload.status === 200 && router.push('/reception/queue')
        payload.status === 200 && this.setState({ step: 1 })
      })
      .catch((error) => {
        console.log('error', error)
      })
  }

  onLogout = () => {
    localStorage.removeItem('token')
    this.setState({ step: 0 })
  }

  onContinue = (application) => {
    if (application === 'CMS') router.push('/reception/queue')
    else router.push('/emr')
  }

  render () {
    const { step } = this.state
    const { classes, ...rest } = this.props
    return (
      <div className={classes.wrapper}>
        <NavBar {...rest} />
        <div className={classes.content}>
          <div
            className={classes.fullPage}
            style={{ backgroundImage: `url(${this.getBgImage()})` }}
          >
            {step === 0 && <LoginCard handleLogin={this.onLogin} />}
            {step === 1 && (
              <ApplicationCard
                handeLogoutClick={this.onLogout}
                handleContinue={this.onContinue}
              />
            )}
            <Footer fluid />
          </div>
        </div>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(LoginPage)
