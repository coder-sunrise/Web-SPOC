import React, { PureComponent } from 'react'
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
  dateFormatLong,
  Checkbox,
  CustomInput,
} from '@/components'
import AuthorizedContext from '@/components/Context/Authorized'
import Contact from './Contact'

@withFormikExtend({
  mapPropsToValues: ({ settingCompany }) =>
    settingCompany.entity || settingCompany.default,
  validationSchema: ({ settingCompany }) =>
    Yup.object().shape({
      code: Yup.string().required(),
      displayValue: Yup.string().required(),
      contactPerson: Yup.string().max(
        100,
        'Contact Person must be at most 100 characters',
      ),
      effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
      coPayerTypeFK: Yup.number().when('settingCompany', {
        is: () => settingCompany.companyType.id === 1,
        then: Yup.number().required(),
        otherwise: Yup.number().nullable(),
      }),

      url: Yup.object().when('settingCompany', {
        is: () => settingCompany.companyType.id === 1,
        then: Yup.object().shape({
          contactWebsite: Yup.object().shape({
            website: Yup.string().url(),
          }),
        }),
      }),
      // contact.contactAddress[0].postcode
      contact: Yup.object().when('settingCompany', {
        is: () => settingCompany.companyType.id === 1,
        then: Yup.object().shape({
          contactEmailAddress: Yup.object().shape({
            emailAddress: Yup.string().email().nullable(),
          }),

          contactAddress: Yup.array().of(
            Yup.object().shape({
              postcode: Yup.string().max(
                10,
                'The postcode should not more than 10 digits',
              ),
            }),
          ),
        }),
        otherwise: Yup.object().shape({
          contactAddress: Yup.array().of(
            Yup.object().shape({
              postcode: Yup.string().max(
                10,
                'The postcode should not more than 10 digits',
              ),
            }),
          ),
        }),
      }),
    }),

  handleSubmit: (values, { props, resetForm }) => {
    const { effectiveDates, ...restValues } = values

    const { dispatch, onConfirm, settingCompany } = props
    const { id, name } = settingCompany.companyType
    dispatch({
      type: 'settingCompany/upsert',
      payload: {
        ...restValues,
        effectiveStartDate: effectiveDates[0],
        effectiveEndDate: effectiveDates[1],
        companyTypeFK: id,
        companyTypeName: name,
      },
    }).then((r) => {
      if (r) {
        resetForm()
        if (onConfirm) onConfirm()
        dispatch({
          type: 'settingCompany/query',
          payload: {
            companyTypeFK: id,
          },
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
    const { theme, footer, values, settingCompany, route } = props
    const { name } = route
    const type = 'copayer'
    const { isUserMaintainable, isGSTEnabled } = values
    return (
      <React.Fragment>
        <AuthorizedContext.Provider
          value={{
            rights: isUserMaintainable ? 'enable' : 'disable',
          }}
        >
          <div style={{ margin: theme.spacing(1) }}>
            <GridContainer>
              <GridItem md={6}>
                <FastField
                  name='code'
                  render={(args) => (
                    <TextField
                      label={name === type ? 'Co-Payer Code' : 'Company Code'}
                      autoFocus
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
                        format={dateFormatLong}
                        label='Effective Start Date'
                        label2='End Date'
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>

              <GridItem md={6}>
                {name === type ? (
                  <FastField
                    name='coPayerTypeFK'
                    render={(args) => (
                      <CodeSelect
                        label='Co-Payer Type'
                        code='ctCopayerType'
                        disabled
                        {...args}
                      />
                    )}
                  />
                ) : (
                  []
                )}
              </GridItem>
              <GridItem md={6} />

              <GridItem md={4}>
                <Field
                  name='adminCharge'
                  render={(args) => {
                    if (values.adminChargeType === 'ExactAmount') {
                      return (
                        <NumberInput
                          currency
                          label='Admin Fee'
                          defaultValue='0.00'
                          precision={2}
                          {...args}
                        />
                      )
                    }
                    return (
                      <NumberInput
                        percentage
                        label='Admin Fee'
                        defaultValue='0.00'
                        precision={2}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem md={2}>
                <Field
                  name='adminChargeType'
                  render={(args) => (
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

              <GridItem md={2}>
                {name !== type ? (
                  <div style={{ position: 'relative' }}>
                    <CustomInput label='' disabled style={{ width: 0 }} />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                      }}
                    >
                      <Field
                        name='isGSTEnabled'
                        render={(args) => (
                          <Checkbox
                            label='Enable GST'
                            onChange={this.handleOnChange}
                            {...args}
                          />
                        )}
                      />
                    </div>
                  </div>
                ) : (
                  []
                )}
              </GridItem>
              <GridItem md={4}>
                {name !== type ? (
                  <Field
                    name='gstValue'
                    render={(args) => (
                      <NumberInput
                        label='GST Value'
                        {...args}
                        disabled={!isGSTEnabled}
                        suffix='%'
                        format='0.00'
                        precision={2}
                      />
                    )}
                  />
                ) : (
                  []
                )}
              </GridItem>
            </GridContainer>

            <Contact theme={theme} type={name} />
          </div>
          {footer &&
            footer({
              onConfirm: props.handleSubmit,
              confirmBtnText: 'Save',
              confirmProps: {
                disabled: false,
              },
            })}
        </AuthorizedContext.Provider>
      </React.Fragment>
    )
  }
}

export default Detail
