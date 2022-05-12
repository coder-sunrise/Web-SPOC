import React, { PureComponent } from 'react'
import _ from 'lodash'
import Yup from '@/utils/yup'
import {
  withFormikExtend,
  FastField,
  Field,
  NumberInput,
  GridContainer,
  GridItem,
  Switch,
  TextField,
  DateRangePicker,
} from '@/components'

@withFormikExtend({
  mapPropsToValues: ({ settingInvoiceAdjustment }) =>
    settingInvoiceAdjustment.entity || settingInvoiceAdjustment.default,
  validationSchema: Yup.object().shape({
    code: Yup.string().required(),
    displayValue: Yup.string().required(),
    description: Yup.string().required(),
    adjValue: Yup.number()
      .required()
      .notOneOf([0], 'Adjustment value cannot be 0.'),
    adjType: Yup.string().required(),
    sortOrder: Yup.number().required(),
    effectiveDates: Yup.array()
      .of(Yup.date())
      .min(2)
      .required(),
  }),
  handleSubmit: (values, { props, resetForm }) => {
    const { effectiveDates, ...restValues } = values
    const { dispatch, onConfirm } = props

    dispatch({
      type: 'settingInvoiceAdjustment/upsert',
      payload: {
        ...restValues,
        effectiveStartDate: effectiveDates[0],
        effectiveEndDate: effectiveDates[1],
      },
    }).then(r => {
      if (r) {
        if (onConfirm) onConfirm()
        dispatch({
          type: 'settingInvoiceAdjustment/query',
        })
      }
    })
  },
  displayName: 'InvoiceAdjustmentDetail',
})
class Detail extends PureComponent {
  render() {
    const { props } = this
    let { classes, theme, footer, values } = props
    return (
      <React.Fragment>
        <div style={{ margin: theme.spacing(1) }}>
          <GridContainer>
            <GridItem md={6}>
              <FastField
                name='code'
                render={args => {
                  return (
                    <TextField
                      label='Code'
                      autoFocus
                      disabled={!!values.id}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='displayValue'
                render={args => {
                  return <TextField label='Display Value' {...args} />
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='effectiveDates'
                render={args => {
                  return (
                    <DateRangePicker
                      // showTime
                      label='Effective Start Date'
                      label2='End Date'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={5}>
              <Field
                name='adjValue'
                render={args => {
                  if (values.adjType === 'ExactAmount') {
                    return (
                      <NumberInput
                        currency
                        label='Invoice Adjustment'
                        defaultValue='0.00'
                        precision={2}
                        {...args}
                      />
                    )
                  }
                  return (
                    <NumberInput
                      percentage
                      label='Invoice Adjustment'
                      defaultValue='0.00'
                      precision={2}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={1}>
              <Field
                name='adjType'
                render={args => (
                  <Switch
                    checkedChildren='$'
                    checkedValue='ExactAmount'
                    unCheckedChildren='%'
                    unCheckedValue='Percentage'
                    label=' '
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='description'
                render={args => {
                  return (
                    <TextField
                      label='Remarks'
                      multiline
                      rowsMax={4}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='sortOrder'
                render={args => {
                  return (
                    <NumberInput
                      label='Sort Order'
                      defaultValue='0'
                      precision={0}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
          </GridContainer>
        </div>
        {footer &&
          footer({
            onConfirm: props.handleSubmit,
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
