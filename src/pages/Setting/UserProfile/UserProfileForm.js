import React from 'react'
import * as Yup from 'yup'
import { connect } from 'dva'
// formik
import { FastField, Field, withFormik } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
import Key from '@material-ui/icons/VpnKey'
// common component
import {
  Button,
  CodeSelect,
  DatePicker,
  DateRangePicker,
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
    marginTop: theme.spacing(3),
    '& > h4': {
      fontWeight: 500,
    },
    // marginBottom: theme.spacing(1),
  },
  isDoctorCheck: {
    paddingTop: `${theme.spacing(2)}px !important`,
  },
  indent: {
    paddingLeft: theme.spacing(2),
  },
})

@connect(({ settingUserProfile }) => ({
  settingUserProfile,
}))
@withFormik({
  enableReinitialize: true,
  validationSchema: Yup.object().shape({
    userName: Yup.string().required('Login ID is a required field'),
    password: Yup.string().required('Password is a required field'),
    name: Yup.string().required('Name is a required field'),
    phoneNumber: Yup.string().required('Contact No. is a required field'),
    userAccountNo: Yup.string().required(
      'User Account No. is a required field',
    ),
    // effectiveStartDate: Yup.date().required(
    //   'Effective Start Date is a required field',
    // ),
    // effectiveEndDate: Yup.date().required(
    //   'Effective End Date is a required field',
    // ),
    effectiveDates: Yup.array().of(Yup.date()).min(2).required(),

    role: Yup.string().required('Role is a required field'),
  }),
  mapPropsToValues: (props) => {
    const { settingUserProfile: { currentSelectedUser = {} } } = props
    return {
      ...currentSelectedUser,
      effectiveDates:
        Object.entries(currentSelectedUser).length <= 0
          ? []
          : [
              currentSelectedUser.effectiveStartDate,
              currentSelectedUser.effectiveEndDate,
            ],
      role: '1',
    }
  },
  handleSubmit: (values, { props }) => {
    // console.log('submit', values, props)
    const { dispatch, onConfirm } = props

    // const { role, ...restValues } = values
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
      ...values,
    }
    // console.log({ hardcodedProfileValue })
    dispatch({
      type: 'settingUserProfile/upsert',
      payload: hardcodedProfileValue,
    }).then((response) => {
      console.log('handleSubmit', { response })
      response && onConfirm()
    })
    // onSubmit(hardcodedProfileValue)
  },
})
class UserProfileForm extends React.PureComponent {
  render () {
    const {
      classes,
      onChangePasswordClick,
      footer,
      handleSubmit,
      settingUserProfile,
    } = this.props
    const { currentSelectedUser } = settingUserProfile

    const isEdit = currentSelectedUser.userName !== undefined
    return (
      <React.Fragment>
        <GridContainer alignItems='center' className={classes.container}>
          <GridItem md={12} className={classes.verticalSpacing}>
            <h4>Login Info</h4>
          </GridItem>
          <GridContainer className={classes.indent} alignItems='center'>
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
          </GridContainer>

          <GridItem md={12} className={classes.verticalSpacing}>
            <h4>Profile</h4>
          </GridItem>
          <GridContainer className={classes.indent}>
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
                render={(args) => (
                  <Select {...args} label='Title' options={[]} />
                )}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='userAccountNo'
                render={(args) => (
                  <TextField
                    {...args}
                    label='User Account No.'
                    disabled={isEdit}
                  />
                )}
              />
            </GridItem>
            <GridItem md={6}>
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
                name='phoneNumber'
                render={(args) => <TextField {...args} label='Contact No.' />}
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
                name='email'
                render={(args) => <TextField {...args} label='Email' />}
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
                name='dob'
                render={(args) => (
                  <DatePicker {...args} label='Date Of Birth' />
                )}
              />
            </GridItem>

            <GridItem md={6} />

            <GridItem md={12}>
              <FastField
                name='effectiveDates'
                render={(args) => (
                  <DateRangePicker
                    {...args}
                    label='Effective Start Date'
                    label2='Effective End Date'
                  />
                )}
              />
            </GridItem>
          </GridContainer>
          <GridItem md={12} className={classes.verticalSpacing}>
            <h4>User Role</h4>
          </GridItem>
          <GridContainer className={classes.indent}>
            <GridItem md={6}>
              <FastField
                name='role'
                render={(args) => (
                  <Select {...args} label='Role' options={[]} />
                )}
              />
            </GridItem>
          </GridContainer>
        </GridContainer>
        {footer &&
          footer({
            onConfirm: handleSubmit,
            confirmBtnText: isEdit ? 'Save' : 'Add',
          })}
      </React.Fragment>
    )
  }
}

// const ConnectedUserProfileForm = connect(({ settingUserProfile }) => ({
//   settingUserProfile,
// }))(UserProfileForm)

// const StyledUserProfileForm = withStyles(styles, { name: 'UserProfileForm' })(
//   ConnectedUserProfileForm,
// )

export default withStyles(styles, { name: 'UserProfileForm' })(UserProfileForm)
