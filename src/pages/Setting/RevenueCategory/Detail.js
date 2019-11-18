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
} from '@/components'

const styles = (theme) => ({})

@withFormikExtend({
  mapPropsToValues: ({ settingRevenue }) =>
    settingRevenue.entity || settingRevenue.default,
  validationSchema: Yup.object().shape({
    code: Yup.string().required(),
    displayValue: Yup.string().required(),
    effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
  }),
  handleSubmit: (values, { props, resetForm }) => {
    const { effectiveDates, ...restValues } = values
    const { dispatch, onConfirm } = props
    dispatch({
      type: 'settingRevenue/upsert',
      payload: {
        ...restValues,
        effectiveStartDate: effectiveDates[0],
        effectiveEndDate: effectiveDates[1],
      },
    }).then((r) => {
      if (r) {
        resetForm()
        if (onConfirm) onConfirm()
        dispatch({
          type: 'settingRevenue/query',
        })
      }
    })
  },
  displayName: 'RevenueDetail',
})
class Detail extends PureComponent {
  state = {}

  render () {
    const { props } = this
    const { classes, theme, footer, values, settingRevenue } = props
    // console.log('detail', props)
    return (
      <React.Fragment>
        <div style={{ margin: theme.spacing(1) }}>
          <GridContainer>
            <GridItem md={6}>
              <FastField
                name='code'
                render={(args) => (
                  <TextField
                    label='Code'
                    autoFocus
                    {...args}
                    disabled={!!settingRevenue.entity}
                  />
                )}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='displayValue'
                render={(args) => <TextField label='Display Value' {...args} />}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='effectiveDates'
                render={(args) => {
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
