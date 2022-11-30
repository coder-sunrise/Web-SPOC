import React, { useEffect } from 'react'
import { withStyles } from '@material-ui/core'
import { connect } from 'dva'
import color from 'color'
// umi
import { FormattedMessage, history } from 'umi'
import withWebSocket from '@/components/Decorator/withWebSocket'
import { useMsal } from '@azure/msal-react'
import { reloadAuthorized } from '@/utils/Authorized'
import {
  ProgressButton,
  GridItem,
  GridContainer,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Danger,
  Transition,
} from '@/components'
import { compose } from 'redux'
import classnames from 'classnames'
import LockOpen from '@material-ui/icons/LockOpen'
import { loginRequest } from '../../../config/authConfig'
// styles
// import loginPageStyle from '@/assets/jss/material-dashboard-pro-react/views/loginPageStyle'
import logo from '@/assets/img/logo/logo_white_with_text.png'
import { container } from '@/assets/jss'

const styles = theme => ({
  // ...loginPageStyle(theme),
  uatText: {
    width: '100%',
    // marginTop: theme.spacing(4),
    position: 'absolute',
    top: '5%',
    left: 0,
    color: 'red',
    fontWeight: 700,
    textAlign: 'center',
    textTransform: 'uppercase',
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
  textCenter: {
    textAlign: 'center',
  },
  cardTitle: {
    marginTop: '0',
    minHeight: 'auto',
    fontWeight: '500',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
    textAlign: 'center',
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
  loginButton: {
    backgroundColor: '#0093f1',
    '&:hover': {
      // backgroundColor: color('#0093f1').darken(0.2).hex(),
    },
  },
  imgHolder: {
    padding: '15px 24px !important',
  },
})
const MicrsoftLogin = ({
  theme,
  classes,
  dispatch,
  versionCheck,
  login = { isInvalidLogin: false },
}) => {
  const submitKey = 'login/getToken'
  const loginDestination = '/reception/queue' // always land at reception/queue
  const clinicCode = process.env.default_cliniccode
  const { instance, accounts } = useMsal()
  const { isInvalidLogin } = login

  const onEnterPressed = () => {
    instance.loginRedirect()
  }

  function timeout(number) {
    return new Promise(res => setTimeout(res, number))
  }

  useEffect(() => {
    if (accounts.length > 0) {
      const request = {
        ...loginRequest,
        account: accounts[0],
      }

      // Silently acquires an access token which is then attached to a request for Microsoft Graph data
      instance
        .acquireTokenSilent(request)
        .then(resp => {
          const { account } = resp
          const { idTokenClaims } = account

          localStorage.setItem('token', resp.accessToken)
          localStorage.setItem('aadUserAccount', account.homeAccountId)
          localStorage.setItem('loginHint', idTokenClaims.login_hint)

          dispatch({
            type: 'login/getToken',
            credentialPayload: {
              username: account.username, // username
              password: resp.uniqueId, // oid
              clinicCode: clinicCode,
            },
          })
            .then(async result => {
              const { payload } = result
              const validLogin = payload.access_token !== undefined
              if (validLogin) {
                dispatch({
                  type: 'global/updateState',
                  payload: {
                    showSessionTimeout: false,
                  },
                })
                await dispatch({
                  type: 'clinicSettings/query',
                })
                localStorage.setItem('clinicCode', clinicCode)
                await dispatch({
                  type: 'clinicInfo/query',
                  payload: { clinicCode },
                })

                await dispatch({
                  type: 'user/fetchCurrent',
                })

                reloadAuthorized()
                try {
                  await versionCheck()
                } catch {
                  console.log('Printing tool auto upgrade did not trigger.')
                }
                history.push(loginDestination)

                dispatch({
                  type: 'appNotification/loadNotifications',
                  payload: { isRead: false },
                })
              } else {
                await timeout(3000)
                localStorage.removeItem('token')
                localStorage.removeItem('aadUserAccount')
                instance.logoutRedirect()
              }
            })
            .catch(error => {
              localStorage.removeItem('token')
              localStorage.removeItem('aadUserAccount')
              console.log('error', error)
            })
        })
        .catch(e => {
          console.log('Unable to get token')
        })
    }
  }, [accounts])

  return (
    <React.Fragment>
      <div className={classes.container}>
        {process.env.client_env === 'uat' && (
          <h2 className={classes.uatText}>
            THIS IS TRIAL ENVIRONMENT. DO NOT USE REAL PATIENT DATA.
          </h2>
        )}
        <GridContainer justify='center'>
          <GridItem md={4}>
            <Card login>
              <CardHeader
                className={`${classes.cardHeader} ${classes.textCenter} ${classes.imgHolder}`}
                color='login'
              >
                <img
                  src={logo}
                  alt='logo'
                  style={{ width: '100%', objectFit: 'cover' }}
                />
              </CardHeader>
              <CardBody className={classnames(classes.body)}>
                {isInvalidLogin && (
                  <Transition show={isInvalidLogin}>
                    <div style={{ textAlign: 'center' }}>
                      <Danger>
                        <h4>
                          <FormattedMessage id='app.login.message-maad-invalid-credentials' />
                        </h4>
                        <p>
                          <FormattedMessage id='app.login.message-maad-invalid-credentials-info' />
                        </p>
                      </Danger>
                    </div>
                  </Transition>
                )}
              </CardBody>
              <CardFooter className={classnames(classes.justifyContentCenter)}>
                <GridContainer>
                  <GridItem md={12} style={{ marginBottom: 20 }}>
                    <ProgressButton
                      submitKey={submitKey}
                      text='Sign In'
                      icon={<LockOpen />}
                      block
                      color='login'
                      onClick={onEnterPressed}
                    />
                  </GridItem>
                </GridContainer>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    </React.Fragment>
  )
}

export default compose(
  withWebSocket(),
  withStyles(styles, { withTheme: true }),
  connect(({ login, routing }) => ({
    login,
    routing,
  })),
)(MicrsoftLogin)
