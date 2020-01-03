import React, { PureComponent } from 'react'
import { FastField, withFormik } from 'formik'
import _ from 'lodash'
import { withStyles } from '@material-ui/core'
import Yup from '@/utils/yup'
import { getBizSession } from '@/services/queue'
import {
  GridContainer,
  GridItem,
  TextField,
  Field,
  DateRangePicker,
  Switch,
  EditableTableGrid,
  CodeSelect,
  withFormikExtend,
  notification,
} from '@/components'

const styles = (theme) => ({
  sectionHeader: {
    fontWeight: 400,
  },
  treatmentSettingstyle: {
    margin: theme.spacing(2),
    color: '#cf1322',
    fontSize: ' 0.75rem',
    minHeight: '1em',
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    fontWeight: 400,
    lineHeight: '1em',
    letterSpacing: ' 0.03333em',
  },
})

const itemSchema = Yup.object().shape({
  serviceCenterFK: Yup.string().required(),
  costPrice: Yup.number().required(),
  unitPrice: Yup.number().required(),
})
// const itemSchema = Yup.array()
//   .compact((item) => item.isDeleted)
//   .unique(
//     (v) => {
//       console.log({ v })
//       return v.serviceCenterFK
//     },
//     'error',
//     () => {
//       // notification.error({
//       //   message: 'The Schemes record already exists in the system',
//       // })
//     },
//   )
//   .of(
//     Yup.object().shape({
//       serviceCenterFK: Yup.string().required(),
//       costPrice: Yup.number().required(),
//       unitPrice: Yup.number().required(),
//     }),
//   )

@withFormikExtend({
  mapPropsToValues: ({ settingClinicService }) => {
    // console.log('settingClinicService', settingClinicService)
    const returnValue =
      settingClinicService.entity || settingClinicService.default
    const { isAutoOrder, ctServiceCenter_ServiceNavigation } = returnValue
    if (isAutoOrder) {
      const checkDefaultExist = ctServiceCenter_ServiceNavigation.find(
        (o) => o.isDefault === true,
      )
      if (!checkDefaultExist && ctServiceCenter_ServiceNavigation.length > 0) {
        ctServiceCenter_ServiceNavigation[0].isDefault = true
      }
    }

    return returnValue
  },

  validationSchema: Yup.object().shape({
    code: Yup.string().required(),
    displayValue: Yup.string().required(),
    treatmentCategoryFK: Yup.string().required(),
    revenueCategoryFK: Yup.string().required(),
    effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
    serviceSettingItem: Yup.array().compact((v) => v.isDeleted).of(itemSchema),
    ctServiceCenter_ServiceNavigation: Yup.array()
      .compact((v) => v.isDeleted)
      .required('At least one service setting is required.'),
  }),
  handleSubmit: (values, { props, resetForm }) => {
    const { effectiveDates, ...restValues } = values
    const { dispatch, onConfirm } = props
    // console.log('handleSubmit', values)
    dispatch({
      type: 'settingClinicService/upsert',
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
          type: 'settingClinicService/query',
        })

        dispatch({
          type: 'codetable/fetchCodes',
          payload: {
            code: 'ctservice',
            filter: {
              'serviceFKNavigation.IsActive': true,
              'serviceCenterFKNavigation.IsActive': true,
              combineCondition: 'and',
            },
          },
        })
      }
    })
  },
  validate: (values) => {
    const errors = {}
    if (
      values.isMedisaveHealthScreening &&
      values.medisaveHealthScreeningDiagnosisFK == null
    ) {
      errors.medisaveHealthScreeningDiagnosisFK = 'This is a required field'
    }

    if (values.isOutpatientScan && values.outPatientScanDiagnosisFK == null) {
      errors.outPatientScanDiagnosisFK = 'This is a required field'
    }
    return errors
  },
  displayName: 'ServiceTreatment',
})
class Detail extends PureComponent {
  state = {
    ddlMedisaveHealthScreening: true,
    ddlOutpatientScan: true,
    treatmentSettings: this.props.values.ctServiceCenter_ServiceNavigation,
  }

