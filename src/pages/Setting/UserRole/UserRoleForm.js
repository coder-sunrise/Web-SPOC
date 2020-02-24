import React from 'react'
// formik
import { withFormik } from 'formik'
// material ui
import { Divider, withStyles } from '@material-ui/core'
// common component
import { GridContainer, GridItem } from '@/components'
// sub components

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
          <h4>Developing</h4>
          <Divider />
        </GridItem>
      </GridContainer>
      {footer &&
        footer({
          confirmBtnText: 'Add New',
          onConfirm: handleSubmit,
        })}
    </React.Fragment>
  )
}

export default withFormik({
  mapPropsToValues: () => ({}),
  handleSubmit: () => {},
})(withStyles(styles, { name: 'UserProfileForm' })(UserRoleForm))
