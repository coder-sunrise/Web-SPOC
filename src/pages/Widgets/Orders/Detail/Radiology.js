import React, { PureComponent } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import { isNumber } from 'util'
import { Tag } from 'antd'
import { withStyles } from '@material-ui/core'
import {
  GridContainer,
  GridItem,
  TextField,
  Select,
  NumberInput,
  withFormikExtend,
  Switch,
  Checkbox,
  RadioGroup,
} from '@/components'
import Authorized from '@/utils/Authorized'
import Yup from '@/utils/yup'
import { getServices } from '@/utils/codetable'
import { calculateAdjustAmount } from '@/utils/utils'
import { GetOrderItemAccessRight } from '@/pages/Widgets/Orders/utils'
import { CANNED_TEXT_TYPE } from '@/utils/constants'
import CannedTextButton from './CannedTextButton'

const { CheckableTag } = Tag

const styles = (theme) => ({
  editor: {
    marginTop: theme.spacing(1),
    position: 'relative',
  },
  editorBtn: {
    position: 'absolute',
    right: 0,
    top: 4,
  },
  detail: {
    margin: `${theme.spacing(1)}px 0px`,
    border: '1px solid #ccc',
    borderRadius: 3,
    padding: `${theme.spacing(1)}px 0px`,
  },
  footer: {
    textAlign: 'right',
    padding: theme.spacing(1),
    paddingBottom: 0,
  },
  subTitle: {
    width: 60, textAlign: 'right', fontSize: '0.85rem', fontWeight: 500, display: 'inline-block', marginRight: 4,
  },
  tag: {
    border: '1px solid rgba(0, 0, 0, 0.42)', fontSize: '0.85rem', padding: '3px 10px',
  },
  groupPanel: {
    border: '1px solid rgba(0, 0, 0, 0.42)', position: 'relative', padding: 10, marginTop: 10, borderRadius: 5,
  },
  groupPanelTitle: {
    fontSize: '0.85rem', position: 'absolute', top: '-10px', left: '10px', backgroundColor: 'white', padding: '0px 5px',
  },
  checkServiceItem: {
    display: 'inline-block',
    border: '1px solid green',
    borderRadius: 4,
    margin: 3,
    padding: '0px 6px',
    width: 185, alignItems: 'right', position: 'relative',
  },
  checkServiceLabel: {
    width: 155,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    display: 'inline-block',
    marginTop: 6,
    cursor: 'pointer',
  },
  checkServiceCheckBox: {
    display: 'inline-block', marginRight: '-16px', position: 'absolute', top: '0px', right: 0,
  },
})

