import { GridContainer, GridItem, TextField } from '@/components'
import { FastField } from 'formik'
const PreliminaryAssessment = props => {
  const { prefixProp } = props
  return (
    <GridContainer>
      <GridItem md={12}>Preliminary Assessment</GridItem>
    </GridContainer>
  )
}
export default PreliminaryAssessment
