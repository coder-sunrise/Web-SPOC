import React, { PureComponent } from 'react'
// formik
// custom components
import { CommonCard, GridContainer, GridItem } from '@/components'
import ExaminationForm from '@/pages/Widgets/ExaminationForm'

class ExaminationFormCard extends PureComponent {
  render () {
    return (
      <CommonCard title='Examination Form'>
        <GridItem>
          <ExaminationForm
            prefix='visitEyeExaminationForm.formData'
            {...this.props}
          />
        </GridItem>
      </CommonCard>
    )
  }
}

export default ExaminationFormCard
