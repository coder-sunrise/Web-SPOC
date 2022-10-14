import React, { PureComponent } from 'react'
import { FastField } from 'formik'
import _ from 'lodash'
import moment from 'moment'
import { withStyles } from '@material-ui/core'
import { connect } from 'dva'
import Yup from '@/utils/yup'
import { getBizSession } from '@/services/queue'
import { Tag, Input } from 'antd'
import { Tooltip } from '@/components'
import { PlusOutlined } from '@ant-design/icons'
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
  Checkbox,
  CheckboxGroup,
  TagPanel,
} from '@/components'
import { tagCategory } from '@/utils/codes'

const styles = theme => ({
  sectionHeader: {
    fontWeight: 400,
  },
  serviceSettingStyle: {
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
  costPrice: Yup.number()
    .required()
    .min(0, 'Cost Price must be greater than or equal to $0.00'),
  unitPrice: Yup.number()
    .required()
    .min(0, 'Unit Price must be greater than or equal to $0.00'),
})
const modalityItemSchema = Yup.object().shape({
  modalityFK: Yup.string().required(),
})

@connect(({ clinicSettings }) => ({
  clinicSettings,
}))
@withFormikExtend({
  mapPropsToValues: ({ settingClinicService }) => {
    const {
      serviceCenterList: allServiceCenters,
      entity = {},
    } = settingClinicService
    const { ctServiceCenter_ServiceNavigation: currentServiceCenters } = entity

    const returnValue =
      settingClinicService.entity || settingClinicService.default
    const { isAutoOrder, ctServiceCenter_ServiceNavigation } = returnValue
    if (isAutoOrder) {
      const checkDefaultExist = ctServiceCenter_ServiceNavigation.find(
        o => o.isDefault === true,
      )
      if (!checkDefaultExist && ctServiceCenter_ServiceNavigation.length > 0) {
        ctServiceCenter_ServiceNavigation[0].isDefault = true
      }
    }
    return {
      ...returnValue,
    }
  },

  validationSchema: Yup.object().shape({
    code: Yup.string().required(),
    displayValue: Yup.string()
      .test(
        'len',
        'Service name cannot exceed 40 characters.',
        val => val && val.length <= 40,
      )
      .required(),
    serviceCategoryFK: Yup.string().required(),
    revenueCategoryFK: Yup.string().required(),
    effectiveDates: Yup.array()
      .of(Yup.date())
      .min(2)
      .required(),
    serviceSettingItem: Yup.array()
      .compact(v => v.isDeleted)
      .of(itemSchema),
    ctServiceCenter_ServiceNavigation: Yup.array()
      .compact(v => v.isDeleted)
      .required('At least one service setting is required.'),
  }),
  handleSubmit: (values, { props, resetForm }) => {
    const { effectiveDates, ...restValues } = values
    const { dispatch, onConfirm } = props
    const selectedOptions = {}
    dispatch({
      type: 'settingClinicService/upsert',
      payload: {
        ...restValues,
        ...selectedOptions,
        ctServiceCenter_ServiceNavigation: restValues.ctServiceCenter_ServiceNavigation.map(
          item => {
            return {
              ...item,
              effectiveStartDate:
                item.effectiveStartDate || moment().formatUTC(),
              effectiveEndDate:
                item.effectiveEndDate ||
                moment('2099-12-31T23:59:59').formatUTC(false),
            }
          },
        ),
        effectiveStartDate: effectiveDates[0],
        effectiveEndDate: effectiveDates[1],
      },
    }).then(r => {
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
  validate: values => {
    const errors = {}
    return errors
  },
  displayName: 'ServiceModal',
})
class Detail extends PureComponent {
  state = {
    serviceSettings: this.props.values.ctServiceCenter_ServiceNavigation,
  }

  tableParas = {
    columns: [
      { name: 'serviceCenterFK', title: 'Service Center' },
      { name: 'costPrice', title: 'Cost' },
      { name: 'unitPrice', title: 'Selling Price/Unit' },
      { name: 'isTrackResults', title: 'Track Results' },
      { name: 'isDefault', title: 'Default' },
    ],
    columnExtensions: [
      {
        columnName: 'serviceCenterFK',
        type: 'codeSelect',
        code: 'ctServiceCenter',
        onChange: ({ val, row }) => {
          const { serviceSettings } = this.state
          const rs = serviceSettings.filter(
            o => !o.isDeleted && o.serviceCenterFK === val && o.id !== row.id,
          )
          if (rs.length > 0) {
            notification.error({
              message: 'The service center already exist in the list',
            })
          }
        },
      },
      { columnName: 'costPrice', type: 'number', currency: true, width: 110 },
      { columnName: 'unitPrice', type: 'number', currency: true, width: 160 },
      {
        columnName: 'isTrackResults',
        type: 'checkbox',
        checkedValue: true,
        width: 135,
        uncheckedValue: false,
      },
      {
        columnName: 'isDefault',
        type: 'radio',
        width: 80,
        checkedValue: true,
        uncheckedValue: false,
        onChange: ({ row, checked }) => {
          if (checked) {
            const { values, setFieldValue, setFieldTouched } = this.props
            const serviceSettingItem = _.cloneDeep(
              values.ctServiceCenter_ServiceNavigation,
            )
            serviceSettingItem.forEach(pec => {
              pec.isDefault = false
            })
            const r = serviceSettingItem.find(o => o.id === row.id)
            if (r) {
              r.isDefault = true
            }
            this.setState({ serviceSettings: serviceSettingItem })
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

  componentDidMount() {
    this.checkHasActiveSession()

    const {
      serviceCategoryFK,
      ctService_Tag = [],
      isRequiredSpecimen = false,
      id,
    } = this.props.values
    const { dispatch } = this.props

    dispatch({
      type: 'codetable/fetchCodes',
      payload: { code: 'cttag', force: true },
    }).then(result => {
      if (result) {
        this.setState({
          serviceTags: result
            .filter(
              t =>
                t.category === 'Service' &&
                ctService_Tag.findIndex(st => st.tagFK === t.id) !== -1,
            )
            .map(t => t.displayValue),
        })
      }
    })
    if (id) {
      setTimeout(async () => {
        if (!_.isEmpty(await this.props.validateForm())) {
          this.props.handleSubmit()
        }
      }, 100)
    }
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

  checkIsServiceCenterUnique = ({ rows, changed }) => {
    if (!changed) return rows
    const key = Object.keys(changed)[0]
    const obj = changed[key]
    if (obj.serviceCenterFK !== undefined) {
      const hasDuplicate = rows.filter(
        i => !i.isDeleted && i.serviceCenterFK === obj.serviceCenterFK,
      )
      if (hasDuplicate.length >= 2) {
        return rows.map(row =>
          row.id === parseInt(key, 10)
            ? { ...row, serviceCenterFK: undefined }
            : row,
        )
      }
    }
    return rows
  }

  commitChanges = temp => {
    const { rows, changed } = temp
    const _rows = this.checkIsServiceCenterUnique({ rows, changed })
    const { setFieldValue, values } = this.props

    _rows.forEach((val, i) => {
      val.serviceFK = values.id
      val.serviceCenterFKNavigation = null
    })

    const isDefaultExists = _rows.find(
      o =>
        (o.isDefault === true && o.isDeleted === undefined) ||
        (o.isDeleted === false && o.isDefault === true),
    )
    if (!isDefaultExists) {
      const getRow = _rows.find(
        o =>
          (o.isDeleted === undefined || o.isDeleted === false) && !o.isDefault,
      )
      if (getRow) {
        getRow.isDefault = true
      }
    }

    setFieldValue('ctServiceCenter_ServiceNavigation', _rows)
    this.setState(() => {
      return {
        serviceSettings: _rows,
      }
    })

    return _rows
  }

  handleAutoOrder = e => {
    if (e) {
      const { serviceSettings } = this.state
      const checkDefaultExist = serviceSettings.find(o => o.isDefault === true)
      if (!checkDefaultExist && serviceSettings.length > 0) {
        serviceSettings[0].isDefault = true
      }
    }
  }

  checkIsDefaultExist = () => {
    return this.state.serviceSettings.find(
      o =>
        (o.isDefault === true && o.isDeleted === undefined) ||
        (o.isDeleted === false && o.isDefault === true),
    )
  }

  onAddedRowsChange = addedRows => {
    if (addedRows.length > 0) {
      const newRow = addedRows[0]
      const serviceSettingsRow = this.state.serviceSettings.length
      if (serviceSettingsRow <= 0) {
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

  handleTagPanelChange = (value, tags, setFieldValue) => {
    const {
      ctService_Tag: originalTags = [],
      id: serviceId,
    } = this.props.initialValues

    const currentTags = tags.map(t => {
      return {
        serviceFK: serviceId,
        tagFK: t.id,
        isDeleted: false,
      }
    })

    const deletedTags = originalTags
      .filter(t => !value.includes(t.displayValue))
      .map(t => {
        return { ...t, isDeleted: true }
      })

    setFieldValue('ctService_Tag', [...currentTags, ...deletedTags])
  }

  validationOfFormFields = fieldArray => {
    let errorArr = []
    fieldArray.forEach(item =>
      '_errors' in item && item.isDeleted !== true && item._errors.length > 0
        ? errorArr.push(item)
        : null,
    )
    if (errorArr.length > 0) {
      return true
    }
    return false
  }
  render() {
    const { props } = this

    const {
      classes,
      theme,
      footer,
      clinicSettings,
      settingClinicService,
      ctService_Tag,
      errors,
    } = props
    let settingsFiledArray = [...(this.state.serviceSettings || [])]

    const { serviceSettings } = this.state
    const serviceSettingsErrMsg = errors.ctServiceCenter_ServiceNavigation
    const shoudDisableSaveButton = () =>
      serviceSettings.filter(row => !row.isDeleted).length === 0 ||
      this.validationOfFormFields(settingsFiledArray)
    const { settings = [] } = clinicSettings
    return (
      <React.Fragment>
        <GridContainer
          style={{
            height: 700,
            alignItems: 'start',
            overflowY: 'scroll',
          }}
        >
          <div style={{ margin: theme.spacing(2) }}>
            <h4 style={{ fontWeight: 400 }}>
              <b>Service Details</b>
            </h4>
            <div>
              <div style={{ margin: theme.spacing(1) }}>
                <GridContainer>
                  <GridItem xs={6}>
                    <FastField
                      name='code'
                      render={args => (
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
                    <Field
                      name='effectiveDates'
                      render={args => {
                        return (
                          <DateRangePicker
                            label='Effective Start Date'
                            label2='End Date'
                            disabled={
                              settingClinicService.entity
                                ? this.state.hasActiveSession &&
                                  settingClinicService.entity.isActive
                                : false
                            }
                            {...args}
                          />
                        )
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12}>
                    <FastField
                      name='displayValue'
                      render={args => (
                        <TextField label='Display Value' {...args} />
                      )}
                    />
                  </GridItem>
                  <GridItem xs={12}>
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
                  <GridItem xs={6}>
                    <FastField
                      name='revenueCategoryFK'
                      render={args => {
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
                      name='serviceCategoryFK'
                      render={args => {
                        return (
                          <CodeSelect
                            label='Service Category'
                            code='CTServiceCategory'
                            labelField='displayValue'
                            {...args}
                          />
                        )
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12}>
                    <Field
                      name='ctService_Tag'
                      render={args => (
                        <TagPanel
                          label='Tags:'
                          tagCategory='Service'
                          defaultTagNames={this.state.serviceTags}
                          {...args}
                          onChange={(value, tags) =>
                            this.handleTagPanelChange(
                              value,
                              tags,
                              args.form.setFieldValue,
                            )
                          }
                        ></TagPanel>
                      )}
                    />
                  </GridItem>
                  <GridItem xs={12}>
                    <GridContainer>
                      <GridItem xs={3}>
                        <Field
                          name='isAutoOrder'
                          render={args => {
                            return (
                              <Switch
                                label='Consultation Auto Order'
                                onChange={e => this.handleAutoOrder(e)}
                                {...args}
                              />
                            )
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                </GridContainer>
              </div>
              <h4 style={{ fontWeight: 400 }}>
                <b>Service Settings</b>
              </h4>
              {serviceSettingsErrMsg && (
                <p className={classes.serviceSettingStyle}>
                  {serviceSettingsErrMsg}
                </p>
              )}
              <EditableTableGrid
                style={{
                  marginTop: theme.spacing(1),
                  margin: theme.spacing(2),
                }}
                rows={this.state.serviceSettings}
                FuncProps={{
                  pagerConfig: {
                    containerExtraComponent: this.PagerContent,
                  },
                }}
                EditingProps={{
                  showAddCommand: true,
                  onCommitChanges: this.commitChanges,
                  onAddedRowsChange: this.onAddedRowsChange,
                  isDeletable: row => {
                    return !row.isUsedByOthers
                  },
                }}
                schema={itemSchema}
                {...this.tableParas}
              />
            </div>
          </div>
        </GridContainer>
        {/* </SizeContainer> */}
        {footer &&
          footer({
            onConfirm: props.handleSubmit,
            confirmBtnText: 'Save',
            confirmProps: {
              disabled: shoudDisableSaveButton(),
            },
          })}
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Detail)
