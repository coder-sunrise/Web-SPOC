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
import Contact from '@/pages/Setting/Company/Contact'
import settingReferralSource from "../ReferralSource/models/index"

window.g_app.replaceModel(settingReferralSource)

@withFormikExtend({
  mapPropsToValues: ({ settingReferralPerson }) =>
    settingReferralPerson.entity || settingReferralPerson.default,
  validationSchema: Yup.object().shape({
    name: Yup.string().required(),
    referralSourceIds: Yup.string().required(),
    effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
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
    }).then((r) => {
      if (r) {
        resetForm()
        if (onConfirm) onConfirm()
        dispatch({
          type: 'settingReferralPerson/query',
        })
      }
    })
  },
  displayName: 'ReferralPersonDetail',
})
class Detail extends PureComponent {
  state = { referralSource: [] }

  componentDidMount = async () => {
    this.props.dispatch({
      type: 'settingReferralSource/query',
      payload: {
        pagesize: 9999,
      },
    })
      .then((response) => {
        const { data } = response || []
        const templateOptions = data
          .filter((template) => template.isActive)
          .map((template) => {
            return {
              ...template,
              value: template.id,
              name: template.name,
            }
          })
        this.setState({ referralSource: templateOptions })
      })
  }

  render () {
    const { props } = this
    const { theme, footer, settingReferralPerson } = props
    return (
      <React.Fragment>
        <div style={{ margin: theme.spacing(1) }}>
          <GridContainer>
            <GridItem md={6}>
              <FastField
                name='name'
                render={(args) => (
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
                render={(args) => (
                  <CodeSelect
                    {...args}
                    options={this.state.referralSource}
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
            <GridItem md={6}>
              <FastField
                name='remarks'
                render={(args) => (
                  <TextField label='Remarks' multiline {...args} />
                )}
              />
            </GridItem>
          </GridContainer>
          <Contact theme={theme} type='referral' />
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
