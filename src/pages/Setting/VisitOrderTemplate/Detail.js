import React, { PureComponent, Fragment } from 'react'
import Yup from '@/utils/yup'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  TextField,
  DateRangePicker,
} from '@/components'
import { InventoryItemList } from '@/components/_medisys'

@withFormikExtend({
  mapPropsToValues: ({ settingVisitOrderTemplate }) =>
    settingVisitOrderTemplate.entity || settingVisitOrderTemplate.default,
  validationSchema: Yup.object().shape({
    code: Yup.string().required(),
    displayValue: Yup.string().required(),
    effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
  }),
  handleSubmit: (values, { props }) => {
    const { effectiveDates, ...restValues } = values
    const { dispatch, onConfirm } = props

    dispatch({
      type: 'settingVisitOrderTemplate/upsert',
      payload: {
        ...restValues,
        effectiveStartDate: effectiveDates[0],
        effectiveEndDate: effectiveDates[1],
      },
    }).then((r) => {
      if (r) {
        if (onConfirm) onConfirm()
        dispatch({
          type: 'settingVisitOrderTemplate/query',
        })
      }
    })
  },
  displayName: 'VisitOrderTemplateDetail',
})
class Detail extends PureComponent {
  render () {
    const { theme, footer, values, handleSubmit, setFieldValue } = this.props
    return (
      <Fragment>
        <div style={{ margin: theme.spacing(1) }}>
          <GridContainer>
            <GridItem md={6}>
              <FastField
                name='code'
                render={(args) => {
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
                render={(args) => {
                  return <TextField label='Display Value' {...args} />
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='effectiveDates'
                render={(args) => {
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
            <GridItem md={12}>
              <FastField
                name='description'
                render={(args) => {
                  return (
                    <TextField
                      label='Description'
                      multiline
                      rowsMax={4}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
          </GridContainer>

          <InventoryItemList {...this.props} includeOrderSet />

          {values.showSubmmittedData && (
            <pre>{JSON.stringify(values, null, 2)}</pre>
          )}
        </div>
        {footer &&
          footer({
            onConfirm: () => setFieldValue('showSubmmittedData', values),
            confirmBtnText: 'Save',
            confirmProps: {
              disabled: false,
            },
          })}
      </Fragment>
    )
  }
}

export default Detail