  // tableParas = {
  //   columns: [
  //     { name: 'serviceCenterFK', title: 'Service Center' },
  //     { name: 'costPrice', title: 'Cost' },
  //     { name: 'unitPrice', title: 'Selling Price/Unit' },
  //     { name: 'isDefault', title: 'Default' },
  //   ],
  //   columnExtensions: [
  //     {
  //       columnName: 'serviceCenterFK',
  //       type: 'codeSelect',
  //       code: 'ctServiceCenter',
  //       onChange: ({ val, row }) => {
  //         const { treatmentSettings } = this.state
  //         const rs = treatmentSettings.filter(
  //           (o) => !o.isDeleted && o.serviceCenterFK === val && o.id !== row.id,
  //         )
  //         if (rs.length > 0) {
  //           notification.error({
  //             message: 'The service center already exist in the list',
  //           })
  //         }
  //       },
  //     },
  //     { columnName: 'costPrice', type: 'number', currency: true },
  //     { columnName: 'unitPrice', type: 'number', currency: true },
  //     {
  //       columnName: 'isDefault',
  //       type: 'radio',
  //       checkedValue: true,
  //       uncheckedValue: false,
  //       onChange: ({ row, checked }) => {
  //         // console.log(this)
  //         if (checked) {
  //           const { values, setFieldValue, setFieldTouched } = this.props
  //           const serviceSettingItem = _.cloneDeep(
  //             values.ctServiceCenter_ServiceNavigation,
  //           )
  //           serviceSettingItem.forEach((pec) => {
  //             pec.isDefault = false
  //           })
  //           const r = serviceSettingItem.find((o) => o.id === row.id)
  //           if (r) {
  //             r.isDefault = true
  //           }
  //           this.setState({ treatmentSettings: serviceSettingItem })
  //           setFieldValue(
  //             'ctServiceCenter_ServiceNavigation',
  //             serviceSettingItem,
  //           )
  //           setFieldTouched('ctServiceCenter_ServiceNavigation', true)
  //         }
  //       },
  //     },
  //   ],
  // }

  componentDidMount () {
    this.checkHasActiveSession()
  }

  checkHasActiveSession = async () => {
    const bizSessionPayload = {
      IsClinicSessionClosed: false,
    }
    const result = await getBizSession(bizSessionPayload)
    const { data } = result.data
    this.setState(() => {
      return {
        hasActiveSession: data.length > 0,
      }
    })
  }

  initMedisaveSetting = () => {
    const { settingClinicService } = this.props
    if (settingClinicService.entity) {
      this.setState({
        ddlMedisaveHealthScreening:
          settingClinicService.entity.isMedisaveHealthScreening,
        ddlOutpatientScan: settingClinicService.entity.isOutpatientScan,
      })
    }
  }

  onChangeMedisaveHealthScreening = () => {
    this.setState(({ ddlMedisaveHealthScreening }) => ({
      ddlMedisaveHealthScreening: !ddlMedisaveHealthScreening,
    }))
  }

  onChangeOutpatientScan = () => {
    this.setState(({ ddlOutpatientScan }) => ({
      ddlOutpatientScan: !ddlOutpatientScan,
    }))
  }

  checkIsServiceCenterUnique = ({ rows, changed }) => {
    if (!changed) return rows
    const key = Object.keys(changed)[0]
    const obj = changed[key]
    if (obj.serviceCenterFK !== undefined) {
      const hasDuplicate = rows.filter(
        (i) => !i.isDeleted && i.serviceCenterFK === obj.serviceCenterFK,
      )
      if (hasDuplicate.length >= 2) {
        return rows.map(
          (row) =>
            row.id === parseInt(key, 10)
              ? { ...row, serviceCenterFK: undefined }
              : row,
        )
      }
    }
    return rows
  }

