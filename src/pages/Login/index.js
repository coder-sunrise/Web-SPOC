import React, { PureComponent } from 'react'
import { connect } from 'dva'
import router from 'umi/router'
import { withStyles } from '@material-ui/core'
// Login Component
import LoginCard from './LoginCard'
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
  componentDidMount = () => {
    const haveToken = sessionStorage.getItem('token')
    haveToken && router.push('reception/queue')
  }

  getBgImage = () => {
    const { route } = this.props
    if (route.path === '/login') {
      return loginBackground
    }
  }

  onLogin = (username, password) => {
    const { dispatch } = this.props
    const credential = { username, password }
    dispatch({
      type: 'loginSEMR/getToken',
      payload: credential,
    })
    // .then((props) => {
    //   const { payload } = props
    //   console.log('payload', payload)
    //   payload.status === 200 && router.push('/reception/queue')
    // })
    // .catch((error) => {
    //   console.log('error', error)
    // })
  }

  render () {
    const { classes, ...rest } = this.props
    return (
      <div className={classes.wrapper}>
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
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(LoginPage)
