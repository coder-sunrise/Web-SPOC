import React, { PureComponent } from 'react'
import _ from 'lodash'
import Yup from '@/utils/yup'
import {
  withFormikExtend,
  FastField,
  Select,
  GridContainer,
  GridItem,
  TextField,
  DateRangePicker,
} from '@/components'
import { tagCategory } from '@/utils/codes'
import { connect } from 'dva'

@connect(({ clinicSettings }) => ({
  clinicSettings,
}))
@withFormikExtend({
  mapPropsToValues: ({ settingTag }) => settingTag.entity || settingTag.default,
  // Add validation
  validationSchema: Yup.object().shape({
    category: Yup.string().required(),
    displayValue: Yup.string()
      .required()
      .matches(/^[0-9a-zA-Z \b]+$/, 'Cannot enter special characters'),
    effectiveDates: Yup.array()
      .of(Yup.date())
      .min(2)
      .required(),
  }),
  handleSubmit: (values, { props, resetForm }) => {
    const { effectiveDates, displayValue, ...restValues } = values
    const { dispatch, onConfirm } = props
    dispatch({
      type: 'settingTag/upsert',
      payload: {
        ...restValues,
        displayValue: displayValue.trim(),
        effectiveStartDate: effectiveDates[0],
        effectiveEndDate: effectiveDates[1],
      },
    }).then(r => {
      if (r) {
        resetForm()
        if (onConfirm) onConfirm()
        dispatch({
          type: 'settingTag/query',
        })
      }
    })
  },
  displayName: 'TagDetail',
})
class Detail extends PureComponent {
  state = {}

  render() {
    const { theme, footer, settingTag, tagCategoryOptions } = this.props
    console.log('tag detail render', this.props)
    return (
      <React.Fragment>
        <div style={{ margin: theme.spacing(1) }}>
          <GridContainer>
            <GridItem md={6}>
              <FastField
                name='category'
                render={args => (
                  <Select
                    label='Category'
                    options={tagCategoryOptions}
                    disabled={!!settingTag.entity}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='displayValue'
                render={args => (
                  <TextField
                    label='Display Value'
                    {...args}
                    maxLength={20}
                    inputProps={{ maxLength: 20 }}
                  />
                )}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='effectiveDates'
                render={args => {
                  return (
                    <DateRangePicker
                      label='Effective Start Date'
                      label2='End Date'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            {this.props.values.category == 'PatientDocument' && (
              <GridItem md={6}>
                <FastField
                  name='folderMapping'
                  render={args => (
                    <TextField
                      label='Folder Mapping'
                      {...args}
                      maxLength={2000}
                      inputProps={{ maxLength: 2000 }}
                    />
                  )}
                />
              </GridItem>
            )}
            <GridItem md={12}>
              <FastField
                name='description'
                render={args => {
                  return (
                    <TextField
                      label='Description'
                      multiline
                      rowsMax={4}
                      {...args}
                      maxLength={2000}
                      inputProps={{ maxLength: 2000 }}
                    />
                  )
                }}
              />
            </GridItem>
          </GridContainer>
        </div>
        {footer &&
          footer({
            onConfirm: this.props.handleSubmit,
            confirmBtnText: 'Save',
            confirmProps: {
              disabled: false,
            },
          })}
      </React.Fragment>
    )
  }
}

export default Detail
