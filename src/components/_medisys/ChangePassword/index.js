import React from 'react'
import * as Yup from 'yup'
// dva
import { connect } from 'dva'
// formik
import { withFormik, FastField } from 'formik'
// common components
import { TextField, GridContainer, GridItem, notification } from '@/components'
// services
import { changeCurrentUserPassword, changeUserPassword } from '@/services/user'

@connect(({ user }) => ({ currentUser: user.data }))
@withFormik({
  displayName: 'ChangePassword',
  validationSchema: Yup.object().shape({
    currentPassword: Yup.string().required(
      'Current Password is a required field',
    ),
    newPassword: Yup.string().required('New Password is a required field'),
    confirmPassword: Yup.string()
      .oneOf(
        [
          Yup.ref('newPassword'),
          null,
        ],
        "Passwords don't match",
      )
      .required('Confirm Password is a required field'),
  }),
  mapPropsToValues: () => ({}),
  handleSubmit: async (values, { props }) => {
    const { dispatch, onConfirm, userID, currentUser } = props
    const payload = {
      userID,
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    }
    const isCurrentLogin = userID === currentUser.id
    let response

    if (isCurrentLogin) response = await changeCurrentUserPassword(payload)
    else response = await changeUserPassword(payload)

    const { data } = response
    if (data) {
      if (data.succeeded) {
        notification.success({
          message: 'Change password success.',
        })
        sessionStorage.removeItem('user')
        // fetch again to refresh
        dispatch({ type: 'user/fetchCurrent' })
        onConfirm()
      } else {
        notification.error({
          message: 'Current password is not correct.',
        })
      }
    }
  },
})
class ChangePassword extends React.PureComponent {
  render () {
    const {
      footer,
      handleSubmit,
      currentUser,
      changeTargetUser = false,
    } = this.props

    return (
      <div>
        {!changeTargetUser &&
        !currentUser.clinicianProfile.userProfile.lastPasswordChangedDate && (
          <p style={{ textAlign: 'center' }}>
            The user&apos;s password must be changed before logging in the first
            time.
          </p>
        )}

        <GridContainer>
          <GridItem md={12}>
            <FastField
              name='currentPassword'
              render={(args) => (
                <React.Fragment>
                  {/*
                    --- IMPORTANT ---
                    do not remove below <input /> element
                    it prevents all the other input from being
                    autofill incorrectly by chrome
                  */}
                  <input
                    className='visually-hidden'
                    name='fake_username'
                    value=''
                  />
                  <TextField
                    autoFocus
                    {...args}
                    label='Current Password'
                    type='password'
                    inputProps={{
                      autoComplete: 'nope',
                    }}
                  />
                </React.Fragment>
              )}
            />
          </GridItem>
          <GridItem md={12}>
            <FastField
              name='newPassword'
              render={(args) => (
                <TextField
                  {...args}
                  label='New Password'
                  type='password'
                  inputProps={{
                    autoComplete: 'new-password',
                  }}
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
                  label='Confirm Password'
                  type='password'
                  inputProps={{
                    autoComplete: 'new-password',
                  }}
                />
              )}
            />
          </GridItem>
          <GridItem>
            <p style={{ margin: '10px 0px' }}>
              Password must be
              <li style={{ marginLeft: 30 }}>8 to 18 characters long</li>
              <li style={{ marginLeft: 30 }}>
                contain a mix of letters, numebrs, and/or special characters
              </li>
            </p>
          </GridItem>
        </GridContainer>
        {footer &&
          footer({
            cancelProps: {
              disabled:
                !changeTargetUser &&
                !currentUser.clinicianProfile.userProfile
                  .lastPasswordChangedDate,
            },
            onConfirm: handleSubmit,
            confirmBtnText: 'Submit',
          })}
      </div>
    )
  }
}

export default ChangePassword
