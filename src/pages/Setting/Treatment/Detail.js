import React, { PureComponent } from 'react'
import _ from 'lodash'
import { formatMessage, FormattedMessage } from 'umi/locale'
import Yup from '@/utils/yup'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  TextField,
  DateRangePicker,
  CodeSelect,
  NumberInput,
} from '@/components'
import Legend from '@/pages/Development/DentalChart/Setup/Legend'

const styles = (theme) => ({})

@withFormikExtend({
  mapPropsToValues: ({ settingTreatment }) =>
    settingTreatment.entity || settingTreatment.default,
  validationSchema: Yup.object().shape({
    code: Yup.string().required(),
    displayValue: Yup.string().required(),
    effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
    treatmentCategoryFK: Yup.number().required(),
  }),
  handleSubmit: (values, { props, resetForm }) => {
    const {
      effectiveDates,
      treatmentCategory,
      revenueCategory,
      chartMethod,
      ...restValues
    } = values
    const { dispatch, onConfirm } = props
    dispatch({
      type: 'settingTreatment/upsert',
      payload: {
        ...restValues,
        effectiveStartDate: effectiveDates[0],
        effectiveEndDate: effectiveDates[1],
        roomStatusFK: 1,
      },
    }).then((r) => {
      if (r) {
        if (onConfirm) onConfirm()
        dispatch({
          type: 'settingTreatment/query',
        })
      }
    })
  },
  displayName: 'TreatmentDetail',
})
class Detail extends PureComponent {
  render () {
    const { props } = this
    let { classes, theme, footer, values, codetable } = props
    const { ctchartmethod } = codetable
    // console.log('detail', props)
    const row = ctchartmethod.find((o) => o.id === values.chartMethodFK)
    return (
      <React.Fragment>
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
            {/* <GridItem xs={1}>
              <div
                render={(row) => {
                  const { chartMethod } = row
                  if (chartMethod) {
                    return (
                      <img src={chartMethod.image} width='50px' height='50px' />
                    )
                  }
                  return ''
                }}
              />
            </GridItem> */}
            <GridItem xs={6}>
              <FastField
                name='chartMethodFK'
                render={(args) => {
                  return (
                    <CodeSelect
                      label='Chart Method'
                      code='ctchartmethod'
                      prefix={row ? <Legend row={row} viewOnly /> : null}
                      labelField='displayValue'
                      renderDropdown={(option) => {
                        const { displayValue } = option
                        return (
                          <p style={{ lineHeight: '24px' }}>
                            <Legend row={option} viewOnly />
                            <span style={{ marginLeft: theme.spacing(1) }}>
                              {displayValue}
                            </span>
                          </p>
                        )
                      }}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={6}>
              <FastField
                name='treatmentCategoryFK'
                render={(args) => {
                  return (
                    <CodeSelect
                      label='Treatment Category'
                      code='CTTreatmentCategory'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={6}>
              <FastField
                name='revenueCategoryFK'
                render={(args) => {
                  return (
                    <CodeSelect
                      label='Revenue Category'
                      code='CTRevenueCategory'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={6}>
              <FastField
                name='costPrice'
                render={(args) => {
                  return <NumberInput currency label='Cost' {...args} />
                }}
              />
            </GridItem>
            <GridItem xs={6}>
              <FastField
                name='sellingPrice'
                render={(args) => {
                  return (
                    <NumberInput
                      currency
                      label='Selling Price/Unit'
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
