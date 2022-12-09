import React, { PureComponent } from 'react'
import _ from 'lodash'
import Yup from '@/utils/yup'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  TextField,
  DateRangePicker,
} from '@/components'

const styles = theme => ({})

@withFormikExtend({
  mapPropsToValues: ({ settingFrameType }) =>
    settingFrameType.entity || settingFrameType.default,
  validationSchema: Yup.object().shape({
    code: Yup.string().required(),
    displayValue: Yup.string().required(),
    effectiveDates: Yup.array()
      .of(Yup.date())
      .min(2)
      .required(),
  }),
  handleSubmit: (values, { props, resetForm }) => {
    const { effectiveDates, ...restValues } = values
    const { dispatch, onConfirm } = props
    dispatch({
      type: 'settingFrameType/upsert',
      payload: {
        ...restValues,
        effectiveStartDate: effectiveDates[0],
        effectiveEndDate: effectiveDates[1],
      },
    }).then(r => {
      if (r) {
        resetForm()
        if (onConfirm) onConfirm()
        dispatch({
          type: 'settingFrameType/query',
        })
      }
    })
  },
  displayName: 'FrameTypeDetail',
})
class Detail extends PureComponent {
  render() {
    const { props } = this
    const { theme, footer, settingFrameType } = props
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
                      {...args}
                      disabled={!!settingFrameType.entity}
                    />
                  )
                }}
              ></FastField>
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='displayValue'
                render={args => {
                  return <TextField label='Display Value' {...args} />
                }}
              ></FastField>
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
              ></FastField>
            </GridItem>
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
