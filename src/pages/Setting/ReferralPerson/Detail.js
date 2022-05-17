import React, { PureComponent } from 'react'
import Yup from '@/utils/yup'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  TextField,
  Field,
  DateRangePicker,
  CodeSelect,
} from '@/components'
import { connect } from 'dva'
import Contact from '@/pages/Setting/Company/Contact'

@connect(({ settingReferralPerson }) => ({
  settingReferralPerson,
}))
@withFormikExtend({
  mapPropsToValues: ({ settingReferralPerson }) => {
    let entity = settingReferralPerson.entity || settingReferralPerson.default
    let referralSourceIds = (entity.referralSources || []).map(x => x.id)
    return { ...entity, referralSourceIds }
  },
  validationSchema: Yup.object().shape({
    name: Yup.string().required(),
    referralSourceIds: Yup.string().required(),
    effectiveDates: Yup.array()
      .of(Yup.date())
      .min(2)
      .required(),
  }),
  handleSubmit: (values, { props, resetForm }) => {
    const { effectiveDates, ...restValues } = values
    const { dispatch, onConfirm } = props
    dispatch({
      type: 'settingReferralPerson/upsert',
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
          type: 'settingReferralPerson/query',
        })

        dispatch({
          type: 'settingReferralPerson/updateState',
          payload: { entity: undefined },
        })
      }
    })
  },
  displayName: 'ReferralPersonDetail',
})
class Detail extends PureComponent {
  render() {
    const { props } = this
    const { theme, footer, settingReferralPerson, referralSource } = props
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
                      disabled={!!settingReferralPerson.entity}
                    />
                  )}
                />
              </GridItem>

              <GridItem md={6}>
                <Field
                  name='referralSourceIds'
                  render={args => (
                    <CodeSelect
                      {...args}
                      options={referralSource}
                      labelField='name'
                      mode='multiple'
                      label='Referral Source'
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
              <GridItem md={6}>
                <FastField
                  name='remarks'
                  render={args => (
                    <TextField label='Remarks' multiline {...args} />
                  )}
                />
              </GridItem>
            </GridContainer>
            <Contact theme={theme} type='referralperson' />
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
