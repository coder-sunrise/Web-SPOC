import React from 'react'
import _ from 'lodash'
import * as Yup from 'yup'
// formik
import { withFormik, FastField } from 'formik'
// common components
import {
  Button,
  Checkbox,
  CardContainer,
  GridContainer,
  GridItem,
  RichEditor,
  TextField,
} from '@/components'
import { getUniqueGUID, htmlDecodeByRegExp } from '@/utils/utils'

// "title": "string",
// "text": "string",
// "isShared": true,
// "cannedTextTypeFK": 0,
// "ownedByUserFK": 0,

const defaultEntity = {
  title: undefined,
  text: undefined,
  htmlCannedText: undefined,
  isShared: false,
  ownedByUserFK: undefined,
}

const Editor = ({
  values,
  resetForm,
  setFieldValue,
  onCancel,
  handleSubmit,
}) => {
  console.log({ values })
  const handleCancelClick = () => {
    resetForm(defaultEntity)
    onCancel()
  }
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
        <GridItem md={3}>
          <FastField
            name='isShared'
            render={(args) => <Checkbox {...args} simple label='Is Shared' />}
          />
        </GridItem>
        <GridItem md={12}>
          <FastField
            name='_htmlCannedText'
            render={(args) => (
              <RichEditor
                strongLabel
                label='Canned Text'
                {...args}
                onBlur={(html, text) => {
                  const decodedHtml = htmlDecodeByRegExp(html)
                  setFieldValue('text', text)
                  setFieldValue('htmlCannedText', decodedHtml)
                }}
              />
            )}
          />
        </GridItem>
        <GridItem md={12} style={{ textAlign: 'right' }}>
          <Button color='danger' size='sm' onClick={handleCancelClick}>
            Cancel
          </Button>
          <Button
            color='primary'
            size='sm'
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

const handleSubmit = async (values, { props, resetForm }) => {
  const { dispatch, onConfirm } = props
  const isEdit = values.id !== undefined
  const result = isEdit ? values : { ...values, id: getUniqueGUID() }
  console.log({ result })
  // const response = await dispatch({
  //   type: 'text/upsert',
  //   payload: result,
  // })

  // if (response) {
  //   if (onConfirm) onConfirm(result)
  //   resetForm(defaultEntity)
  // }
}

const mapPropsToValues = ({ entity, user }) => {
  const _entity = _.isEmpty(entity)
    ? { ...defaultEntity, ownedByUserFK: user.id }
    : { ...entity, _htmlCannedText: entity.htmlCannedText }
  return _entity
}

const ValidationSchema = Yup.object().shape({
  title: Yup.string().required(),
  _htmlCannedText: Yup.string().required(),
})

export default withFormik({
  enableReinitialize: true,
  validationSchema: ValidationSchema,
  mapPropsToValues,
  handleSubmit,
})(Editor)
