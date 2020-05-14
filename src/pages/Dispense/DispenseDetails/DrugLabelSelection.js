import React from 'react'
import * as Yup from 'yup'
// dva
import { connect } from 'dva'
// formik
import { withFormik, FastField } from 'formik'
import { Paper, withStyles } from '@material-ui/core'
// common components
import { TextField, GridContainer, GridItem, notification } from '@/components'
// services
import { changeCurrentUserPassword, changeUserPassword } from '@/services/user'

import {
  DrugLabelSelectionColumns,
  DrugLabelSelectionColumnExtensions,
} from '../variables'
import TableData from './TableData'
@withFormik({
  displayName: 'DrugLabelSelection',
  validationSchema: Yup.object().shape({
    // currentPassword: Yup.string().required(
    //   'Current Password is a required field',
    // ),
    // newPassword: Yup.string().required('New Password is a required field'),
    // confirmPassword: Yup.string()
    //   .oneOf(
    //     [
    //       Yup.ref('newPassword'),
    //       null,
    //     ],
    //     "Passwords don't match",
    //   )
    //   .required('Confirm Password is a required field'),
  }),
  handleSubmit: (values, { props }) => {
    const { dispatch, onConfirm, userID, currentUser, handleSubmit } = props
    console.log(handleSubmit)
  },
})
class DrugLabelSelection extends React.PureComponent { 
  render() {
    const {
      footer,
      handleSubmit,
      prescription, 
      codetable      
    } = this.props
    console.log("DrugLabelSelection props:")
    console.log(this.props)
    return (
      <div>
        <GridContainer>
          <GridItem md={12}>
            <TableData
              idPrefix='prescription'
              columns={DrugLabelSelectionColumns}
              colExtensions={DrugLabelSelectionColumnExtensions()}
              data={prescription}
            />
          </GridItem>
        </GridContainer>
        {footer &&
          footer({
            cancelProps: {
            },
            onConfirm: handleSubmit,
            confirmBtnText: 'Print',
          })}
      </div>
    )
  }
}

export default DrugLabelSelection
