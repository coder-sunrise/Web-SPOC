import React from 'react'
import classnames from 'classnames'
import { connect } from 'dva'
import * as Yup from 'yup'
// formik
import { FastField, withFormik } from 'formik'
// umi
import router from 'umi/router'
import { formatMessage, FormattedMessage } from 'umi/locale'
// material ui
import { withStyles } from '@material-ui/core'
import LockOpen from '@material-ui/icons/LockOpen'
import {
  GridContainer,
  GridItem,
  TextField,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Danger,
  Transition,
  ProgressButton,
} from '@/components'

// styles
// import loginPageStyle from '@/assets/jss/material-dashboard-pro-react/views/loginPageStyle'
import { container } from '@/assets/jss'

const styles = (theme) => ({
  // ...loginPageStyle(theme),
  uatText: {
    position: 'absolute',
    width: '100%',
    bottom: '15%',
    color: 'white',
    textAlign: 'center',
    textTransform: 'uppercase',
    zIndex: 99,
  },
  cardHidden: {
    opacity: '0',
    transform: 'translate3d(0, -60px, 0)',
  },
  container: {
    ...container,
    zIndex: '4',
    [theme.breakpoints.down('sm')]: {
      paddingBottom: '100px',
    },
  },
  cardTitle: {
    marginTop: '0',
    minHeight: 'auto',
    fontWeight: '500',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
    color: 'white',
  },
  centerItem: {
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  body: {
    marginBottom: '15px',
    padding: theme.spacing(2),
  },
})

const cardAnimationDuration = 350

const LoginSchema = Yup.object().shape({
  username: Yup.string().trim().required('Please enter Username'),
  password: Yup.string().trim().required('Please enter Password'),
  clinicCode: Yup.string().trim().required('Please enter Clinic Code'),
})

const submitKey = 'login/getToken'

@connect(({ login, routing }) => ({ login, routing }))
@withFormik({
  mapPropsToValues: () => {
    if (process.env.NODE_ENV === 'development')
      return {
        // username: 'Administrator',
        // password: 'admin1234567',
        // clinicCode: '249991e76',
        username: '',
        password: '',
        clinicCode: 'kikilala',
      }
    return { username: '', password: '', clinicCode: '' }
  },
  handleSubmit: (values, { props }) => {
    const { username, password, clinicCode } = values
    const { dispatch, routing } = props
    const { location } = routing

    const credential = { username, password, clinicCode }
    const loginDestination = '/reception/queue' // always land at reception/queue

    // if (location.query && location.query.redirect !== undefined) {
    //   loginDestination = location.query.redirect
    // }

    dispatch({
      type: 'login/getToken',
      credentialPayload: credential,
    })
      .then((result) => {
        const { payload } = result
        const validLogin = payload.access_token !== undefined

        if (validLogin) {
          dispatch({
            type: 'global/updateState',
            payload: {
              showSessionTimeout: false,
            },
          })
          localStorage.setItem('clinicCode', clinicCode)
          router.push(loginDestination)
        }
      })
      .catch((error) => {
        console.log('error', error)
      })
  },
  validationSchema: LoginSchema,
})
class NewLogin extends React.Component {
  state = {
    cardAnimation: 'cardHidden',
  }

  componentDidMount () {
    // add a hidden class to the card and after 700 ms we delete it and the transition appears
    this.timeOutFunction = setTimeout(() => {
      this.setState({ cardAnimation: '' })
    }, cardAnimationDuration)

    // bind keyDown listener to document
    // document.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount () {
    clearTimeout(this.timeOutFunction)
    this.timeOutFunction = null

    // unbind keyDown listener
    // document.removeEventListener('keydown', this.handleKeyDown)
  }

  handleKeyDown = (event) => {
    const ENTER_KEY = 13
    switch (event.keyCode) {
      case ENTER_KEY:
        this.onEnterPressed()
        break
      default:
        break
    }
  }

  onEnterPressed = () => {
    const { handleSubmit } = this.props
    // console.log({ values: this.props.values })
    handleSubmit()
  }

  onForgotPasswordClick = () => {
    router.push('/login/forgotpassword')
  }

  render () {
    const { classes, login = { isInvalidLogin: false } } = this.props
    const { isInvalidLogin } = login
    const { cardAnimation } = this.state
    return (
      <React.Fragment>
        <div className={classes.container}>
          <GridContainer justify='center'>
            <GridItem md={4}>
              <Card login className={classes[cardAnimation]}>
                <CardHeader
                  className={`${classes.cardHeader} ${classes.textCenter}`}
                  color='primary'
                >
                  <h3 className={classes.cardTitle}>Login</h3>
                  <h3>
                    <FormattedMessage id='app.login.title' />
                  </h3>
                </CardHeader>

                <CardBody className={classnames(classes.body)}>
                  {isInvalidLogin && (
                    <Transition show={isInvalidLogin}>
                      <div style={{ textAlign: 'center' }}>
                        <Danger>
                          <h4>
                            <FormattedMessage id='app.login.message-invalid-credentials' />
                          </h4>
                          <p>
                            <FormattedMessage id='app.login.message-invalid-credentials-info' />
                          </p>
                        </Danger>
                      </div>
                    </Transition>
                  )}
                  <FastField
                    name='username'
                    render={(args) => (
                      <TextField
                        {...args}
                        label={formatMessage({ id: 'app.login.username' })}
                      />
                    )}
                  />
                  <FastField
                    name='password'
                    render={(args) => (
                      <TextField
                        {...args}
                        type='password'
                        label={formatMessage({ id: 'app.login.password' })}
                      />
                    )}
                  />
                  <FastField
                    name='clinicCode'
                    render={(args) => (
                      <TextField
                        {...args}
                        label={formatMessage({ id: 'app.login.clinicCode' })}
                      />
                    )}
                  />
                </CardBody>
                <CardFooter
                  className={classnames(classes.justifyContentCenter)}
                >
                  <GridContainer>
                    <GridItem md={12}>
                      <ProgressButton
                        submitKey={submitKey}
                        text='Enter'
                        icon={<LockOpen />}
                        block
                        color='primary'
                        onClick={this.onEnterPressed}
                      />
                    </GridItem>
                    <GridItem
                      md={12}
                      style={{ marginTop: 12, textAlign: 'right' }}
                    >
                      <a onClick={this.onForgotPasswordClick}>
                        Forgot Password
                      </a>
                    </GridItem>
                  </GridContainer>
                </CardFooter>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
        {process.env.client_env === 'uat' && (
          <h3 className={classes.uatText}>
            THIS IS TRIAL ENVIRONMENT. DO NOT USE REAL PATIENT DATA
          </h3>
        )}
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(NewLogin)
