import React from 'react'
import * as Yup from 'yup'
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
})

const ResetPassForm = ({ classes, handleSubmit, onCancelClick }) => {
  const headerClass = classnames({
    [classes.textCenter]: true,
    [classes.cardTitle]: true,
  })

  return (
    <Card login>
      <CardHeader color='primary' className={headerClass}>
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
          <GridItem md={12}>
            <FastField
              name='phoneNumber'
              render={(args) => <NumberInput {...args} label='Mobile Number' />}
            />
          </GridItem>
          <GridItem md={12} className={classes.buttonRow}>
            <Button color='danger' onClick={onCancelClick}>
              Cancel
            </Button>
            <Button color='primary' onClick={handleSubmit}>
              Get Validation Code
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
