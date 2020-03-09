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

const defaultEntity = {
  title: undefined,
  text: undefined,
  htmlCannedText: undefined,
  isShared: false,
  ownedByUserFK: undefined,
}

const Editor = ({ values, resetForm, onCancel, handleSubmit }) => {
  const handleCancelClick = () => {
    resetForm(defaultEntity)
    onCancel()
  }
  const isEdit = values.id !== undefined
  return (
    <CardContainer hideHeader size='sm' style={{ marginBottom: 24 }}>
      <GridContainer alignItems='center'>
        <GridItem md={6}>
          <FastField
            name='title'
            render={(args) => (
              <TextField
                label='Canned Text Title'
                {...args}
                autocomplete='off'
              />
            )}
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
            name='text'
            render={(args) => (
              <RichEditor
                strongLabel
                label='Canned Text'
                {...args}
                // onBlur={(html, text) => {
                //   const decodedHtml = htmlDecodeByRegExp(html)
                //   setFieldValue('plainText', text)
                //   setFieldValue('htmlCannedText', decodedHtml)
                // }}
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
  const { dispatch, onConfirm, cannedTextTypeFK } = props
  const response = await dispatch({
    type: 'cannedText/upsert',
    payload: values,
  })

  if (response) {
    dispatch({
      type: 'cannedText/query',
      payload: cannedTextTypeFK,
    })
    if (onConfirm) onConfirm(response)
    resetForm()
  }
}

const mapPropsToValues = ({ entity, user, cannedTextTypeFK }) => {
  const _entity = _.isEmpty(entity)
    ? { ...defaultEntity, ownedByUserFK: user.id, cannedTextTypeFK }
    : { ...entity }
  return _entity
}

const ValidationSchema = Yup.object().shape({
  title: Yup.string().required(),
  text: Yup.string().required(),
})

export default withFormik({
  enableReinitialize: true,
  validationSchema: ValidationSchema,
  mapPropsToValues,
  handleSubmit,
})(Editor)
