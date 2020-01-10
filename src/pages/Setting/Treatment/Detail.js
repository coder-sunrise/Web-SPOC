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
} from '@/components'

const styles = (theme) => ({})

@withFormikExtend({
  mapPropsToValues: ({ settingTreatment }) =>
    settingTreatment.entity || settingTreatment.default,
  validationSchema: Yup.object().shape({
    code: Yup.string().required(),
    displayValue: Yup.string().required(),
    effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
  }),
  handleSubmit: (values, { props, resetForm }) => {
    const { effectiveDates, treatmentCategory, revenueCategory, chartMethod, ...restValues } = values
    const { dispatch, onConfirm } = props
console.log('submit', restValues)
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
    let { classes, theme, footer, values } = props
    // console.log('detail', props)
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
            <GridItem xs={1}>
                  <div
                  render={(row) =>{
                    const{chartMethod} = row 
                    if(chartMethod){
                      return(
                        <img
                        src={chartMethod.image}
                        width="50px"
                        height="50px"
                        />
                      )
                    }
                    return ''
                  }}
                  >
                  </div>
                </GridItem>
                <GridItem xs={5}>
                <FastField
                    name='chartMethodFK'
                    render={(args) => {
                      return (
                        <CodeSelect
                          label='Chart Method'
                          code='CTChartMethod'
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
                      return (
                        <TextField
                          label='Cost'
                          type='number'
                          prefix="$"
                          {...args}
                        />
                      )
                    }}
                  />
                </GridItem>
                <GridItem xs={6}>
                  <FastField
                    name='sellingPrice'
                    render={(args) => {
                      return (
                        <TextField
                          label='Selling Price/Unit'
                          type='number'
                          prefix="$"
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
