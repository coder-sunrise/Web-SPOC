import React from 'react'
import * as Yup from 'yup'
// formik
import { withFormik, FastField } from 'formik'
// common components
import {
  Button,
  CardContainer,
  GridContainer,
  GridItem,
  RichEditor,
  TextField,
} from '@/components'
import { getUniqueGUID } from '@/utils/utils'

const Editor = ({ values, setFieldValue, handleSubmit }) => {
  const isEdit = values.id !== undefined
  return (
    <CardContainer hideHeader size='sm'>
      <GridContainer alignItems='center'>
        <GridItem md={6}>
          <FastField
            name='title'
            render={(args) => <TextField label='Canned Text Title' {...args} />}
          />
        </GridItem>
        <GridItem md={12}>
          <FastField
            name='cannedText'
            render={(args) => (
              <RichEditor
                strongLabel
                label='Canned Text'
                {...args}
                onBlur={(html, text) => {
                  setFieldValue('cannedText', text)
                }}
              />
            )}
          />
        </GridItem>
        <GridItem md={12} style={{ textAlign: 'right' }}>
          <Button
            color='primary'
            onClick={handleSubmit}
            style={{ marginRight: 0 }}
          >
            {isEdit ? 'Save' : 'Add'}
          </Button>
        </GridItem>
      </GridContainer>
    </CardContainer>
  )
}

const handleSubmit = (values, { props }) => {
  const { onConfirm } = props
  const isEdit = values.id !== undefined
  const result = isEdit ? values : { ...values, id: getUniqueGUID() }
  onConfirm(result)
}

const mapPropsToValues = ({ entity }) => {
  const defaultEntity = {
    title: undefined,
    cannedText: undefined,
  }
  return entity || defaultEntity
}

const ValidationSchema = Yup.object().shape({
  title: Yup.string().required(),
  cannedText: Yup.string().required(),
})

export default withFormik({
  enableReinitialize: true,
  validationSchema: ValidationSchema,
  mapPropsToValues,
  handleSubmit,
})(Editor)