@connect(({ codetable, global, user, visitRegistration }) => ({
  codetable,
  global,
  user,
  visitRegistration,
}))
@withFormikExtend({
  mapPropsToValues: ({ orders = {}, type }) => {
    const v = {
      ...(orders.entity || orders.defaultRadiology),
    }
    return { ...v, type, isEdit: !_.isEmpty(orders.entity) }
  },
  enableReinitialize: true,
  validationSchema: Yup.object().shape({}),

  handleSubmit: (values, { props, onConfirm, setValues }) => {
    const { dispatch, orders, getNextSequence, user } = props
    let nextSequence = getNextSequence()
    const data = values.radiologyItems.map(item => {
      return {
        isOrderedByDoctor:
          user.data.clinicianProfile.userProfile.role.clinicRoleFK === 1,
        sequence: nextSequence++,
        ...item,
        subject: item.serviceName,
        isDeleted: false,
        adjValue:
          item.adjAmount < 0
            ? -Math.abs(item.adjValue)
            : Math.abs(item.adjValue),
      }
    })

    dispatch({
      type: 'orders/upsertRows',
      payload: data,
    })
    if (onConfirm) onConfirm()
    setValues({
      ...orders.defaultRadiology,
      type: orders.type,
      filterService: undefined,
    })
  },
  displayName: 'OrderPage',
})
class Radiology extends PureComponent {
  constructor (props) {
    super(props)
    const { dispatch, setFieldValue } = props

    this.state = {
      services: [],
      serviceCenters: [],
      serviceCenterServices: [],
      serviceTag: [],
      serviceCatetory: [],
    }

    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctservice',
        payload: {},
        filter: {
          'serviceFKNavigation.IsActive': true,
          'serviceCenterFKNavigation.IsActive': true,
          'serviceCenterFKNavigation.ServiceCenterCategoryFK': 1,
          combineCondition: 'and',
        },
      },
    }).then((list) => {
      const {
        services = [],
        serviceCenters = [],
        serviceCenterServices = [],
      } = getServices(list)

      this.setState({
        services,
        serviceCenters,
        serviceCenterServices,
        serviceTag: ['All', 'Abdomen'],
        serviceCatetory: ['All', 'X-Ray', 'Ultrasound'],
      })
    })

    this.debouncedAction = _.debounce(
      (e) => {
        setFieldValue('filterService', e.target.value)
      },
      100,
    )
  }

  getServiceCenterService = (editService) => {
    const { serviceFK, serviceCenterFK } = editService
    const obj = (serviceCenterService) => {
      editService.isActive = serviceCenterService.isActive
      editService.serviceCenterServiceFK = serviceCenterService.serviceCenter_ServiceId
      editService.unitPrice = serviceCenterService.unitPrice
      editService.total = serviceCenterService.unitPrice
      editService.quantity = 1
    }

    if (serviceFK && !serviceCenterFK) {
      const serviceCenterService =
        this.state.serviceCenterServices.find(
          (o) => o.serviceId === serviceFK && o.isDefault,
        ) || {}
      if (serviceCenterService) {
        obj(serviceCenterService)
        editService.serviceCenterFK = serviceCenterService.serviceCenterId
        editService.isMinus = true
        editService.isExactAmount = true
        editService.adjValue = 0
        this.updateTotalPrice(serviceCenterService.unitPrice, editService)
      }
      return
    }
    if (!serviceCenterFK) return

    const serviceCenterService =
      this.state.serviceCenterServices.find(
        (o) =>
          o.serviceId === serviceFK && o.serviceCenterId === serviceCenterFK,
      ) || {}
    if (serviceCenterService) {
      obj(serviceCenterService)
      editService.isMinus = true
      editService.isExactAmount = true
      editService.adjValue = 0
      this.updateTotalPrice(serviceCenterService.unitPrice, editService)
    }
  }

  updateTotalPrice = (v, editService) => {
    if (v || v === 0) {
      const { isExactAmount, isMinus, adjValue } = editService

      let value = adjValue
      if (!isMinus) {
        value = Math.abs(adjValue)
      } else {
        value = -Math.abs(adjValue)
      }

      const finalAmount = calculateAdjustAmount(
        isExactAmount,
        v,
        value || adjValue,
      )
      editService.totalAfterItemAdjustment = finalAmount.amount
      editService.adjAmount = finalAmount.adjAmount
      editService.adjType = isExactAmount ? 'ExactAmount' : 'Percentage'
    } else {
      editService.totalAfterItemAdjustment = undefined
      editService.adjAmount = undefined
    }
  }

  handleReset = () => {
    const { setValues, orders } = this.props
    setValues({
      ...orders.defaultRadiology,
      type: orders.type,
      filterService: undefined,
    })
  }

  onAdjustmentConditionChange = (editService) => {
    const { isMinus, adjValue, isExactAmount } = editService
    if (!isNumber(adjValue)) return

    let value = adjValue
    if (!isExactAmount && adjValue > 100) {
      value = 100
      editService.adjValue = 100
    }

    if (!isMinus) {
      value = Math.abs(value)
    } else {
      value = -Math.abs(value)
    }

    this.getFinalAmount({ value }, editService)
  }

  getFinalAmount = ({ value } = {}, editService) => {
    const { isExactAmount, adjValue, total = 0 } = editService
    const finalAmount = calculateAdjustAmount(
      isExactAmount,
      total,
      value || adjValue,
    )

    editService.totalAfterItemAdjustment = finalAmount.amount
    editService.adjAmount = finalAmount.adjAmount
    editService.adjType = isExactAmount ? 'ExactAmount' : 'Percentage'
  }

  validateAndSubmitIfOk = async () => {
    const { handleSubmit, validateForm } = this.props
    const validateResult = await validateForm()
    const isFormValid = _.isEmpty(validateResult)
    if (isFormValid) {
      handleSubmit()
      return true
    }
    return false
  }

  render () {
    const {
      theme,
      classes,
      values = {},
      footer,
      from,
      setFieldValue,
    } = this.props
    const { services = [], serviceCenters = [], serviceCatetory = [], serviceTag = [] } = this.state
    const { radiologyItems = [], isEdit, editServiceId, filterService = '', selectCategory, selectTag, type } = values
    const totalPriceReadonly =
      Authorized.check('queue.consultation.modifyorderitemtotalprice')
        .rights !== 'enable'

    const selectService = radiologyItems.map(r => r.serviceName).join(', ')
    const editService = radiologyItems.find(r => r.serviceFK === editServiceId) || {}
    let filterServices = []
    if (isEdit) {
      filterServices = services.filter(s => s.value === editServiceId)
    }
    else {
      filterServices = services.filter(s => radiologyItems.find(r => r.serviceFK === s.value) || s.code.indexOf(filterService) >= 0 || s.name.indexOf(filterService) >= 0)
    }
    return (
      <Authorized
        authority={GetOrderItemAccessRight(
          from,
          'queue.consultation.order.service',
        )}
      >
        <div>
          <GridContainer>
            <GridItem xs={12}>
              <div style={{ marginTop: 10 }}>
                <span className={classes.subTitle}>Category: </span>
                {serviceCatetory.map(category => (
                  <CheckableTag
                    key={category}
                    checked={selectCategory === category}
                    style={{ border: '1px solid rgba(0, 0, 0, 0.42)', fontSize: '0.85rem', padding: '3px 10px' }}
                    onChange={checked => {
                      if (!isEdit && checked)
                        setFieldValue('selectCategory', category)
                    }}
                  >
                    {category}
                  </CheckableTag>
                ))}
              </div>
            </GridItem>
            <GridItem xs={12}>
              <div style={{ marginTop: 10 }}>
                <span className={classes.subTitle}>Tag: </span>
                {serviceTag.map(tag => (
                  <CheckableTag
                    key={tag}
                    checked={selectTag === tag}
                    className={classes.tag}
                    onChange={checked => {
                      if (!isEdit && checked)
                        setFieldValue('selectTag', tag)
                    }}
                  >
                    {tag}
                  </CheckableTag>
                ))}
              </div>
            </GridItem>
            <GridItem xs={12}>
              <TextField label='Filter by service code, name'
                value={filterService}
                onChange={(e) => {
                  this.debouncedAction(e)
                }}
                disabled={isEdit}
              />
            </GridItem>
            <GridItem xs={12}>
              <div className={classes.groupPanel}>
                <div className={classes.groupPanelTitle}>Service</div>
                <div>{filterServices.map(r => {
                  return <div style={{ backgroundColor: editServiceId === r.value ? 'lightgreen' : 'white' }}
                    className={classes.checkServiceItem}
                    onClick={() => {
                      if (radiologyItems.find(item => item.serviceFK === r.value))
                        setFieldValue('editServiceId', r.value)
                    }}
                  >
                    <span className={classes.checkServiceLabel} title={r.name}>{r.name}</span>
                    <div className={classes.checkServiceCheckBox}>
                      <Checkbox
                        disabled={isEdit}
                        label=''
                        inputLabel=''
                        checked={!_.isEmpty(radiologyItems.find(ri => ri.serviceFK === r.value))}
                        onChange={(e) => {
                          if (e.target.value) {
                            let newService = { serviceFK: r.value, serviceName: r.name, serviceCode: r.code, priority: 'Normal', type, packageGlobalId: '' }
                            this.getServiceCenterService(newService)
                            setFieldValue('radiologyItems', [...radiologyItems, newService])
                          }
                          else {
                            setFieldValue('radiologyItems', [...radiologyItems.filter(item => item.serviceFK !== r.value)])
                          }
                          setFieldValue('editServiceId', e.target.value ? r.value : undefined)
                        }}
                      />
                    </div>
                  </div>
                })}
                </div>
              </div>
            </GridItem>
            <GridItem xs={8}>
              <div style={{ marginTop: 5 }}><span style={{ fontSize: '0.85rem', fontWeight: 500 }}>To be added: </span>{selectService}</div>
            </GridItem>
            <GridItem xs={4}>
              <div style={{ position: 'relative' }}>
                <span style={{ fontSize: '0.85rem', position: 'absolute', top: '5px', fontWeight: 500 }}>Priority: </span>
                <div style={{ marginLeft: 60 }}>
                  <RadioGroup
                    disabled={!editServiceId}
                    value={editService.priority || 'Normal'}
                    label=''
                    onChange={(e) => {
                      editService.priority = e.target.value
                      setFieldValue('radiologyItems', [...radiologyItems])
                    }}
                    options={[
                      {
                        value: 'Normal',
                        label: 'Normal',
                      },
                      {
                        value: 'Urgent',
                        label: 'Urgent',
                      },
                    ]}
                  />
                </div>
              </div>
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={4}>
              <TextField disabled label='Service Name' value={editService.serviceName} />
            </GridItem>
            <GridItem xs={4}>
              <Select
                disabled={!editServiceId}
                label='Service Center Name'
                value={editService.serviceCenterFK || null}
                options={serviceCenters.filter(
                  (o) => o.services.find((m) => m.value === editServiceId),
                )}
                onChange={(value) => {
                  editService.serviceCenterFK = value
                  if (value) {
                    this.getServiceCenterService(editService)
                  }
                  setFieldValue('radiologyItems', [...radiologyItems])
                }
                }
              />
            </GridItem>
            <GridItem xs={3}>
              <NumberInput
                value={editService.quantity}
                disabled={!editServiceId}
                label='Quantity'
                style={{
                  marginLeft: theme.spacing(7),
                  paddingRight: theme.spacing(6),
                }}
                step={1}
                min={0}
                onChange={(e) => {
                  editService.quantity = e.target.value
                  if (editService.unitPrice) {
                    const total = e.target.value * editService.unitPrice
                    editService.total = total
                    this.updateTotalPrice(total, editService)
                  }
                  setFieldValue('radiologyItems', [...radiologyItems])
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={8} style={{ paddingRight: 35 }}>
              <div style={{ position: 'relative' }}>
                <TextField
                  value={editService.remark}
                  disabled={!editServiceId}
                  rowsMax='5'
                  label='Remarks'
                  onChange={(e) => {
                    editService.remark = e.target.value
                    setFieldValue('radiologyItems', [...radiologyItems])
                  }}
                />
                <CannedTextButton
                  disabled={!editServiceId}
                  cannedTextTypeFK={CANNED_TEXT_TYPE.RADIOLOGYREMARK}
                  style={{
                    position: 'absolute', bottom: 0,
                    right: -35,
                  }}
                  handleSelectCannedText={(cannedText) => {
                    editService.remark = cannedText.text
                    setFieldValue('radiologyItems', [...radiologyItems])
                  }}
                />
              </div>
            </GridItem>
            <GridItem xs={3}>
              <NumberInput
                label='Total'
                value={editService.total}
                style={{
                  marginLeft: theme.spacing(7),
                  paddingRight: theme.spacing(6),
                }}
                min={0}
                currency
                onChange={(e) => {
                  editService.total = e.target.value
                  this.updateTotalPrice(e.target.value, editService)
                  setFieldValue('radiologyItems', [...radiologyItems])
                }}
                disabled={totalPriceReadonly || !editServiceId}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={8} className={classes.editor} style={{ paddingRight: 35 }}>
              <div style={{ position: 'relative' }}>
                <TextField value={editService.instruction}
                  disabled={!editServiceId}
                  rowsMax='5'
                  label='Instruction'
                  onChange={(e) => {
                    editService.instruction = e.target.value
                    setFieldValue('radiologyItems', [...radiologyItems])
                  }}
                />
                <CannedTextButton
                  disabled={!editServiceId}
                  cannedTextTypeFK={CANNED_TEXT_TYPE.RADIOLOGYINSTRUCTION}
                  style={{
                    position: 'absolute', bottom: 0,
                    right: -35,
                  }}
                  handleSelectCannedText={(cannedText) => {
                    editService.instruction = cannedText.text
                    setFieldValue('radiologyItems', [...radiologyItems])
                  }}
                />
              </div>
            </GridItem>
            <GridItem xs={3} className={classes.editor}>
              <div style={{ position: 'relative' }}>
                <div
                  style={{ marginTop: theme.spacing(2), position: 'absolute' }}
                >
                  <Switch
                    value={!editServiceId ? true : editService.isMinus}
                    checkedChildren='-'
                    unCheckedChildren='+'
                    label=''
                    onChange={(value) => {
                      editService.isMinus = value
                      this.onAdjustmentConditionChange(editService)
                      setFieldValue('radiologyItems', [...radiologyItems])
                    }}
                    disabled={totalPriceReadonly || !editServiceId}
                  />
                </div>

                {editService.isExactAmount ? (
                  <NumberInput
                    value={editService.adjValue}
                    style={{
                      marginLeft: theme.spacing(7),
                      paddingRight: theme.spacing(6),
                    }}
                    min={0}
                    currency
                    label='Adjustment'
                    onChange={(e) => {
                      editService.adjValue = e.target.value
                      this.onAdjustmentConditionChange(editService)
                      setFieldValue('radiologyItems', [...radiologyItems])
                    }}
                    disabled={totalPriceReadonly || !editServiceId}
                  />
                )
                  : (
                    <NumberInput
                      value={editService.adjValue}
                      style={{
                        marginLeft: theme.spacing(7),
                        paddingRight: theme.spacing(6),
                      }}
                      percentage
                      max={100}
                      min={0}
                      label='Adjustment'
                      onChange={(e) => {
                        editService.adjValue = e.target.value
                        this.onAdjustmentConditionChange(editService)
                        setFieldValue('radiologyItems', [...radiologyItems])
                      }}
                      disabled={totalPriceReadonly || !editServiceId}
                    />)
                }
              </div>
            </GridItem>
            <GridItem xs={1} className={classes.editor}>
              <div style={{ marginTop: theme.spacing(2) }}>
                <Switch
                  value={!editServiceId ? true : editService.isExactAmount}
                  checkedChildren='$'
                  unCheckedChildren='%'
                  label=''
                  onChange={(value) => {
                    editService.isExactAmount = value
                    this.onAdjustmentConditionChange(editService)
                    setFieldValue('radiologyItems', [...radiologyItems])
                  }}
                  disabled={totalPriceReadonly || !editServiceId}
                />
              </div>
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={8} className={classes.editor}>
              <div>
                <Checkbox
                  checked={editService.isPreOrder || false}
                  disabled={!editServiceId}
                  style={{ position: 'absolute', bottom: 2 }}
                  label='Pre-Order'
                  onChange={(e) => {
                    editService.isPreOrder = e.target.value
                    if (!e.target.value) {
                      editService.isChargeToday = false
                    }
                    setFieldValue('radiologyItems', [...radiologyItems])
                  }}
                />
                {editService.isPreOrder &&
                  <Checkbox
                    checked={editService.isChargeToday || false}
                    disabled={!editServiceId}
                    style={{ position: 'absolute', bottom: 2, left: '100px' }}
                    label='Charge Today'
                    onChange={(e) => {
                      editService.isChargeToday = e.target.value
                      setFieldValue('radiologyItems', [...radiologyItems])
                    }}
                  />
                }
              </div>
            </GridItem>
            <GridItem xs={3} className={classes.editor}>
              <NumberInput
                value={editService.totalAfterItemAdjustment}
                label='Total After Adj'
                style={{
                  marginLeft: theme.spacing(7),
                  paddingRight: theme.spacing(6),
                }}
                currency
                disabled
              />
            </GridItem>
          </GridContainer>
          {footer({
            onSave: this.validateAndSubmitIfOk,
            onReset: this.handleReset,
          })}
        </div>
      </Authorized>
    )
  }
}
export default withStyles(styles, { withTheme: true })(Radiology)
