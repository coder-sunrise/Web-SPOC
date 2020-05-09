import React, { PureComponent } from 'react'
// formik
// custom components
import { CommonCard, GridContainer, GridItem } from '@/components'
import RefractionForm from '@/pages/Widgets/RefractionForm'

class RefractionFormCard extends PureComponent {
  render () {
    return (
      <CommonCard title='Refraction Form'>
        <GridItem>
          <RefractionForm
            prefix='visitEyeRefractionForm.formData'
            {...this.props}
          />
        </GridItem>
      </CommonCard>
    )
  }
}

export default RefractionFormCard
