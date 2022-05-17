import React, { PureComponent } from 'react'
import Yup from '@/utils/yup'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  TextField,
  DateRangePicker,
} from '@/components'
import Contact from '@/pages/Setting/Company/Contact'

@withFormikExtend({
  mapPropsToValues: ({ settingReferralSource }) =>
    settingReferralSource
      ? settingReferralSource.entity || settingReferralSource.default
      : {},
  validationSchema: Yup.object().shape({
    name: Yup.string().required(),
    effectiveDates: Yup.array()
      .of(Yup.date())
      .min(2)
      .required(),
  }),
  handleSubmit: (values, { props, resetForm }) => {
    const { effectiveDates, ...restValues } = values
    const { dispatch, onConfirm } = props
    dispatch({
      type: 'settingReferralSource/upsert',
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
          type: 'settingReferralSource/query',
          payload: {
            pagesize: 9999,
          },
        })
      }
    })
  },
  displayName: 'ReferralSourceDetail',
})
class Detail extends PureComponent {
  state = {}

  render() {
    const { props } = this
    const { theme, footer, settingReferralSource } = props
    return (
      <React.Fragment>
        <GridContainer
          style={{
            height: 450,
            alignItems: 'start',
            overflowY: 'scroll',
          }}
        >
          <div style={{ margin: theme.spacing(1) }}>
            <GridContainer>
              <GridItem md={6}>
                <FastField
                  name='name'
                  render={args => (
                    <TextField
                      label='Name'
                      autoFocus
                      {...args}
                      disabled={
                        settingReferralSource && !!settingReferralSource.entity
                      }
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
              <GridItem md={12}>
                <FastField
                  name='remarks'
                  render={args => (
                    <TextField label='Remarks' multiline {...args} />
                  )}
                />
              </GridItem>
            </GridContainer>
            <Contact theme={theme} type='referralsource' />
          </div>
        </GridContainer>
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
