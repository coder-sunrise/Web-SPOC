import React, { PureComponent } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import { isNumber } from 'util'
import { Link } from 'umi'
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
  FastField,
  Field,
  Tooltip,
  FieldSet,
} from '@/components'
import { currencySymbol } from '@/utils/config'
import Authorized from '@/utils/Authorized'
import Yup from '@/utils/yup'
import { getServices } from '@/utils/codetable'
import { calculateAdjustAmount } from '@/utils/utils'
import { GetOrderItemAccessRight } from '@/pages/Widgets/Orders/utils'
import { CANNED_TEXT_TYPE, SERVICE_CENTER_CATEGORY } from '@/utils/constants'
import {
  RADIOLOGY_WORKITEM_STATUS,
  NURSE_WORKITEM_STATUS,
} from '@/utils/constants'
import CannedTextButton from './CannedTextButton'
import { Alert } from 'antd'

const { CheckableTag } = Tag

const styles = theme => ({
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
    width: 60,
    textAlign: 'right',
    fontSize: '0.85rem',
    fontWeight: 500,
    display: 'inline-block',
    marginRight: 4,
  },
  tag: {
    border: '1px solid rgba(0, 0, 0, 0.42)',
    fontSize: '0.85rem',
    padding: '3px 10px',
  },
  groupPanel: {
    margin: '0px 5px',
    maxHeight: 170,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  checkServiceItem: {
    display: 'inline-block',
    border: '1px solid green',
    borderRadius: 4,
    margin: 3,
    padding: '0px 6px',
    width: 185,
    alignItems: 'right',
    position: 'relative',
    height: 28,
  },
  checkServiceLabel: {
    width: 155,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    display: 'inline-block',
    marginTop: 3,
    cursor: 'pointer',
  },
  checkServiceCheckBox: {
    display: 'inline-block',
    marginRight: '-16px',
    position: 'absolute',
    top: '-3px',
    right: 0,
  },
  legend: {
    width: 'fit-content',
    fontSize: '0.85rem',
    margin: `${theme.spacing(1)}px ${theme.spacing(1)}px 0px`,
    padding: `0px ${theme.spacing(1)}px`,
    fontWeight: 500,
  },
})

const getVisitDoctorUserId = props => {
  const { doctorprofile } = props.codetable
  const { doctorProfileFK } = props.visitRegistration.entity.visit
  let visitDoctorUserId
  if (doctorprofile && doctorProfileFK) {
    visitDoctorUserId = doctorprofile.find(d => d.id === doctorProfileFK)
      .clinicianProfile.userProfileFK
  }

  return visitDoctorUserId
}

