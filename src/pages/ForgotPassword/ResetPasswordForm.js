import React from 'react'
import * as Yup from 'yup'
import classnames from 'classnames'
// formik
import { withFormik, FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
import Refresh from '@material-ui/icons/Refresh'
// common components
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Select,
  GridContainer,
  GridItem,
  TextField,
} from '@/components'
import { MobileNumberInput } from '@/components/_medisys'
import { countryCodes } from '@/utils/codes'
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
})

const ResetPassForm = ({ classes, loading, handleSubmit, onCancelClick }) => {
  const headerClass = classnames({
    [classes.textCenter]: true,
    [classes.cardTitle]: true,
  })

  return (
    <Card login>
      <CardHeader color='login' className={headerClass}>
        <h3>Reset Password</h3>
        <h4>Enter your username and mobile number to reset your password</h4>
      </CardHeader>
      <CardBody>
        <GridContainer>
          <GridItem md={12}>
            <FastField
              name='clinicCode'
              render={(args) => <TextField {...args} label='Clinic Code' />}
            />
          </GridItem>
          <GridItem md={12}>
            <FastField
              name='userName'
              render={(args) => <TextField {...args} label='Username' />}
            />
          </GridItem>
          <GridItem md={6}>
            <FastField
              name='countryCode'
              render={(args) => (
                <Select
                  allowClear={false}
                  label='Country Code'
                  options={countryCodes}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem md={6}>
            <FastField
              name='phoneNumber'
              render={(args) => (
                <MobileNumberInput {...args} label='Mobile Number' />
              )}
            />
          </GridItem>
          <GridItem md={12} className={classes.buttonRow}>
            <Button color='danger' onClick={onCancelClick}>
              Cancel
            </Button>
            <Button color='login' onClick={handleSubmit} disabled={loading}>
              {loading && <Refresh className='spin-custom' />}
              Get OTP
            </Button>
          </GridItem>
        </GridContainer>
      </CardBody>
    </Card>
  )
}

const StyledResetPassForm = withStyles(styles, { name: 'ResetPassForm' })(
  ResetPassForm,
)

export default withFormik({
  validationSchema: Yup.object().shape({
    clinicCode: Yup.string().required('Cinic Code is a required field'),
    userName: Yup.string().required('Username is a required field'),
    countryCode: Yup.string().required('Country Code is a required field'),
    phoneNumber: Yup.number().required('Mobile Number is a required field'),
  }),
  mapPropsToValues: ({ payload }) => ({
    ...payload,
  }),
  handleSubmit: (values, { props }) => {
    const { onResetClick } = props
    onResetClick(values)
  },
})(StyledResetPassForm)