  commitChanges = ({ rows, changed }) => {
    const _rows = this.checkIsServiceCenterUnique({ rows, changed })
    const { setFieldValue, values } = this.props

    _rows.forEach((val, i) => {
      val.serviceFK = values.id
      val.serviceCenterFKNavigation = null
    })

    const isDefaultExists = _rows.find(
      (o) =>
        (o.isDefault === true && o.isDeleted === undefined) ||
        (o.isDeleted === false && o.isDefault === true),
    )
    if (!isDefaultExists) {
      const getRow = _rows.find(
        (o) =>
          (o.isDeleted === undefined || o.isDeleted === false) && !o.isDefault,
      )
      if (getRow) {
        getRow.isDefault = true
      }
    }

    setFieldValue('ctServiceCenter_ServiceNavigation', _rows)
    this.setState(() => {
      return {
        treatmentSettings: _rows,
      }
    })
    return _rows
  }

  // handleAutoOrder = (e) => {
  //   if (e) {
  //     const { treatmentSettings } = this.state
  //     const checkDefaultExist = treatmentSettings.find(
  //       (o) => o.isDefault === true,
  //     )
  //     if (!checkDefaultExist && treatmentSettings.length > 0) {
  //       treatmentSettings[0].isDefault = true
  //     }
  //   }
  // }

  // handleDisableAutoOrder = () => {
  //   const { treatmentSettings } = this.state

  //   if (treatmentSettings.length === 0) {
  //     return true
  //   }
  //   const validRow = treatmentSettings.find(
  //     (o) => o.isDeleted === undefined || o.isDeleted === false,
  //   )
  //   if (validRow) {
  //     return false
  //   }

  //   return true
  // }

  checkIsDefaultExist = () => {
    return this.state.treatmentSettings.find(
      (o) =>
        (o.isDefault === true && o.isDeleted === undefined) ||
        (o.isDeleted === false && o.isDefault === true),
    )
  }

  onAddedRowsChange = (addedRows) => {
    if (addedRows.length > 0) {
      const newRow = addedRows[0]
      const treatmentSettingsRow = this.state.treatmentSettings.length
      if (treatmentSettingsRow <= 0) {
        newRow.isDefault = true
      } else {
        const checkIsDefaultExist = this.checkIsDefaultExist()
        if (!checkIsDefaultExist) {
          newRow.isDefault = true
        } else {
          newRow.isDefault = false
        }
      }
    }
    return addedRows
  }

