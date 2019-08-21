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
  Switch,
  Field,
  NumberInput,
} from '@/components'
import Contact from './Contact'

const styles = (theme) => ({})

@withFormikExtend({
  mapPropsToValues: ({ settingCompany }) =>
    settingCompany.entity || settingCompany.default,
  validationSchema: Yup.object().shape({
    code: Yup.string().required(),
    displayValue: Yup.string().required(),
    effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
  }),
  handleSubmit: (values, { props }) => {
    const {
      url,
      country,
      postalCode,
      mobileFaxNum,
      address,
      officeNum,
      email,
      effectiveDates,
      ...restValues
    } = values

    const { dispatch, onConfirm, settingCompany } = props
    const { id, code, name } = settingCompany.companyType
    dispatch({
      type: 'settingCompany/upsert',
      payload: {
        ...restValues,
        effectiveStartDate: effectiveDates[0],
        effectiveEndDate: effectiveDates[1],
        companyTypeFK: id,
        companyTypeName: name,
        // contact: {
        //   contactAddress: [
        //     {
        //       street: address,
        //       postcode: postalCode,
        //       countryFK: country,
        //     },
        //   ],
        // },
      },
    }).then((r) => {
      if (r) {
        if (onConfirm) onConfirm()
        dispatch({
          type: 'settingCompany/query',
        })
      }
    })
  },
  displayName: 'CompanyDetail',
})
class Detail extends PureComponent {
  state = {}

  render () {
    const { props } = this
    const { classes, theme, footer, values, settingCompany, route } = props
    const { name } = route
    const type = 'copayer'
    console.log('detail', settingCompany)
    return (
      <React.Fragment>
        <div style={{ margin: theme.spacing(1) }}>
          <GridContainer>
            <GridItem md={6}>
              <FastField
                name='code'
                render={(args) => (
                  <TextField
                    label={name === type ? 'Co-Payer Code' : 'Company Code'}
                    autoFocused
                    {...args}
                    disabled={!!settingCompany.entity}
                  />
                )}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='displayValue'
                render={(args) => (
                  <TextField
                    label={name === type ? 'Co-Payer Name' : 'Company Name'}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem md={12}>
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

            <GridContainer>
              <GridItem md={6}>
                {name === type ? (
                  <FastField
                    name='coPayerTypeFK'
                    render={(args) => (
                      <CodeSelect
                        label='Co-Payer Type'
                        code='ctCopayerType'
                        {...args}
                      />
                    )}
                  />
                ) : (
                  []
                )}
              </GridItem>
            </GridContainer>

            <GridItem md={6}>
              <Field
                name='paymentTerm'
                render={(args) => {
                  if (values.adminChargeType) {
                    return <NumberInput currency label='Admin Fee' {...args} />
                  }
                  return <NumberInput percentage label='Admin Fee' {...args} />
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='adminChargeType'
                render={(args) => (
                  <Switch
                    checkedChildren='$'
                    unCheckedChildren='%'
                    label=''
                    {...args}
                  />
                )}
              />
            </GridItem>
          </GridContainer>

          <Contact theme={theme} name={name} />
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
