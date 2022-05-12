import React, { PureComponent } from 'react'
import { connect } from 'dva'
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
import Authorized from '@/utils/Authorized'
import Contact from './Contact'

@connect(({ clinicSettings }) => ({
  clinicSettings: clinicSettings.settings,
}))
@withFormikExtend({
  authority: ['copayer.copayerdetails', 'copayer.newcopayer'],
  mapPropsToValues: ({ settingCompany }) =>
    settingCompany.entity || settingCompany.default,
  validationSchema: ({ settingCompany }) =>
    Yup.object().shape({
      code: Yup.string().when('settingCompany', {
        is: () =>
          settingCompany.companyType.id === 2 ||
          settingCompany.companyType.id === 3,
        then: Yup.string().required(),
      }),
      displayValue: Yup.string().required(),
      contactPerson: Yup.string().max(
        100,
        'Contact Person must be at most 100 characters',
      ),
      defaultStatementAdjustmentRemarks: Yup.string().when(
        ['isAutoGenerateStatementEnabled', 'statementAdjustment'],
        {
          is: (isAutoGenerateStatementEnabled, statementAdjustment) =>
            statementAdjustment > 0 && isAutoGenerateStatementEnabled,
          then: Yup.string()
            .required()
            .max(
              50,
              'Default statement ajdustment remarks must be at most 50 characters',
            ),
          otherwise: Yup.string(),
        },
      ),
      effectiveDates: Yup.array()
        .of(Yup.date())
        .min(2)
        .required(),
      coPayerTypeFK: Yup.number().when('settingCompany', {
        is: () => settingCompany.companyType.id === 1,
        then: Yup.number().required(),
        otherwise: Yup.number().nullable(),
      }),
      isAutoGenerateStatementEnabled: Yup.boolean().when('settingCompany', {
        is: () => settingCompany.companyType.id === 1,
        then: Yup.boolean().required(),
        otherwise: Yup.boolean().nullable(),
      }),
      adminCharge: Yup.number().when('settingCompany', {
        is: () => settingCompany.companyType.id === 1,
        then: Yup.number().min(0),
        otherwise: Yup.number().nullable(),
      }),
      statementAdjustment: Yup.number().when('settingCompany', {
        is: () => settingCompany.companyType.id === 1,
        then: Yup.number().min(0),
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
            emailAddress: Yup.string()
              .email()
              .nullable(),
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
      gstValue: Yup.number().when('isGSTEnabled', {
        is: v => v,
        then: Yup.number()
          .required()
          .moreThan(0),
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
    }).then(r => {
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

  updateDefaultRemarks = () => {
    const {
      isAutoGenerateStatementEnabled,
      statementAdjustment,
    } = this.props.values
    if (
      !isAutoGenerateStatementEnabled ||
      !statementAdjustment ||
      statementAdjustment === 0
    ) {
      this.props.setFieldValue('defaultStatementAdjustmentRemarks', undefined)
    }
  }

  render() {
    const { props } = this

    const editManufacturerAccessRight = Authorized.check(
      'settings.manufacturer.manufacturerdetails',
    ) || {
      rights: 'hidden',
    }
    const {
      theme,
      footer,
      values,
      settingCompany,
      route,
      rights,
      clinicSettings,
    } = props
    const { name } = route
    const isCopayer = name === 'copayer'
    const isSupplier = name === 'supplier'
    const {
      isUserMaintainable,
      isGSTEnabled,
      isAutoGenerateStatementEnabled,
      statementAdjustment,
    } = values

    let finalRights = isUserMaintainable ? 'enable' : 'disable'
    if (rights === 'disable') finalRights = 'disable'

    const { isEnableAutoGenerateStatement = false } = clinicSettings

    let hideConfirm = false
    if (isSupplier) {
      const right = Authorized.check('settings.supplier.supplierdetails') || {
        rights: 'hidden',
      }
      hideConfirm = values.id > 0 ? right.rights != 'enable' : false
    }
    if (isCopayer) {
      const right = Authorized.check('copayer.copayerdetails') || {
        rights: 'hidden',
      }
      hideConfirm = values.id > 0 ? right.rights != 'enable' : false
    }
    return (
      <React.Fragment>
        <AuthorizedContext.Provider
          value={{
            rights: finalRights,
          }}
        >
          <div style={{ margin: theme.spacing(1) }}>
            <GridContainer>
              <GridItem md={6}>
                <FastField
                  name='code'
                  render={args => (
                    <TextField
                      label={isCopayer ? 'Co-Payer Code' : 'Company Code'}
                      autoFocus
                      {...args}
                      disabled={isCopayer ? true : !!settingCompany.entity}
                    />
                  )}
                />
              </GridItem>
              <GridItem md={6}>
                <FastField
                  name='displayValue'
                  render={args => (
                    <TextField
                      label={isCopayer ? 'Co-Payer Name' : 'Company Name'}
                      {...args}
                    />
                  )}
                />
              </GridItem>

              <GridItem md={12}>
                <FastField
                  name='effectiveDates'
                  render={args => {
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
              {isCopayer && (
                <React.Fragment>
                  <GridItem md={6}>
                    <FastField
                      name='coPayerTypeFK'
                      render={args => (
                        <CodeSelect
                          label='Co-Payer Type'
                          code='ctCopayerType'
                          disabled
                          {...args}
                        />
                      )}
                    />
                  </GridItem>
                </React.Fragment>
              )}
              {(isCopayer || isSupplier) && (
                <React.Fragment>
                  <GridItem md={4}>
                    <Field
                      name='adminCharge'
                      render={args => {
                        if (values.adminChargeType === 'ExactAmount') {
                          return (
                            <NumberInput
                              currency
                              label='Corporate Charges'
                              defaultValue='0.00'
                              min={0}
                              precision={2}
                              {...args}
                            />
                          )
                        }
                        return (
                          <NumberInput
                            percentage
                            label='Corporate Charges'
                            defaultValue='0.00'
                            min={0}
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
                      render={args => (
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
                </React.Fragment>
              )}

              {isCopayer && (
                <React.Fragment>
                  <GridItem md={4}>
                    <Field
                      name='statementAdjustment'
                      render={args => {
                        if (values.statementAdjustmentType === 'ExactAmount') {
                          return (
                            <NumberInput
                              currency
                              label='Statement Adjustment'
                              defaultValue='0.00'
                              precision={2}
                              min={0}
                              onChange={this.updateDefaultRemarks}
                              {...args}
                            />
                          )
                        }
                        return (
                          <NumberInput
                            percentage
                            label='Statement Adjustment'
                            defaultValue='0.00'
                            precision={2}
                            onChange={this.updateDefaultRemarks}
                            min={0}
                            {...args}
                          />
                        )
                      }}
                    />
                  </GridItem>
                  <GridItem md={2}>
                    <Field
                      name='statementAdjustmentType'
                      render={args => (
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
                </React.Fragment>
              )}
              {isCopayer && (
                <React.Fragment>
                  <GridItem md={4}>
                    <Field
                      name='autoInvoiceAdjustment'
                      render={args => {
                        if (
                          values.autoInvoiceAdjustmentType === 'ExactAmount'
                        ) {
                          return (
                            <NumberInput
                              currency
                              label='Invoice Adjustment'
                              defaultValue='0.00'
                              precision={2}
                              {...args}
                            />
                          )
                        }
                        return (
                          <NumberInput
                            percentage
                            label='Invoice Adjustment'
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
                      name='autoInvoiceAdjustmentType'
                      render={args => (
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
                </React.Fragment>
              )}
              <React.Fragment>
                <GridItem md={2}>
                  {!isCopayer && isSupplier ? (
                    <div style={{ position: 'relative', top: 16 }}>
                      <CustomInput label='' disabled style={{ width: 0 }} />
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                        }}
                      >
                        <FastField
                          name='isGSTEnabled'
                          render={args => (
                            <Checkbox
                              label='Enable GST'
                              onChange={({ target: { value } }) => {
                                value
                                  ? this.props.setFieldValue(
                                      'gstValue',
                                      clinicSettings.gSTPercentageInt,
                                    )
                                  : this.props.setFieldValue('gstValue', '')
                              }}
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
                  {!isCopayer && isSupplier ? (
                    <Field
                      name='gstValue'
                      render={args => (
                        <NumberInput
                          label='GST Value'
                          {...args}
                          disabled={!isGSTEnabled}
                          suffix='%'
                          format='0.00'
                          precision={2}
                          notAllowDashNEqual
                        />
                      )}
                    />
                  ) : (
                    []
                  )}
                </GridItem>
              </React.Fragment>
            </GridContainer>

            {isCopayer && isEnableAutoGenerateStatement && (
              <GridContainer>
                <GridItem md={6}>
                  <FastField
                    name='isAutoGenerateStatementEnabled'
                    render={args => {
                      return (
                        <Checkbox
                          style={{ marginTop: '22px' }}
                          label='Auto Generate Statement'
                          {...args}
                          onChange={this.updateDefaultRemarks}
                        />
                      )
                    }}
                  />
                </GridItem>
                {isAutoGenerateStatementEnabled &&
                  statementAdjustment &&
                  statementAdjustment > 0 && (
                    <GridItem md={6}>
                      <Field
                        name='defaultStatementAdjustmentRemarks'
                        render={args => (
                          <TextField
                            label='Default Statement Adjustment Remarks'
                            maxLength={50}
                            {...args}
                          />
                        )}
                      />
                    </GridItem>
                  )}
              </GridContainer>
            )}
            {isCopayer && (
              <GridContainer>
                <GridItem md={12}>
                  <Field
                    name='remark'
                    render={args => <TextField label='Remarks' {...args} />}
                  />
                </GridItem>
              </GridContainer>
            )}

            <Contact theme={theme} type={name} />
          </div>
          {footer &&
            footer({
              onConfirm: hideConfirm ? undefined : props.handleSubmit,
              confirmBtnText: 'Save',
              confirmProps: {
                disabled: false,
                hidden: settingCompany.entity
                  ? editManufacturerAccessRight.rights == 'disable'
                  : null,
              },
            })}
        </AuthorizedContext.Provider>
      </React.Fragment>
    )
  }
}

export default Detail
