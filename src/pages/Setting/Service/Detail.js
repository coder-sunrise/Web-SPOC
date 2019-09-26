import React, { PureComponent } from 'react'
import { FastField, withFormik } from 'formik'
import Yup from '@/utils/yup'
import _ from 'lodash'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { withStyles, Tooltip, Divider } from '@material-ui/core'
import Edit from '@material-ui/icons/Edit'
import Delete from '@material-ui/icons/Delete'
import { getBizSession } from '@/services/query'
import {
  GridContainer,
  GridItem,
  Button,
  TextField,
  Field,
  Checkbox,
  Select,
  ProgressButton,
  DateRangePicker,
  Switch,
  EditableTableGrid,
  notification,
  SizeContainer,
  CodeSelect,
} from '@/components'

const styles = (theme) => ({})

const itemSchema = Yup.object().shape({
  serviceCenterFK: Yup.string().required(),
  costPrice: Yup.number().required(),
  unitPrice: Yup.number().required(),
})

@withFormik({
  mapPropsToValues: ({ settingClinicService }) =>
    settingClinicService.entity || settingClinicService.default,
  validationSchema: Yup.object().shape({
    code: Yup.string().required(),
    displayValue: Yup.string().required(),
    serviceCategoryFK: Yup.string().required(),
    revenueCategoryFK: Yup.string().required(),
    effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
    serviceSettingItem: Yup.array().compact((v) => v.isDeleted).of(itemSchema),
    //medisaveHealthScreeningDiagnosisFK: Yup.string().required(),
  }),
  handleSubmit: (values, { props }) => {
    const { effectiveDates, ...restValues } = values
    const { dispatch, onConfirm } = props
    console.log('handleSubmit', values)
    dispatch({
      type: 'settingClinicService/upsert',
      payload: {
        ...restValues,
        effectiveStartDate: effectiveDates[0],
        effectiveEndDate: effectiveDates[1],
      },
    }).then((r) => {
      if (r) {
        if (onConfirm) onConfirm()
        dispatch({
          type: 'settingClinicService/query',
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
  displayName: 'ServiceModal',
})
class Detail extends PureComponent {
  componentDidMount () {
    this.checkHasActiveSession()
    //this.initMedisaveSetting()
  }

  checkHasActiveSession = async () => {
    const result = await getBizSession()
    const { data } = result.data

    this.setState({
      hasActiveSession: data ? true : false,
    })
  }

  state = {
    editingRowIds: [],
    rowChanges: {},
    ddlMedisaveHealthScreening: true,
    ddlOutpatientScan: true,
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

  tableParas = {
    columns: [
      { name: 'serviceCenterFK', title: 'Service Center' },
      { name: 'costPrice', title: 'Cost' },
      { name: 'unitPrice', title: 'Selling Price/Unit' },
      { name: 'isDefault', title: 'Default' },
    ],
    columnExtensions: [
      {
        columnName: 'serviceCenterFK',
        type: 'codeSelect',
        code: 'ctServiceCenter',
      },
      { columnName: 'costPrice', type: 'number', currency: true },
      { columnName: 'unitPrice', type: 'number', currency: true },
      {
        columnName: 'isDefault',
        type: 'radio',
        checkedValue: true,
        uncheckedValue: false,
        onRadioChange: (row, e, checked) => {
          // console.log(this)
          if (checked) {
            const { values, setFieldValue, setFieldTouched } = this.props
            const serviceSettingItem = _.cloneDeep(
              values.ctServiceCenter_ServiceNavigation,
            )
            serviceSettingItem.forEach((pec) => {
              pec.isDefault = false
            })
            const r = serviceSettingItem.find((o) => o.id === row.id)
            if (r) {
              r.isDefault = true
            }
            setFieldValue(
              'ctServiceCenter_ServiceNavigation',
              serviceSettingItem,
            )
            setFieldTouched('ctServiceCenter_ServiceNavigation', true)
          }
        },
      },
    ],
  }

  commitChanges = ({ rows, added, changed, deleted }) => {
    //commitChanges = ({ rows }) => {

    const { setFieldValue, values } = this.props
    rows.forEach((val) => {
      ;(val.serviceFK = values.id), (val.serviceCenterFKNavigation = null)
    })

    setFieldValue('ctServiceCenter_ServiceNavigation', rows)
  }

  render () {
    const { props } = this
    const { classes, theme, footer, values, settingClinicService } = props
    const { hasActiveSession } = this.state
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
    //console.log('detail', props)

    return (
      <React.Fragment>
        <SizeContainer size='sm'>
          <div style={{ margin: theme.spacing(1) }}>
            <h5 className={classes.detailHeader}>Service Details</h5>
            <Divider />
            <GridContainer>
              <GridItem md={6}>
                <FastField
                  name='code'
                  render={(args) => (
                    <TextField
                      label='Code'
                      {...args}
                      disabled={settingClinicService.entity ? true : false}
                    />
                  )}
                />
              </GridItem>
              <GridItem md={6}>
                <FastField
                  name='displayValue'
                  render={(args) => (
                    <TextField label='Display Value' {...args} />
                  )}
                />
              </GridItem>
              <GridItem md={10}>
                <FastField
                  name='effectiveDates'
                  render={(args) => {
                    return (
                      <DateRangePicker
                        label='Effective Start Date'
                        label2='End Date'
                        disabled={
                          settingClinicService.entity ? (
                            !this.state.hasActiveSession
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
              <GridItem md={2}>
                <FastField
                  name='isAutoOrder'
                  render={(args) => {
                    return <Switch label='Auto Order' {...args} />
                  }}
                />
              </GridItem>
              <GridItem md={6}>
                <FastField
                  name='serviceCategoryFK'
                  render={(args) => {
                    return (
                      <CodeSelect
                        label='Service Category'
                        code='CTServiceCategory'
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem md={6}>
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
            <h5 className={classes.detailHeader}>Service Settings</h5>
            <Divider />
            <EditableTableGrid
              style={{ marginTop: theme.spacing(1) }}
              rows={values.ctServiceCenter_ServiceNavigation}
              FuncProps={{
                pagerConfig: {
                  containerExtraComponent: this.PagerContent,
                },
              }}
              EditingProps={{
                showAddCommand: true,
                onCommitChanges: this.commitChanges,
              }}
              schema={itemSchema}
              {...this.tableParas}
            />
          </div>
        </SizeContainer>
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
