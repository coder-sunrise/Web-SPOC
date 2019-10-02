import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
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
  getBgImage = () => {
    return loginBackground
  }

  render () {
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
