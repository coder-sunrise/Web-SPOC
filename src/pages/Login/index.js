import React, { PureComponent } from 'react'
import { connect } from 'dva'
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
@connect(({ loginSEMR }) => ({ loginSEMR }))
class LoginPage extends PureComponent {
  componentDidMount = () => {
    const haveToken = localStorage.getItem('token')
    haveToken && router.push('/')
  }

  getBgImage = () => {
    return loginBackground
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
        payload.status === 200 && router.push('/')
      })
      .catch((error) => {
        console.log('error', error)
      })
  }

  render () {
    const { classes, ...rest } = this.props
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
