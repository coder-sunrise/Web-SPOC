import React from 'react'
import classnames from 'classnames'
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

const NewPasswordForm = ({ classes, onBackClick, handleSubmit }) => {
  const headerClass = classnames({
    [classes.textCenter]: true,
    [classes.cardTitle]: true,
  })
  return (
    <Card login>
      <CardHeader color='primary' className={headerClass}>
        <h3>Reset Your Password</h3>
      </CardHeader>
      <CardBody>
        <GridContainer alignItems='flex-end'>
          <GridItem md={6}>
            <FastField
              name='OTP'
              render={(args) => <TextField {...args} label='OTP' />}
            />
          </GridItem>
          <GridItem md={4}>
            <Button size='sm' color='primary' className={classes.otpBtn}>
              Resend OTP
            </Button>
          </GridItem>
          <GridItem md={12}>
            <FastField
              name='password'
              render={(args) => (
                <TextField
                  {...args}
                  type='password'
                  label='New Password'
                  inputProps={{ autoComplete: 'new-password' }}
                />
              )}
            />
          </GridItem>
          <GridItem md={12}>
            <FastField
              name='confirmPassword'
              render={(args) => (
                <NumberInput
                  {...args}
                  label='Re-enter New Password'
                  inputProps={{ autoComplete: 'new-password' }}
                />
              )}
            />
          </GridItem>
          <GridItem md={12} className={classes.buttonRow}>
            <Button color='info' onClick={onBackClick}>
              Back
            </Button>
            <Button color='primary' onClick={handleSubmit}>
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
  mapPropsToValues: () => ({}),
  handleSubmit: (values, { props }) => {
    const { onChangePasswordClick } = props
    onChangePasswordClick(values)
  },
})(StyledNewPasswordForm)