  render () {
    const { props } = this
    const {
      classes,
      theme,
      footer,

      settingClinicService,
      errors,
    } = props
    const { treatmentSettings } = this.state
    const medisaveSettingValue = {
      MedisaveHealthScreeningValue: [
        { value: 1, name: 'Mammogram' },
        { value: 1, name: 'Mammogram' },
      ],
      OutpatientScanValue: [
        { value: 1, name: 'CT' },
        { value: 1, name: 'CT' },
      ],
    }
    const treatmentSettingsErrMsg = errors.ctServiceCenter_ServiceNavigation
    const shoudDisableSaveButton =
      treatmentSettings.filter((row) => !row.isDeleted).length === 0

    return (
      <React.Fragment>
        <div style={{ margin: theme.spacing(2) }}>
          {/* <SizeContainer style={{ padding: 20 }}> */}
          <h4 style={{ fontWeight: 400 }}>
            <b>Treatment Details</b>
          </h4>
          <div>
            <div style={{ margin: theme.spacing(1) }}>
              <GridContainer>
                <GridItem xs={6}>
                  <FastField
                    name='code'
                    render={(args) => (
                      <TextField
                        label='Code'
                        autoFocus
                        {...args}
                        disabled={!!settingClinicService.entity}
                      />
                    )}
                  />
                </GridItem>
                <GridItem xs={6}>
                  <FastField
                    name='displayValue'
                    render={(args) => (
                      <TextField label='Display Value' {...args} />
                    )}
                  />
                </GridItem>
                <GridItem xs={6}>
                  <Field
                    name='effectiveDates'
                    render={(args) => {
                      return (
                        <DateRangePicker
                          label='Effective Start Date'
                          label2='End Date'
                          disabled={
                            settingClinicService.entity ? (
                              this.state.hasActiveSession
                            ) : (
                              false
                            )
                          }
                          {...args}
                        />
                      )
                    }}
                  />
                </GridItem>
                <GridItem xs={1}>
                  <div>
                    <img 
                    src="https://png.pngtree.com/png-clipart/20190515/original/pngtree-light-effect-border-png-image_3552885.jpg"
                    width="50px"
                    height="50px"
                    />
                  </div>
                </GridItem>
                <GridItem xs={5}>
                <FastField
                    name='chartMethodFK'
                    render={(args) => {
                      return (
                        <CodeSelect
                          label='Chart Method'
                          code='CTRevenueCategory'
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
                          code='CTServiceCategory'
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
                    name='cost'
                    render={(args) => {
                      return (
                        <TextField
                          label='Cost'
                          prefix="$"
                          {...args}
                        />
                      )
                    }}
                  />
                </GridItem>
                <GridItem xs={6}>
                  <FastField
                    name='unitPrice'
                    render={(args) => {
                      return (
                        <TextField
                          label='Selling Price/Unit'
                          prefix="$"
                          {...args}
                        />
                      )
                    }}
                  />
                </GridItem>
                <GridItem xs={12}>
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
            {/* <h5 className={classes.detailHeader}>Medisave Settings</h5>
            <Divider />
            <GridContainer>
              <GridItem
                xs={12}
                md={6}
                className={classes.detailHeaderContainer}
              >
                <FastField
                  name='isMedisaveHealthScreening'
                  render={(args) => {
                    return (
                      <Checkbox
                        onChange={this.onChangeMedisaveHealthScreening}
                        formControlProps={{ className: classes.medisaveCheck }}
                        {...args}
                      />
                    )
                  }}
                />

                <Field
                  name='medisaveHealthScreeningDiagnosisFK'
                  render={(args) => {
                    return (
                      <Select
                        style={{ paddingLeft: 20 }}
                        prefix='Medisave Health Screening'
                        disabled={this.state.ddlMedisaveHealthScreening}
                        options={
                          medisaveSettingValue.MedisaveHealthScreeningValue
                        }
                        {...args}
                      />
                      // <CodeSelect
                      //   style={{ paddingLeft: 20 }}
                      //   prefix='Medisave Health Screening'
                      //   code='ctMedisaveHealthScreeningDiagnosis'
                      //   {...args}
                      // />
                    )
                  }}
                />
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem
                xs={12}
                md={6}
                className={classes.detailHeaderContainer}
              >
                <FastField
                  name='isOutpatientScan'
                  render={(args) => {
                    return (
                      <Checkbox
                        formControlProps={{ className: classes.medisaveCheck }}
                        onChange={this.onChangeOutpatientScan}
                        {...args}
                      />
                    )
                  }}
                />
                <Field
                  name='outPatientScanDiagnosisFK'
                  render={(args) => {
                    return (
                      <Select
                        style={{ paddingLeft: 20 }}
                        prefix='OutPatient Scan'
                        disabled={this.state.ddlOutpatientScan}
                        options={medisaveSettingValue.OutpatientScanValue}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
            </GridContainer> */}
            {/* <h4 style={{ fontWeight: 400 }}>
              <b>Service Settings</b>
            </h4>
            {treatmentSettingsErrMsg && (
              <p className={classes.treatmentSettingstyle}>
                {treatmentSettingsErrMsg}
              </p>
            )}
            <EditableTableGrid
              style={{ marginTop: theme.spacing(1), margin: theme.spacing(2) }}
              rows={this.state.treatmentSettings}
              FuncProps={{
                pagerConfig: {
                  containerExtraComponent: this.PagerContent,
                },
              }}
              EditingProps={{
                showAddCommand: true,
                onCommitChanges: this.commitChanges,
                onAddedRowsChange: this.onAddedRowsChange,
              }}
              schema={itemSchema}
              {...this.tableParas}
            /> */}
          </div>
        </div>
        {/* </SizeContainer> */}
        {footer &&
          footer({
            onConfirm: props.handleSubmit,
            confirmBtnText: 'Save',
            confirmProps: {
              disabled: shoudDisableSaveButton,
            },
          })}
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Detail)
