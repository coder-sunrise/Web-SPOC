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
    paddingTop: `${theme.spacing(2)}px !important`,
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
        <GridItem md={6} className={classes.isDoctorCheck}>
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
        <GridItem md={6}>
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
                // disabled={!values.isDoctor}
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
    userName: Yup.string().required('Login ID is a required field'),
    password: Yup.string().required('Password is a required field'),
    name: Yup.string().required('Name is a required field'),
    phoneNumber: Yup.string().required('Contact No. is a required field'),
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
    role: '1',
  }),
  handleSubmit: (values, { props, ...formikBag }) => {
    console.log('submit', values, props)
    const { onConfirm } = props
    const { role, ...restValues } = values
    const hardcodedProfileValue = {
      // role: '1',

      // effectiveEndDate: '2019-07-31T08:36:14Z',
      // effectiveStartDate: '2019-07-25T08:36:12Z',
      // name: 'test medisys',
      // password: '123456',
      // phoneNumber: '12345678',
      // userAccountNo: '00001',
      // userName: 'test',

      email: '',
      title: '',
      userCode: '',
      dob: '2019-07-26T08:26:07.254Z',
      isUserMaintainable: true,
      genderFk: 1,
      qualificationCodeFk: 0,
      registrationStatusFk: 0,
      registrationTypeFk: 0,
      boardNameFk: 0,
      roleSpecialityFk: 0,
      languageSpokenFk: 0,
      designation: '',
      principalUserProfileFk: 0,
      lastLoginDate: '2019-07-26T08:26:07.254Z',
      createDate: '2019-07-26T08:26:07.254Z',
      createByUserFk: 1,
      createByClinicFk: 0,
      updateDate: '2019-07-26T08:26:07.254Z',
      updateByUserFk: 1,
      updateByClinicFk: 0,
      // userRoles: [
      //   {
      //     id: 0,
      //     name: 'doctor',
      //     normalizedName: 'doctor',
      //   },
      // ],
      userRole: 'doctor',
      doctorMCRNo: '12345A',
      isDoctor: true,
      // id: 0,
      isDeleted: false,
      concurrencyToken: 0,
      ...restValues,
    }
    onConfirm(hardcodedProfileValue)
  },
})(withStyles(styles, { name: 'UserProfileForm' })(UserProfileForm))
