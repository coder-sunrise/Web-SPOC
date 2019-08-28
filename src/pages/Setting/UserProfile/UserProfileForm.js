import React from 'react'
import * as Yup from 'yup'
import { connect } from 'dva'
// formik
import { FastField, Field, withFormik } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
import Key from '@material-ui/icons/VpnKey'
import Info from '@material-ui/icons/Info'
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
  Tooltip,
} from '@/components'
// services
import { getRoles, getRoleByID } from '../UserRole/services'
// utils
import { constructUserProfile } from './utils'

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

@connect(({ settingUserProfile, user }) => ({
  settingUserProfile,
  currentUser: user.profileDetails,
}))
@withFormik({
  enableReinitialize: true,
  validationSchema: (props) => {
    const { settingUserProfile, currentUser } = props
    const { currentSelectedUser } = settingUserProfile
    const isEdit =
      (currentSelectedUser &&
        currentSelectedUser.userProfile &&
        currentSelectedUser.userProfile.userName) ||
      (currentUser && currentUser.userProfile.userName)
    console.log({ props, isEdit })
    const baseValidationRule = {
      userName: Yup.string().required('Login ID is a required field'),
      name: Yup.string().required('Name is a required field'),
      phoneNumber: Yup.string().required('Contact No. is a required field'),
      userAccountNo: Yup.string().required(
        'User Account No. is a required field',
      ),
      effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
      role: Yup.string().required('Role is a required field'),
    }
    return isEdit
      ? Yup.object().shape(baseValidationRule)
      : Yup.object().shape({
          ...baseValidationRule,
          password: Yup.string().required('Password is a required field'),
        })
  },
  mapPropsToValues: (props) => {
    const { settingUserProfile, currentUser } = props
    if (currentUser) {
      return {
        ...currentUser,
        ...currentUser.userProfile,
        effectiveDates: [
          currentUser.effectiveStartDate,
          currentUser.effectiveEndDate,
        ],
        role: 1,
      }
    }
    if (settingUserProfile) {
      const { currentSelectedUser = {} } = settingUserProfile
      return {
        ...currentSelectedUser,
        ...currentSelectedUser.userProfile,
        effectiveDates:
          Object.entries(currentSelectedUser).length <= 0
            ? []
            : [
                currentSelectedUser.effectiveStartDate,
                currentSelectedUser.effectiveEndDate,
              ],
        role: 1,
      }
    }
    console.log({ currentUser })
    return {}
  },
  handleSubmit: async (values, { props, resetForm }) => {
    const { dispatch, currentUser, onConfirm } = props
    const { effectiveDates, role: roleFK, ...restValues } = values
    const getRoleResult = await getRoleByID(roleFK)
    const { data: role } = getRoleResult
    const userProfile = constructUserProfile(values, role)

    const payload = {
      userProfile,
      effectiveStartDate: values.effectiveDates[0],
      effectiveEndDate: values.effectiveDates[1],
      ...restValues,
    }

    console.log({ payload })

    dispatch({
      type: 'settingUserProfile/upsert',
      payload,
    }).then((response) => {
      resetForm()
      response && onConfirm()
    })
  },
})
class UserProfileForm extends React.PureComponent {
  state = {
    roles: [],
  }

  componentWillMount () {
    getRoles().then((response) => {
      const { data } = response
      const { data: roles = [] } = data
      this.setState({
        roles,
      })
    })
  }

  render () {
    const {
      classes,
      onChangePasswordClick,
      footer,
      handleSubmit,
      values,
      currentUser,
      settingUserProfile,
    } = this.props

    const { roles } = this.state
    const { currentSelectedUser = {} } = settingUserProfile || {}
    // console.log({ props: this.props })
    const isEdit =
      (currentSelectedUser &&
        currentSelectedUser.userProfile &&
        currentSelectedUser.userProfile.userName) ||
      (currentUser && currentUser.userProfile.userName)

    return (
      <React.Fragment>
        <GridContainer
          alignItems='center'
          justify='space-between'
          className={classes.container}
        >
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
                <GridItem>
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
            <GridItem md={6} />
            <GridItem md={6}>
              <span>Password must be</span>
              <ul>
                <li>8 to 18 characters long</li>
                <li>
                  contain a mix of letters, numbers, and/or special characters
                </li>
              </ul>
            </GridItem>
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
              <FastField
                name='doctorMCRNo'
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
              <Field
                name='role'
                render={(args) => (
                  <Select
                    {...args}
                    label='Role'
                    valueField='id'
                    labelField='name'
                    options={roles}
                  />
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

export default withStyles(styles, { name: 'UserProfileForm' })(UserProfileForm)
