import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
import * as Yup from 'yup'
// formik
import { withFormik, FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  GridContainer,
  GridItem,
  TextField,
  NumberInput,
} from '@/components'
// styles
import { container } from '@/assets/jss'

const styles = (theme) => ({
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
    '& h4': {
      color: 'white',
    },
  },
  textCenter: {
    textAlign: 'center',
  },
  buttonRow: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
  otpBtn: {
    marginRight: 0,
    marginBottom: theme.spacing(0.5),
  },
})

// let _timer
const NewPasswordForm = ({
  classes,
  onBackClick,
  handleSubmit,
  onResendClick,
}) => {
  const headerClass = classnames({
    [classes.textCenter]: true,
    [classes.cardTitle]: true,
  })
  const [
    countdownTime,
    setCountdownTime,
  ] = useState(60)

  useEffect(
    () => {
      // exit early when we reach 0
      if (!countdownTime) return () => {}

      const _timer = setInterval(() => {
        if (countdownTime > 0) setCountdownTime(countdownTime - 1)
      }, 1000)
      return () => clearInterval(_timer)
    },
    [
      countdownTime,
    ],
  )
  const handleResendClick = () => {
    setCountdownTime(60)
    onResendClick()
  }

  return (
    <Card login>
      <CardHeader color='login' className={headerClass}>
        <h3>Reset Your Password</h3>
      </CardHeader>
      <CardBody>
        <GridContainer alignItems='flex-end'>
          <GridItem md={6}>
            <FastField
              name='validationCode'
              render={(args) => (
                <TextField {...args} autoFocus label='OTP' autocomplete='off' />
              )}
            />
          </GridItem>
          <GridItem md={4}>
            <Button
              size='sm'
              color='primary'
              className={classes.otpBtn}
              disabled={countdownTime > 0}
              onClick={handleResendClick}
            >
              Resend OTP ({countdownTime})
            </Button>
          </GridItem>
          <GridItem md={12}>
            <FastField
              name='newPassword'
              render={(args) => (
                <TextField
                  {...args}
                  inputProps={{ autoComplete: 'new-password' }}
                  autocomplete='off'
                  label='New Password'
                  type='password'
                />
              )}
            />
          </GridItem>
          <GridItem md={12}>
            <FastField
              name='confirmPassword'
              render={(args) => (
                <TextField
                  {...args}
                  inputProps={{ autoComplete: 'new-password' }}
                  autocomplete='off'
                  label='Re-enter New Password'
                  type='password'
                />
              )}
            />
          </GridItem>
          <GridItem md={12} className={classes.buttonRow}>
            <Button color='info' onClick={onBackClick}>
              Back
            </Button>
            <Button color='login' onClick={handleSubmit}>
              Change Password
            </Button>
          </GridItem>
        </GridContainer>
      </CardBody>
    </Card>
  )
}

const StyledNewPasswordForm = withStyles(styles, { name: 'NewPasswordForm' })(
  NewPasswordForm,
)

export default withFormik({
  validationSchema: Yup.object().shape({
    validationCode: Yup.string().required('OTP is a required field'),
    newPassword: Yup.string().required('Current Password is a required field'),
    confirmPassword: Yup.string()
      .oneOf(
        [
          Yup.ref('newPassword'),
          null,
        ],
        "Passwords don't match",
      )
      .required('Current Password is a required field'),
  }),
  mapPropsToValues: () => ({}),
  handleSubmit: (values, { props }) => {
    const { onChangePasswordClick } = props
    onChangePasswordClick(values)
  },
})(StyledNewPasswordForm)
