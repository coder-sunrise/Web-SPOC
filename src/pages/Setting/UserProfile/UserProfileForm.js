import React from 'react'
import * as Yup from 'yup'
// formik
import { FastField, Field, withFormik } from 'formik'
// material ui
import { Divider, withStyles } from '@material-ui/core'
import Key from '@material-ui/icons/VpnKey'
// common component
import {
  Button,
  Checkbox,
  CodeSelect,
  DatePicker,
  GridContainer,
  GridItem,
  Select,
  TextField,
} from '@/components'

const styles = (theme) => ({
  container: {
    marginBottom: theme.spacing(2),
  },
  verticalSpacing: {
    marginTop: theme.spacing(2),
    '& > h4': {
      fontWeight: 500,
    },
    marginBottom: theme.spacing(1.5),
  },
  isDoctorCheck: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 99,
  },
})

const UserProfileForm = ({
  classes,
  footer,
  handleSubmit,
  onChangePasswordClick,
  values,
  selectedUser,
}) => {
  const isEdit = selectedUser.userName !== undefined
  return (
    <React.Fragment>
      <GridContainer alignItems='center' className={classes.container}>
        <GridItem md={12} className={classes.verticalSpacing}>
          <h4>Login Info</h4>
          <Divider />
        </GridItem>
        <GridItem md={6}>
          <FastField
            name='userName'
            render={(args) => (
              <TextField {...args} label='Username' disabled={isEdit} />
            )}
          />
        </GridItem>
        {!isEdit ? (
          <React.Fragment>
            <GridItem md={6}>
              <FastField
                name='password'
                render={(args) => (
                  <TextField {...args} label='Password' type='password' />
                )}
              />
            </GridItem>
            <GridItem md={6} />
            <GridItem md={6}>
              <i>User must create a new password at next sign in.</i>
            </GridItem>
          </React.Fragment>
        ) : (
          <GridItem md={6}>
            <Button color='primary' onClick={onChangePasswordClick}>
              <Key />Change Password
            </Button>
          </GridItem>
        )}

        <GridItem md={12} className={classes.verticalSpacing}>
          <h4>Profile</h4>
          <Divider />
        </GridItem>

        <GridItem md={6}>
          <FastField
            name='name'
            render={(args) => (
              <TextField {...args} label='Name' disabled={isEdit} />
            )}
          />
        </GridItem>
        <GridItem md={6}>
          <FastField
            name='title'
            render={(args) => <Select {...args} label='Title' options={[]} />}
          />
        </GridItem>
        <GridItem md={6}>
          <FastField
            name='userAccountNo'
            render={(args) => (
              <TextField {...args} label='User Account No.' disabled={isEdit} />
            )}
          />
        </GridItem>
        <GridItem md={6}>
          <FastField
            name='isDoctor'
            render={(args) => <Checkbox {...args} label='Is Doctor' simple />}
          />
        </GridItem>
        <GridItem md={6}>
          <FastField
            name='phoneNumber'
            render={(args) => <TextField {...args} label='Contact No.' />}
          />
        </GridItem>
        <GridItem md={6} style={{ position: 'relative' }}>
          {/* <div className={classes.isDoctorCheck}>
            <FastField
              name='isDoctor'
              render={(args) => <Checkbox {...args} label='Is Doctor' simple />}
            />
            </div> */}
          <Field
            name='mcrNo'
            render={(args) => (
              <TextField
                {...args}
                label='Doctor MCR No.'
                disabled={!values.isDoctor}
              />
            )}
          />
        </GridItem>

        <GridItem md={6}>
          <FastField
            name='email'
            render={(args) => <TextField {...args} label='Email' />}
          />
        </GridItem>

        <GridItem md={6}>
          <FastField
            name='genderFk'
            render={(args) => (
              <CodeSelect {...args} label='Gender' code='ctgender' />
            )}
          />
        </GridItem>

        <GridItem md={6}>
          <FastField
            name='dob'
            render={(args) => <DatePicker {...args} label='Date Of Birth' />}
          />
        </GridItem>

        <GridItem md={6}>
          <FastField
            name='designation'
            render={(args) => <TextField {...args} label='Designation' />}
          />
        </GridItem>

        <GridItem md={6}>
          <FastField
            name='effectiveStartDate'
            render={(args) => (
              <DatePicker {...args} label='Effective Start Date' />
            )}
          />
        </GridItem>
        <GridItem md={6}>
          <FastField
            name='effectiveEndDate'
            render={(args) => (
              <DatePicker {...args} label='Effective End Date' />
            )}
          />
        </GridItem>
        <GridItem md={12} className={classes.verticalSpacing}>
          <h4>User Role</h4>
          <Divider />
        </GridItem>
        <GridItem md={6}>
          <FastField
            name='role'
            render={(args) => <Select {...args} label='Role' options={[]} />}
          />
        </GridItem>
      </GridContainer>
      {footer &&
        footer({
          onConfirm: handleSubmit,
          confirmBtnText: isEdit ? 'Save' : 'Add',
        })}
    </React.Fragment>
  )
}

export default withFormik({
  enableReinitialize: true,
  validationSchema: Yup.object().shape({
    userLoginID: Yup.string().required('Login ID is a required field'),
    password: Yup.string().required('Password is a required field'),
    name: Yup.string().required('Name is a required field'),
    contactNo: Yup.string().required('Contact No. is a required field'),
    userAccountNo: Yup.string().required(
      'User Account No. is a required field',
    ),
    effectiveStartDate: Yup.date().required(
      'Effective Start Date is a required field',
    ),
    effectiveEndDate: Yup.date().required(
      'Effective End Date is a required field',
    ),
    role: Yup.string().required('Role is a required field'),
  }),
  mapPropsToValues: ({ selectedUser }) => ({
    ...selectedUser,
  }),
  handleSubmit: (values, props) => {
    console.log('submit', values, props)
  },
})(withStyles(styles, { name: 'UserProfileForm' })(UserProfileForm))
