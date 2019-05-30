import React from 'react'
import classnames from 'classnames'
import { FastField, withFormik } from 'formik'
import { FormattedMessage } from 'umi/locale'
// material ui
import { withStyles } from '@material-ui/core'
import { LockOpen } from '@material-ui/icons'
// custom components
import {
  GridContainer,
  GridItem,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  ProgressButton,
  Button,
  Select,
} from '@/components'

import loginPageStyle from '../../assets/jss/material-dashboard-pro-react/views/loginPageStyle'

const styles = (theme) => ({
  ...loginPageStyle(theme),
  centerItem: {
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  body: {
    marginBottom: '15px',
  },
})

const APPLICATIONS = {
  CMS: 'CMS',
  EMR: 'EMR',
}

const optsApplication = [
  { name: 'CMS', value: 'CMS' },
  { name: 'EMR', value: 'EMR' },
]

const cardAnimationDuration = 350

@withFormik({
  mapPropsToValues: () => {
    return { application: 'CMS' }
  },
})
class ApplicationCard extends React.PureComponent {
  state = {
    cardAnimation: 'cardHidden',
  }

  componentDidMount () {
    // add a hidden class to the card and after 700 ms we delete it and the transition appears
    this.timeOutFunction = setTimeout(() => {
      this.setState({ cardAnimation: '' })
    }, cardAnimationDuration)
  }

  onContinueClick = () => {
    const { handleContinue, values } = this.props
    handleContinue(values.application)
  }

  render () {
    const { cardAnimation } = this.state
    const { classes, handeLogoutClick } = this.props
    return (
      <div className={classnames(classes.container)}>
        <GridContainer justify='center'>
          <GridItem xs={12} sm={6} md={4}>
            <Card login className={classes[cardAnimation]}>
              <CardHeader
                className={`${classes.cardHeader} ${classes.textCenter}`}
                color='rose'
              >
                <h3 className={classes.cardTitle}>Welcome</h3>
                <p>
                  <FormattedMessage id='app.login.title' />
                </p>
              </CardHeader>

              <CardBody className={classnames(classes.body)}>
                <h4 style={{ textAlign: 'center' }}>
                  Please choose your login application
                </h4>
                <FastField
                  name='application'
                  render={(args) => (
                    <Select
                      {...args}
                      label='Application'
                      options={optsApplication}
                      allowClear={false}
                    />
                  )}
                />
              </CardBody>
              <CardFooter className={classnames(classes.justifyContentCenter)}>
                <Button
                  simple
                  color='danger'
                  size='lg'
                  onClick={handeLogoutClick}
                >
                  Logout
                </Button>
                <Button
                  simple
                  color='rose'
                  size='lg'
                  onClick={this.onContinueClick}
                >
                  Continue
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default withStyles(styles, { name: 'ApplicationCard' })(ApplicationCard)
