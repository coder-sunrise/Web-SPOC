import React from 'react'
import * as Yup from 'yup'
// formik
import { FastField, withFormik } from 'formik'
// material ui
import { Divider, withStyles } from '@material-ui/core'
// common component
import {
  CodeSelect,
  DatePicker,
  GridContainer,
  GridItem,
  Select,
  TextField,
} from '@/components'
// sub components
import AccessRight from './AccessRight'

const styles = (theme) => ({
  verticalSpacing: {
    marginTop: theme.spacing(2),
    '& > h4': {
      fontWeight: 500,
    },
  },
})

const UserRoleForm = ({ classes, footer, handleSubmit, ...props }) => {
  return (
    <React.Fragment>
      <GridContainer>
        <GridItem md={12} className={classes.verticalSpacing}>
          <h4>User Role</h4>
          <Divider />
        </GridItem>
        <GridItem md={4}>
          <FastField
            name='name'
            render={(args) => <TextField autoFocus {...args} label='Name' />}
          />
        </GridItem>
        <GridItem md={4}>
          <FastField
            name='effectiveStartDate'
            render={(args) => (
              <DatePicker {...args} label='Effective Start Date' />
            )}
          />
        </GridItem>
        <GridItem md={4} />
        <GridItem md={4}>
          <FastField
            name='description'
            render={(args) => <TextField {...args} label='Description' />}
          />
        </GridItem>
        <GridItem md={4}>
          <FastField
            name='effectiveEndDate'
            render={(args) => (
              <DatePicker {...args} label='Effective End Date' />
            )}
          />
        </GridItem>
        <GridItem md={4} />

        <GridItem md={12} className={classes.verticalSpacing}>
          <h4>Access Right</h4>
          <Divider />
        </GridItem>
        <GridItem md={12}>
          <AccessRight />
        </GridItem>
      </GridContainer>
      {footer &&
        footer({
          confirmBtnText: 'Save',
          onConfirm: handleSubmit,
        })}
    </React.Fragment>
  )
}

export default withFormik({
  mapPropsToValues: () => ({}),
  handleSubmit: () => {},
})(withStyles(styles, { name: 'UserProfileForm' })(UserRoleForm))
