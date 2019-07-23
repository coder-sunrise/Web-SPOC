import React from 'react'
import * as Yup from 'yup'
// formik
import { withFormik, FastField } from 'formik'
// common components
import { TextField, GridContainer, GridItem } from '@/components'

@withFormik({
  validationSchema: Yup.object().shape({
    currentPassword: Yup.string().required(
      'Current Password is a required field',
    ),
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
    const { onConfirm } = props
    onConfirm()
  },
})
class ChangePassword extends React.Component {
  render () {
    const { footer, handleSubmit } = this.props
    return (
      <React.Fragment>
        <GridContainer>
          <GridItem md={12}>
            <FastField
              name='currentPassword'
              render={(args) => (
                <TextField {...args} label='Current Password' type='password' />
              )}
            />
          </GridItem>
          <GridItem md={12}>
            <FastField
              name='newPassword'
              render={(args) => (
                <TextField {...args} label='New Password' type='password' />
              )}
            />
          </GridItem>
          <GridItem md={12}>
            <FastField
              name='confirmPassword'
              render={(args) => (
                <TextField {...args} label='Confirm Password' type='password' />
              )}
            />
          </GridItem>
        </GridContainer>
        {footer &&
          footer({
            onConfirm: handleSubmit,
          })}
      </React.Fragment>
    )
  }
}

export default ChangePassword