@connect(({ codetable, global, user, visitRegistration, patient }) => ({
  codetable,
  global,
  user,
  visitRegistration,
  patient,
}))
@withFormikExtend({
  mapPropsToValues: ({ orders = {}, type }) => {
    const v = {
      ...(orders.entity || orders.defaultRadiology),
    }
    return {
      ...v,
      type,
      isEdit: !_.isEmpty(orders.entity),
    }
  },
  enableReinitialize: true,
  validationSchema: Yup.object().shape({
    serviceCenterFK: Yup.number().when('editServiceId', {
      is: val => val,
      then: Yup.number().required(),
    }),
    quantity: Yup.number().when('editServiceId', {
      is: val => val,
      then: Yup.number().required(),
    }),
    total: Yup.number().when('editServiceId', {
      is: val => val,
      then: Yup.number().required(),
    }),
    totalAfterItemAdjustment: Yup.number().when('editServiceId', {
      is: val => val,
      then: Yup.number().min(0.0, 'The amount should be more than 0.00'),
    }),
  }),

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

    if (values.isEdit) {
      dispatch({
        type: 'orders/upsertRow',
        payload: data[0],
      })
    } else {
      dispatch({
        type: 'orders/upsertRows',
        payload: data,
      })
    }
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
  constructor(props) {
    super(props)
    const { dispatch } = props

    this.state = {
      services: [],
      serviceCenters: [],
      serviceCenterServices: [],
      serviceTags: [],
      serviceCatetorys: [],
      isPreOrderItemExists: false,
    }

    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctservice',
        force: true,
        filter: {
          'serviceFKNavigation.IsActive': true,
          'serviceCenterFKNavigation.IsActive': true,
          combineCondition: 'and',
          apiCriteria: { ServiceCenterType: 'Radiology' },
        },
      },
    }).then(list => {
      const {
        services = [],
        serviceCenters = [],
        serviceCenterServices = [],
        serviceCatetorys = [],
        serviceTags = [],
      } = getServices(list)

      const newServices = services.reduce((p, c) => {
        const { value: serviceFK, name } = c

        const serviceCenterService =
          serviceCenterServices.find(
            o => o.serviceId === serviceFK && o.isDefault,
          ) || {}

        const { unitPrice = 0 } = serviceCenterService || {}

        const opt = {
          ...c,
          unitPrice,
        }
        return [...p, opt]
      }, [])

      this.setState({
        services: newServices,
        serviceCenters,
        serviceCenterServices,
        serviceTags: [{ value: 'All', name: 'All' }, ...serviceTags],
        serviceCatetorys: [{ value: 'All', name: 'All' }, ...serviceCatetorys],
      })
    })
  }

  getServiceCenterService = editService => {
    const { serviceFK, serviceCenterFK } = editService
    const obj = serviceCenterService => {
      editService.isActive = serviceCenterService.isActive
      editService.serviceCenterServiceFK =
        serviceCenterService.serviceCenter_ServiceId
      editService.unitPrice = serviceCenterService.unitPrice
      editService.total = serviceCenterService.unitPrice
      editService.quantity = 1
    }

    if (serviceFK && !serviceCenterFK) {
      const serviceCenterService =
        this.state.serviceCenterServices.find(
          o => o.serviceId === serviceFK && o.isDefault,
        ) ||
        this.state.serviceCenterServices.find(o => o.serviceId === serviceFK)
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

    const serviceCenterService = this.state.serviceCenterServices.find(
      o => o.serviceId === serviceFK && o.serviceCenterId === serviceCenterFK,
    )
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
      isEdit: false,
    })
  }

  onAdjustmentConditionChange = editService => {
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
    const { handleSubmit, values } = this.props
    const { radiologyItems = [] } = values
    if (!radiologyItems.length) return
    if (
      radiologyItems.filter(
        r =>
          r.serviceCenterFK &&
          r.quantity >= 0 &&
          r.total >= 0 &&
          r.totalAfterItemAdjustment >= 0,
      ).length !== radiologyItems.length
    )
      return
    handleSubmit()
  }

  isValidate = service => {
    const { values } = this.props
    const { radiologyItems = [] } = values
    let checkedRadiology = radiologyItems.find(
      r => r.serviceFK === service.value,
    )
    if (!checkedRadiology) {
      return true
    }
    if (
      checkedRadiology.serviceCenterFK &&
      checkedRadiology.quantity >= 0 &&
      checkedRadiology.total >= 0 &&
      checkedRadiology.totalAfterItemAdjustment >= 0
    ) {
      return true
    }
    return false
  }

  setSelectRadilogy = selectRadiology => {
    const { setFieldValue } = this.props
    setFieldValue('editServiceId', selectRadiology.serviceFK)
    setFieldValue('serviceCenterFK', selectRadiology.serviceCenterFK)
    setFieldValue('quantity', selectRadiology.quantity)
    setFieldValue('total', selectRadiology.total)
    setFieldValue(
      'totalAfterItemAdjustment',
      selectRadiology.totalAfterItemAdjustment,
    )

    if (selectRadiology.isPreOrder === true)
      this.checkIsPreOrderItemExistsInListing(selectRadiology.serviceFK, true)
    else this.setState({ isPreOrderItemExists: false })
  }

  checkIsPreOrderItemExistsInListing = (editServiceId, val) => {
    const {
      setFieldValue,
      values,
      codetable,
      visitRegistration,
      patient,
      orders = {},
    } = this.props

    if (val) {
      const radiologyPreOrderItem = patient?.entity?.pendingPreOrderItem.filter(
        x => x.preOrderItemType === 'Radiology',
      )
      if (radiologyPreOrderItem) {
        radiologyPreOrderItem.filter(item => {
          const { preOrderServiceItem = {} } = item
          const CheckIfPreOrderItemExists =
            preOrderServiceItem.serviceFK === editServiceId
          if (CheckIfPreOrderItemExists) {
            this.setState({ isPreOrderItemExists: true })
            return
          }
        })
      }
    } else {
      this.setState({ isPreOrderItemExists: false })
    }
  }

  render() {
    const {
      theme,
      classes,
      values = {},
      footer,
      from,
      setFieldValue,
      orders,
    } = this.props
    const {
      services = [],
      serviceCenters = [],
      serviceCatetorys = [],
      serviceTags = [],
      isPreOrderItemExists,
    } = this.state
    const {
      radiologyItems = [],
      isEdit,
      editServiceId,
      filterService = '',
      selectCategory,
      selectTag,
      type,
    } = values
    const totalPriceReadonly =
      Authorized.check('queue.consultation.modifyorderitemtotalprice')
        .rights !== 'enable'

    const selectService = radiologyItems.map(r => r.serviceName).join(', ')
    const editService =
      radiologyItems.find(r => r.serviceFK === editServiceId) || {}
    let filterServices = []
    if (isEdit) {
      filterServices = services.filter(s => s.value === editServiceId)
    } else {
      filterServices = services.filter(
        s =>
          radiologyItems.find(r => r.serviceFK === s.value) ||
          ((selectTag === 'All' ||
            s.serviceTags.find(st => st.value === selectTag)) &&
            (selectCategory === 'All' ||
              s.serviceCategoryFK === selectCategory) &&
            (s.code.toUpperCase().indexOf(filterService.toUpperCase()) >= 0 ||
              s.name.toUpperCase().indexOf(filterService.toUpperCase()) >= 0)),
      )
    }
    const isDisabledHasPaidPreOrder =
      editService?.actualizedPreOrderItemFK && editService?.hasPaid == true
        ? true
        : false

    const isDisabledNoPaidPreOrder = editService?.actualizedPreOrderItemFK
      ? true
      : false

    if (orders.isPreOrderItemExists === false && !values.isPreOrder)
      this.setState({ isPreOrderItemExists: false })

    const { workitem = {}, isPreOrder } = editService
    const { radiologyWorkitem = {}, nurseWorkitem = {} } = workitem
    const isStartedRadiology =
      !isPreOrder &&
      ([
        RADIOLOGY_WORKITEM_STATUS.INPROGRESS,
        RADIOLOGY_WORKITEM_STATUS.MODALITYCOMPLETED,
        RADIOLOGY_WORKITEM_STATUS.COMPLETED,
      ].indexOf(radiologyWorkitem.statusFK) >= 0 ||
        nurseWorkitem.statusFK === NURSE_WORKITEM_STATUS.ACTUALIZED)

    return (
      <Authorized
        authority={GetOrderItemAccessRight(
          from,
          'queue.consultation.order.radiology',
        )}
      >
        <div>
          <GridContainer>
            <GridItem xs={12}>
              <div style={{ marginTop: 10 }}>
                <span className={classes.subTitle}>Category: </span>
                {serviceCatetorys.map(category =>
                  isEdit ? (
                    <Tag
                      className={classes.tag}
                      style={{
                        border:
                          selectCategory === category.value
                            ? '1px solid rgba(0, 0, 0, 0)'
                            : '1px solid rgba(0, 0, 0, 0.42)',
                      }}
                      color={
                        selectCategory === category.value
                          ? '#4255bd'
                          : undefined
                      }
                    >
                      {category.name}
                    </Tag>
                  ) : (
                    <CheckableTag
                      key={category.value}
                      checked={selectCategory === category.value}
                      className={classes.tag}
                      style={{
                        border:
                          selectCategory === category.value
                            ? '1px solid rgba(0, 0, 0, 0)'
                            : '1px solid rgba(0, 0, 0, 0.42)',
                      }}
                      onChange={checked => {
                        if (!isEdit && checked)
                          setFieldValue('selectCategory', category.value)
                      }}
                    >
                      {category.name}
                    </CheckableTag>
                  ),
                )}
              </div>
            </GridItem>
            <GridItem xs={12}>
              <div style={{ marginTop: 10 }}>
                <span className={classes.subTitle}>Tag: </span>
                {serviceTags.map(tag =>
                  isEdit ? (
                    <Tag
                      className={classes.tag}
                      style={{
                        border:
                          selectTag === tag.value
                            ? '1px solid rgba(0, 0, 0, 0)'
                            : '1px solid rgba(0, 0, 0, 0.42)',
                      }}
                      color={selectTag === tag.value ? '#4255bd' : undefined}
                    >
                      {tag.name}
                    </Tag>
                  ) : (
                    <CheckableTag
                      key={tag.value}
                      checked={selectTag === tag.value}
                      className={classes.tag}
                      style={{
                        border:
                          selectTag === tag.value
                            ? '1px solid rgba(0, 0, 0, 0)'
                            : '1px solid rgba(0, 0, 0, 0.42)',
                      }}
                      onChange={checked => {
                        if (!isEdit && checked)
                          setFieldValue('selectTag', tag.value)
                      }}
                    >
                      {tag.name}
                    </CheckableTag>
                  ),
                )}
              </div>
            </GridItem>
            <GridItem xs={12}>
              <Field
                name='filterService'
                render={args => {
                  return (
                    <TextField
                      label='Filter by service code, name'
                      onChange={e => {
                        setFieldValue('filterService', e.target.value)
                      }}
                      disabled={isEdit}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FieldSet
                classes={this.props.classes}
                size='sm'
                title='Service'
                style={{ fontSize: '0.85rem' }}
              >
                <div className={classes.groupPanel}>
                  {filterServices.map(r => {
                    return (
                      <div
                        style={{
                          backgroundColor:
                            editServiceId === r.value ? 'lightgreen' : 'white',
                          borderColor: this.isValidate(r) ? '#99CC99' : 'red',
                        }}
                        className={classes.checkServiceItem}
                        onClick={() => {
                          const selectRadiology = radiologyItems.find(
                            item => item.serviceFK === r.value,
                          )
                          if (selectRadiology) {
                            this.setSelectRadilogy(selectRadiology)
                          }
                        }}
                      >
                        <Tooltip
                          title={
                            <div>
                              <div>
                                Service Code: <span>{r.code}</span>
                              </div>
                              <div>
                                Service Name: <span>{r.name}</span>
                              </div>
                              <div>
                                Unit Price:{' '}
                                <span>{`${currencySymbol}${r.unitPrice.toFixed(
                                  2,
                                )}`}</span>
                              </div>
                            </div>
                          }
                        >
                          <span className={classes.checkServiceLabel}>
                            {r.name}
                          </span>
                        </Tooltip>
                        <div className={classes.checkServiceCheckBox}>
                          <Checkbox
                            disabled={isEdit}
                            label=''
                            inputLabel=''
                            checked={
                              !_.isEmpty(
                                radiologyItems.find(
                                  ri => ri.serviceFK === r.value,
                                ),
                              )
                            }
                            onChange={e => {
                              if (e.target.value) {
                                let newService = {
                                  serviceFK: r.value,
                                  serviceName: r.name,
                                  serviceCode: r.code,
                                  priority: 'Normal',
                                  type,
                                  packageGlobalId: '',
                                  performingUserFK: getVisitDoctorUserId(
                                    this.props,
                                  ),
                                  isDisplayValueChangable:
                                    r.isDisplayValueChangable,
                                  isNurseActualizeRequired:
                                    r.isNurseActualizable,
                                }
                                if (isPreOrderItemExists)
                                  this.setState({ isPreOrderItemExists: false })

                                this.getServiceCenterService(newService)
                                setFieldValue('radiologyItems', [
                                  ...radiologyItems,
                                  newService,
                                ])
                                setFieldValue(
                                  'editServiceId',
                                  newService.serviceFK,
                                )
                                setFieldValue(
                                  'serviceCenterFK',
                                  newService.serviceCenterFK,
                                )
                                setFieldValue('quantity', newService.quantity)
                                setFieldValue('total', newService.total)
                                setFieldValue(
                                  'totalAfterItemAdjustment',
                                  newService.totalAfterItemAdjustment,
                                )
                              } else {
                                setFieldValue('radiologyItems', [
                                  ...radiologyItems.filter(
                                    item => item.serviceFK !== r.value,
                                  ),
                                ])
                                setFieldValue('editServiceId', undefined)
                                setFieldValue('serviceCenterFK', undefined)
                                setFieldValue('quantity', undefined)
                                setFieldValue('total', undefined)
                                setFieldValue(
                                  'totalAfterItemAdjustment',
                                  undefined,
                                )
                                if (isPreOrderItemExists)
                                  this.setState({ isPreOrderItemExists: false })
                              }
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </FieldSet>
            </GridItem>
            <GridItem xs={12}>
              <div>
                <div
                  style={{
                    marginTop: 5,
                    display: 'inline-block',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                  }}
                >
                  Selected:
                </div>
                {radiologyItems.map(ri => {
                  return (
                    <div style={{ display: 'inline-block', marginLeft: 10 }}>
                      <Link
                        onClick={e => {
                          e.preventDefault()
                          this.setSelectRadilogy(ri)
                        }}
                      >
                        <span style={{ textDecoration: 'underline' }}>
                          {ri.serviceName}
                        </span>
                      </Link>
                    </div>
                  )
                })}
              </div>
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={4}>
              <TextField
                disabled
                label='Service Name'
                value={editService.serviceName}
              />
            </GridItem>
            <GridItem xs={4}>
              <Field
                name='serviceCenterFK'
                render={args => {
                  return (
                    <Select
                      disabled={
                        !editServiceId ||
                        isStartedRadiology ||
                        isDisabledNoPaidPreOrder
                      }
                      allowClear={false}
                      label='Service Center Name'
                      options={serviceCenters.filter(o =>
                        o.services.find(m => m.value === editServiceId),
                      )}
                      onChange={value => {
                        editService.serviceCenterFK = value
                        if (value) {
                          this.getServiceCenterService(editService)
                          setFieldValue('quantity', editService.quantity)
                          setFieldValue('total', editService.total)
                          setFieldValue(
                            'totalAfterItemAdjustment',
                            editService.totalAfterItemAdjustment,
                          )
                        }
                        setFieldValue('radiologyItems', [...radiologyItems])
                      }}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={3}>
              <Field
                name='quantity'
                render={args => {
                  return (
                    <NumberInput
                      disabled={
                        !editServiceId ||
                        isStartedRadiology ||
                        isDisabledHasPaidPreOrder
                      }
                      label='Quantity'
                      style={{
                        marginLeft: theme.spacing(7),
                        paddingRight: theme.spacing(6),
                      }}
                      step={1}
                      min={0}
                      onChange={e => {
                        editService.quantity = e.target.value
                        if (editService.unitPrice) {
                          const total = e.target.value * editService.unitPrice
                          editService.total = total
                          this.updateTotalPrice(total, editService)
                          setFieldValue('total', editService.total)
                          setFieldValue(
                            'totalAfterItemAdjustment',
                            editService.totalAfterItemAdjustment,
                          )
                        }
                        setFieldValue('radiologyItems', [...radiologyItems])
                      }}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem
              xs={8}
              className={classes.editor}
              style={{ paddingRight: 35 }}
            >
              <div style={{ position: 'relative' }}>
                <TextField
                  value={editService.instruction}
                  disabled={!editServiceId || isStartedRadiology}
                  label='Instructions'
                  onChange={e => {
                    editService.instruction = e.target.value
                    setFieldValue('radiologyItems', [...radiologyItems])
                  }}
                />
                <CannedTextButton
                  disabled={!editServiceId || isStartedRadiology}
                  cannedTextTypeFK={CANNED_TEXT_TYPE.RADIOLOGYINSTRUCTION}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: -35,
                  }}
                  handleSelectCannedText={cannedText => {
                    editService.instruction = `${
                      editService.instruction
                        ? editService.instruction + ' '
                        : ''
                    }${cannedText.text || ''}`.substring(0, 2000)
                    setFieldValue('radiologyItems', [...radiologyItems])
                  }}
                />
              </div>
            </GridItem>
            <GridItem xs={3} className={classes.editor}>
              <Field
                name='total'
                render={args => {
                  return (
                    <NumberInput
                      label='Total'
                      style={{
                        marginLeft: theme.spacing(7),
                        paddingRight: theme.spacing(6),
                      }}
                      min={0}
                      currency
                      onChange={e => {
                        editService.total = e.target.value
                        this.updateTotalPrice(e.target.value, editService)
                        setFieldValue('radiologyItems', [...radiologyItems])
                        setFieldValue(
                          'totalAfterItemAdjustment',
                          editService.totalAfterItemAdjustment,
                        )
                      }}
                      disabled={
                        totalPriceReadonly ||
                        !editServiceId ||
                        isDisabledHasPaidPreOrder
                      }
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={8} className={classes.editor}>
              <TextField
                value={editService.remark}
                disabled={!editServiceId || isStartedRadiology}
                label='Remarks'
                onChange={e => {
                  editService.remark = e.target.value
                  setFieldValue('radiologyItems', [...radiologyItems])
                }}
              />
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
                    onChange={value => {
                      editService.isMinus = value
                      this.onAdjustmentConditionChange(editService)
                      setFieldValue('radiologyItems', [...radiologyItems])
                      setFieldValue(
                        'totalAfterItemAdjustment',
                        editService.totalAfterItemAdjustment,
                      )
                    }}
                    disabled={
                      totalPriceReadonly ||
                      !editServiceId ||
                      isDisabledHasPaidPreOrder
                    }
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
                    noSuffix
                    label='Adjustment'
                    onChange={e => {
                      editService.adjValue = e.target.value
                      this.onAdjustmentConditionChange(editService)
                      setFieldValue('radiologyItems', [...radiologyItems])
                      setFieldValue(
                        'totalAfterItemAdjustment',
                        editService.totalAfterItemAdjustment,
                      )
                    }}
                    disabled={
                      totalPriceReadonly ||
                      !editServiceId ||
                      isDisabledHasPaidPreOrder
                    }
                  />
                ) : (
                  <NumberInput
                    value={editService.adjValue}
                    style={{
                      marginLeft: theme.spacing(7),
                      paddingRight: theme.spacing(6),
                    }}
                    percentage
                    max={100}
                    noSuffix
                    min={0}
                    label='Adjustment'
                    onChange={e => {
                      editService.adjValue = e.target.value
                      this.onAdjustmentConditionChange(editService)
                      setFieldValue('radiologyItems', [...radiologyItems])
                      setFieldValue(
                        'totalAfterItemAdjustment',
                        editService.totalAfterItemAdjustment,
                      )
                    }}
                    disabled={
                      totalPriceReadonly ||
                      !editServiceId ||
                      isDisabledHasPaidPreOrder
                    }
                  />
                )}
              </div>
            </GridItem>
            <GridItem xs={1} className={classes.editor}>
              <div style={{ marginTop: theme.spacing(2) }}>
                <Switch
                  value={!editServiceId ? true : editService.isExactAmount}
                  checkedChildren='$'
                  unCheckedChildren='%'
                  label=''
                  onChange={value => {
                    editService.isExactAmount = value
                    this.onAdjustmentConditionChange(editService)
                    setFieldValue('radiologyItems', [...radiologyItems])
                    setFieldValue(
                      'totalAfterItemAdjustment',
                      editService.totalAfterItemAdjustment,
                    )
                  }}
                  disabled={
                    totalPriceReadonly ||
                    !editServiceId ||
                    isDisabledHasPaidPreOrder
                  }
                />
              </div>
            </GridItem>
          </GridContainer>
          <GridContainer>
            {editServiceId && editService.isDisplayValueChangable ? (
              <GridItem xs={8} className={classes.editor}>
                <TextField
                  value={editService.newServiceName}
                  disabled={!editServiceId || isStartedRadiology}
                  label='New Service Display Name'
                  maxLength={200}
                  onChange={e => {
                    editService.newServiceName = e.target.value
                    setFieldValue('radiologyItems', [...radiologyItems])
                  }}
                />
              </GridItem>
            ) : (
              <GridItem xs={8} className={classes.editor}>
                <div>
                  <div
                    style={{ position: 'relative', display: 'inline-block' }}
                  >
                    <span
                      style={{
                        fontSize: '0.85rem',
                        position: 'absolute',
                        bottom: '4px',
                        fontWeight: 500,
                      }}
                    >
                      Priority:{' '}
                    </span>
                    <div style={{ marginLeft: 60, marginTop: 14 }}>
                      <RadioGroup
                        disabled={!editServiceId || isStartedRadiology}
                        value={editService.priority || 'Normal'}
                        label=''
                        onChange={e => {
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
                  <div style={{ display: 'inline-block', marginLeft: 20 }}>
                    <Checkbox
                      checked={editService.isPreOrder || false}
                      disabled={
                        !editServiceId ||
                        isStartedRadiology ||
                        isDisabledNoPaidPreOrder
                      }
                      style={{ position: 'absolute', bottom: 2 }}
                      label='Pre-Order'
                      onChange={e => {
                        editService.isPreOrder = e.target.value
                        if (!e.target.value) {
                          editService.isChargeToday = false
                        }
                        this.checkIsPreOrderItemExistsInListing(
                          editServiceId,
                          e.target.value,
                        )
                        setFieldValue('radiologyItems', [...radiologyItems])
                      }}
                    />
                    {editService.isPreOrder && (
                      <Checkbox
                        checked={editService.isChargeToday || false}
                        disabled={!editServiceId || isStartedRadiology}
                        style={{
                          position: 'absolute',
                          bottom: 2,
                          left: '380px',
                        }}
                        label='Charge Today'
                        onChange={e => {
                          editService.isChargeToday = e.target.value
                          setFieldValue('radiologyItems', [...radiologyItems])
                        }}
                      />
                    )}
                    {isPreOrderItemExists && (
                      <Alert
                        message={
                          "Item exists in Pre-Order. Plesae check patient's Pre-Order."
                        }
                        type='warning'
                        style={{
                          position: 'absolute',
                          top: 45,
                          left: 200,
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          display: 'inline-block',
                          overflow: 'hidden',
                          lineHeight: '25px',
                          fontSize: '0.85rem',
                        }}
                      />
                    )}
                  </div>
                </div>
              </GridItem>
            )}
            <GridItem xs={3} className={classes.editor}>
              <Field
                name='totalAfterItemAdjustment'
                render={args => {
                  return (
                    <NumberInput
                      label='Total After Adj'
                      style={{
                        marginLeft: theme.spacing(7),
                        paddingRight: theme.spacing(6),
                      }}
                      currency
                      disabled
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            {editServiceId && editService.isDisplayValueChangable && (
              <GridItem xs={8} className={classes.editor}>
                <div>
                  <div
                    style={{ position: 'relative', display: 'inline-block' }}
                  >
                    <span
                      style={{
                        fontSize: '0.85rem',
                        position: 'absolute',
                        bottom: '4px',
                        fontWeight: 500,
                      }}
                    >
                      Priority:{' '}
                    </span>
                    <div style={{ marginLeft: 60, marginTop: 14 }}>
                      <RadioGroup
                        disabled={!editServiceId || isStartedRadiology}
                        value={editService.priority || 'Normal'}
                        label=''
                        onChange={e => {
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
                  <div style={{ display: 'inline-block', marginLeft: 20 }}>
                    <Checkbox
                      checked={editService.isPreOrder || false}
                      disabled={
                        !editServiceId ||
                        isStartedRadiology ||
                        isDisabledNoPaidPreOrder
                      }
                      style={{ position: 'absolute', bottom: 0 }}
                      label='Pre-Order'
                      onChange={e => {
                        editService.isPreOrder = e.target.value
                        if (!e.target.value) {
                          editService.isChargeToday = false
                        }
                        setFieldValue('radiologyItems', [...radiologyItems])
                      }}
                    />
                    {editService.isPreOrder && (
                      <Checkbox
                        checked={editService.isChargeToday || false}
                        disabled={!editServiceId || isStartedRadiology}
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: '380px',
                        }}
                        label='Charge Today'
                        onChange={e => {
                          editService.isChargeToday = e.target.value
                          setFieldValue('radiologyItems', [...radiologyItems])
                        }}
                      />
                    )}
                  </div>
                </div>
              </GridItem>
            )}
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
