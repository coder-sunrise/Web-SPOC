import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
import FormListingDetails from './FormListingDetails'
import { FORM_FROM, FORM_CATEGORY } from '@/utils/constants'

const styles = (theme) => ({})

class FormListing extends React.Component {
  render () {
    return (
      <div>
        <FormListingDetails
          formFrom={FORM_FROM.FORMMODULE}
          formCategory={FORM_CATEGORY.CORFORM}
        />
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(FormListing)
