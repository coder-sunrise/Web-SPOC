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
  OutlinedTextField,
  NumberInput,
} from '@/components'
import { CANNED_TEXT_TYPE } from '@/utils/constants'

const defaultEntity = {
  title: undefined,
  text: undefined,
  htmlCannedText: undefined,
  isShared: false,
  ownedByUserFK: undefined,
  sortOrder: undefined,
}

const Editor = ({
  values,
  onCancel,
  handleSubmit,
  setValues,
  user,
  cannedTextTypeFK,
  resetForm,
}) => {
  const handleCancelClick = () => {
    resetForm()
    onCancel()
    setValues({ ...defaultEntity, ownedByUserFK: user.id, cannedTextTypeFK })
  }
  const isEdit = values.id !== undefined
  return (
    <CardContainer hideHeader size='sm' style={{ marginBottom: 24 }}>
      <GridContainer alignItems='center'>
        <GridItem md={6}>
          <FastField
            name='title'
            render={(args) => (
              <TextField label='Canned Text Title' autoFocus {...args} />
            )}
          />
        </GridItem>
        <GridItem md={6}>
          <div>
            {cannedTextTypeFK !== CANNED_TEXT_TYPE.MEDICALCERTIFICATE &&
              <div style={{ display: 'inline-Block' }}>
                <FastField
                  name='isShared'
                  render={(args) => (
                    <Checkbox {...args} simple label='Is Shared' />
                  )}
                />
              </div>}
            <div style={{ display: 'inline-Block', marginLeft: 10 }}>
              <FastField
                name='sortOrder'
                render={(args) => (
                  <NumberInput
                    label='Sort Order'
                    min={1}
                    precision={0}
                    {...args}
                  />
                )}
              />
            </div>
          </div>
        </GridItem>
        <GridItem md={12}>
          {cannedTextTypeFK !== CANNED_TEXT_TYPE.MEDICALCERTIFICATE ?
            <FastField
              name='text'
              render={(args) => (
                <RichEditor strongLabel label='Canned Text' {...args} />
              )}
            />
            :
            <FastField
              name='text'
              render={(args) => {
                return (
                  <OutlinedTextField
                    label='Canned Text'
                    multiline
                    rowsMax={5}
                    maxLength={2000}
                    rows={5}
                    {...args}
                  />
                )
              }}
            />
          }
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

const handleSubmit = async (
  values,
  { props, onConfirm, setValues, resetForm },
) => {
  const { dispatch, cannedTextTypeFK, handleEditorConfirmClick, user } = props
  const response = await dispatch({
    type: 'cannedText/upsert',
    payload: values,
  })

  if (response) {
    if (onConfirm) onConfirm()
    resetForm()
    handleEditorConfirmClick()
    setValues({ ...defaultEntity, ownedByUserFK: user.id, cannedTextTypeFK })
  }
}

const mapPropsToValues = ({ entity, user, cannedTextTypeFK }) => {
  const _entity = _.isEmpty(entity)
    ? { ...defaultEntity, ownedByUserFK: user.id, cannedTextTypeFK }
    : { ...entity }
  return {
    ..._entity,
    isEdit: !_.isEmpty(entity),
  }
}

const ValidationSchema = Yup.object().shape({
  title: Yup.string().required(),
  text: Yup.string().required(),
  sortOrder: Yup.number().when('isEdit', {
    is: (val) => val,
    then: Yup.number().required(),
  }),
})

export default withFormik({
  enableReinitialize: true,
  validationSchema: ValidationSchema,
  mapPropsToValues,
  handleSubmit,
})(Editor)
