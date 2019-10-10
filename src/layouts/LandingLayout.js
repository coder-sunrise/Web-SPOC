import React from 'react'
import NProgress from 'nprogress'
// material ui
import { withStyles } from '@material-ui/core'
// umi
import router from 'umi/router'
// common component
import { SizeContainer } from '@/components'
// medisys
import { LoginNavbar } from '@/components/_medisys'
// Import static files
import authStyle from '@/assets/jss/material-dashboard-pro-react/layouts/authStyle'
import loginBackground from '@/assets/img/login.jpeg'

const styles = (theme) => ({
  ...authStyle(theme),
})

class LandingLayout extends React.Component {
  componentWillMount () {
    const token = localStorage.getItem('token')
    if (token !== null) {
      router.push('/')
    }
  }

  getBgImage = () => {
    return loginBackground
  }

  render () {
    NProgress.done()
    const { children, classes } = this.props
    return (
      <div className={classes.wrapper}>
        <SizeContainer size='lg'>
          <React.Fragment>
            <LoginNavbar {...this.props} />
            <div className={classes.content}>
              <div
                className={classes.fullPage}
                style={{ backgroundImage: `url(${this.getBgImage()})` }}
              >
                {children}
              </div>
            </div>
          </React.Fragment>
        </SizeContainer>
      </div>
    )
  }
}

export default withStyles(styles)(LandingLayout)
