import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { CardContainer } from '@/components'
import FormListingDetails from './FormListingDetails'
import { FORM_FROM } from '@/utils/constants'

const styles = (theme) => ({})

class FormListing extends React.Component {
  render () {
    return (
      <CardContainer hideHeader>
        <FormListingDetails formFrom={FORM_FROM.FORMMODULE} />
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(FormListing)
