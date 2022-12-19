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
      .oneOf([Yup.ref('newPassword'), null], "Passwords don't match")
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
  render() {
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
              The user&apos;s password must be changed before logging in the
              first time.
            </p>
          )}

        <GridContainer>
          <input
            style={{
              zIndex: '-99',
              height: '0',
              width: '0',
              opacity: 0,
            }}
          />
          <GridItem md={12}>
            <FastField
              name='currentPassword'
              render={args => (
                <TextField
                  {...args}
                  label='Current Password'
                  type='password'
                  autocomplete='off'
                  inputProps={{
                    autoComplete: 'off',
                  }}
                />
              )}
            />
          </GridItem>
          <GridItem md={12}>
            <FastField
              name='newPassword'
              render={args => (
                <TextField
                  {...args}
                  label='New Password'
                  type='password'
                  inputProps={{
                    autoComplete: 'off',
                  }}
                />
              )}
            />
          </GridItem>
          <GridItem md={12}>
            <FastField
              name='confirmPassword'
              render={args => (
                <TextField
                  {...args}
                  label='Confirm Password'
                  type='password'
                  inputProps={{
                    autoComplete: 'off',
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
                contain a mix of letters, numbers, and/or special characters
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
