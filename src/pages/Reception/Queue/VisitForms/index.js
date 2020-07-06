import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { CardContainer } from '@/components'
import FormListingDetails from '@/pages/FormListing/FormListingDetails'
import { FORM_FROM } from '@/utils/constants'

const styles = (theme) => ({})

class VisitForms extends React.Component {
  render () {
    return (
      <CardContainer hideHeader>
        <FormListingDetails
          formFrom={FORM_FROM.QUEUELOG}
          formCategory={this.props.formCategory}
        />
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(VisitForms)
