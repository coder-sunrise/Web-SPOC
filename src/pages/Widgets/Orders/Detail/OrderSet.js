import React, { PureComponent } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import moment from 'moment'
import { CustomInput } from 'mui-pro-components'
import numeral from 'numeral'
import {
  GridContainer,
  GridItem,
  CodeSelect,
  withFormikExtend,
  CommonTableGrid,
  serverDateTimeFormatFull,
  Field,
  NumberInput,
  notification,
  Tooltip,
  LocalSearchSelect,
} from '@/components'
import Yup from '@/utils/yup'
import { getUniqueId, getTranslationValue } from '@/utils/utils'
import { qtyFormat } from '@/utils/config'
import {
  openCautionAlertPrompt,
  GetOrderItemAccessRight,
} from '@/pages/Widgets/Orders/utils'
import Authorized from '@/utils/Authorized'
import { isMatchInstructionRule } from '@/pages/Widgets/Orders/utils'
import { ORDER_TYPES } from '@/utils/constants'
import { getClinicianProfile } from '../../ConsultationDocument/utils'

@connect(
  ({
    global,
    codetable,
    user,
    consultationDocument,
    visitRegistration,
    patient,
    clinicSettings,
  }) => ({
    global,
    codetable,
    user,
    consultationDocument,
    visitRegistration,
    patient,
    clinicSettings: clinicSettings.settings || clinicSettings.default,
  }),
)
@withFormikExtend({
  mapPropsToValues: ({ orders = {}, type }) => {
    const v = {
      ...(orders.entity || orders.defaultOrderSet),
      type,
    }
    return v
  },
  enableReinitialize: true,
  validationSchema: Yup.object().shape({
    inventoryOrderSetFK: Yup.number().required(),
  }),
  handleSubmit: (values, { props, onConfirm, setValues, resetForm }) => {
    const {
      dispatch,
      orders = {},
      codetable,
      getNextSequence,
      user,
      visitRegistration,
      patient,
      consultationDocument: { rows = [] },
      clinicSettings,
    } = props
    const {
      primaryPrintoutLanguage = 'EN',
      secondaryPrintoutLanguage = '',
    } = clinicSettings
    const { doctorprofile } = codetable
    const { entity: visitEntity } = visitRegistration
    const clinicianProfile = getClinicianProfile(codetable, visitEntity)
    const { entity } = patient
    const { name, patientAccountNo, genderFK, dob } = entity
    const { ctgender = [] } = codetable
    const gender = ctgender.find(o => o.id === genderFK) || {}
    const allDocs = rows.filter(s => !s.isDeleted)
    let nextDocumentSequence = 1
    if (allDocs && allDocs.length > 0) {
      const { sequence: documentSequence } = _.maxBy(allDocs, 'sequence')
      nextDocumentSequence = documentSequence + 1
    }
    let showNoTemplate

    const { doctorProfileFK } = visitRegistration.entity.visit
    const visitDoctorUserId = doctorprofile.find(d => d.id === doctorProfileFK)
      .clinicianProfile.userProfileFK

    const getOrderServiceCenterServiceFromOrderSet = (
      orderSetCode,
      orderSetItem,
    ) => {
      const { service } = orderSetItem
      const serviceCenterService = service.ctServiceCenter_ServiceNavigation[0]
      const serviceCenter = serviceCenterService.serviceCenterFKNavigation
      let item
      if (service.isActive === true && serviceCenter.isActive === true) {
        item = {
          isActive: serviceCenter.isActive && service.isActive,
          serviceCenterServiceFK: serviceCenterService.id,
          quantity: orderSetItem.quantity,
          unitPrice: orderSetItem.unitPrice,
          total: orderSetItem.unitPrice * orderSetItem.quantity,
          adjAmount: 0,
          adjType: 'ExactAmount',
          adjValue: 0,
          totalAfterItemAdjustment:
            orderSetItem.unitPrice * orderSetItem.quantity,
          totalAfterOverallAdjustment:
            orderSetItem.unitPrice * orderSetItem.quantity,
          orderSetCode,
          serviceCode: service.code,
          serviceName: service.displayValue,
          serviceFK: service.id,
          serviceCenterFK: serviceCenterService.serviceCenterFK,
          subject: service.displayValue,
          serviceCenterCategoryFK: serviceCenter.serviceCenterCategoryFK,
        }
      }
      return item
    }

    const getOrderConsumableFromOrderSet = (orderSetCode, orderSetItem) => {
      const { inventoryConsumable } = orderSetItem

      const isDefaultBatchNo = inventoryConsumable.consumableStock.find(
        o => o.isDefault === true,
      )

      let item
      if (
        inventoryConsumable.isActive === true &&
        inventoryConsumable.orderable
      ) {
        item = {
          inventoryConsumableFK: inventoryConsumable.id,
          isActive: inventoryConsumable.isActive,
          quantity: orderSetItem.quantity,
          unitPrice: orderSetItem.unitPrice,
          totalPrice: orderSetItem.unitPrice * orderSetItem.quantity,
          adjAmount: 0,
          adjType: 'ExactAmount',
          adjValue: 0,
          totalAfterItemAdjustment:
            orderSetItem.unitPrice * orderSetItem.quantity,
          totalAfterOverallAdjustment:
            orderSetItem.unitPrice * orderSetItem.quantity,
          orderSetCode,
          consumableCode: inventoryConsumable.code,
          consumableName: inventoryConsumable.displayValue,
          subject: inventoryConsumable.displayValue,
          expiryDate: isDefaultBatchNo
            ? isDefaultBatchNo.expiryDate
            : undefined,
          batchNo: isDefaultBatchNo ? isDefaultBatchNo.batchNo : undefined,
        }
      }

      return item
    }
    const getOrderFromOrderSet = (orderSetCode, orderSetItem) => {
      let item
      if (orderSetItem.type === '3') {
        item = getOrderServiceCenterServiceFromOrderSet(
          orderSetCode,
          orderSetItem,
        )
      }
      if (orderSetItem.type === '4') {
        item = getOrderConsumableFromOrderSet(orderSetCode, orderSetItem)
      }
      return item
    }

    const { orderSetItems, orderSetCode } = values
    let datas = []
    let nextSequence = getNextSequence()
    for (let index = 0; index < orderSetItems.length; index++) {
      const newOrder = getOrderFromOrderSet(orderSetCode, orderSetItems[index])
      if (newOrder) {
        let type = orderSetItems[index].type
        const data = {
          isOrderedByDoctor:
            user.data.clinicianProfile.userProfile.role.clinicRoleFK === 1,
          sequence: nextSequence,
          ...newOrder,
          subject: orderSetItems[index].name,
          isDeleted: false,
          type,
        }
        datas.push(data)
        nextSequence += 1
      }
    }
    dispatch({
      type: 'orders/upsertRows',
      payload: datas,
    })
    if (onConfirm) onConfirm()
    if (resetForm) resetForm()
    setValues({
      ...orders.defaultOrderSet,
      type: orders.type,
    })
  },
  displayName: 'OrderPage',
})
class OrderSet extends PureComponent {
  constructor(props) {
    super(props)
    const { dispatch, classes } = props
    const codeTableNameArray = []
    dispatch({
      type: 'codetable/batchFetch',
      payload: {
        codes: codeTableNameArray,
      },
    })

    this.tableProps = {
      getRowId: r => r.uid,
      columns: [
        { name: 'typeName', title: 'Type' },
        { name: 'name', title: 'Name' },
        { name: 'quantity', title: 'Quantity' },
        { name: 'subTotal', title: 'Total' },
      ],
      columnExtensions: [
        {
          columnName: 'typeName',
          render: row => {
            return (
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-wrap',
                    paddingRight: row.isExclusive ? 24 : 0,
                  }}
                >
                  <Tooltip title={row.typeName}>
                    <span>{row.typeName}</span>
                  </Tooltip>
                  <div
                    style={{ position: 'absolute', top: '-1px', right: '-6px' }}
                  >
                    {row.isExclusive && (
                      <Tooltip title='The item has no local stock, we will purchase on behalf and charge to patient in invoice'>
                        <div
                          className={classes.rightIcon}
                          style={{
                            borderRadius: 4,
                            backgroundColor: 'green',
                            display: 'inline-block',
                          }}
                        >
                          Excl.
                        </div>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
            )
          },
        },
        {
          columnName: 'name',
          render: row => {
            if (row.isActive === true) {
              return <CustomInput text value={row.name} />
            }
            return <CustomInput text inActive value={row.name} />
          },
        },
        {
          columnName: 'quantity',
          align: 'right',
          render: row => {
            if (row.isActive === true) {
              return (
                <CustomInput
                  text
                  currency
                  value={numeral(row.quantity).format(qtyFormat)}
                />
              )
            }
            return (
              <CustomInput
                text
                inActive
                value={numeral(row.quantity).format(qtyFormat)}
              />
            )
          },
        },
        {
          columnName: 'subTotal',
          align: 'right',
          render: row => {
            if (row.isActive === true) {
              return <NumberInput text currency value={row.subTotal} />
            }
            return <NumberInput text inActive currency value={row.subTotal} />
          },
        },
      ],
    }

    this.changeOrderSet = (v, op) => {
      const { setValues, values, orderTypes, codetable, patient } = this.props
      const { entity = {} } = patient
      let rows = []
      if (op && op.serviceOrderSetItem) {
        rows = rows.concat(
          op.serviceOrderSetItem.map(o => {
            let typeName = 'Service'
            const { service } = o
            const serviceCenterService =
              service.ctServiceCenter_ServiceNavigation[0]
            const serviceCenter = serviceCenterService.serviceCenterFKNavigation
            return {
              ...o,
              name: o.serviceName,
              uid: getUniqueId(),
              type: '3',
              typeName:
                typeName +
                (service.isActive && serviceCenter.isActive === true
                  ? ''
                  : ' (Inactive)'),
              isActive:
                o.service.isActive &&
                o.service.ctServiceCenter_ServiceNavigation[0]
                  .serviceCenterFKNavigation.isActive,
            }
          }),
        )
      }
      if (op && op.consumableOrderSetItem) {
        rows = rows.concat(
          op.consumableOrderSetItem.map(o => {
            return {
              ...o,
              name: o.consumableName,
              uid: getUniqueId(),
              type: '4',
              typeName:
                orderTypes.find(type => type.value === '4').name +
                (o.inventoryConsumable.isActive === true ? '' : ' (Inactive)'),
              isActive: o.inventoryConsumable.isActive === true,
            }
          }),
        )
      }
      setValues({
        ...values,
        orderSetItems: rows,
        orderSetCode: op ? op.code : '',
      })
    }

    this.handleReset = () => {
      const { setValues, orders } = this.props
      setValues({
        ...orders.defaultOrderSet,
        type: orders.type,
      })
    }
  }

  componentWillMount() {
    const { dispatch } = this.props
    const codeTableNameArray = ['inventoryorderset']
    dispatch({
      type: 'codetable/batchFetch',
      payload: {
        codes: codeTableNameArray,
      },
    })
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
  matchSearch = (option, input) => {
    const lowerCaseInput = input.toLowerCase()
    return (
      option.code.toLowerCase().indexOf(lowerCaseInput) >= 0 ||
      option.displayValue.toLowerCase().indexOf(lowerCaseInput) >= 0
    )
  }
  render() {
    const {
      theme,
      values,
      footer,
      from,
      codetable: { inventoryorderset = [] },
    } = this.props
    return (
      <Authorized
        authority={GetOrderItemAccessRight(
          from,
          'queue.consultation.order.orderset',
        )}
      >
        <div>
          <GridContainer>
            <GridItem xs={6}>
              <Field
                name='inventoryOrderSetFK'
                render={args => {
                  return (
                    <div id={`autofocus_${values.type}`}>
                      <LocalSearchSelect
                        temp
                        label='Order Set Name'
                        labelField='displayValue'
                        onChange={this.changeOrderSet}
                        options={inventoryorderset}
                        matchSearch={this.matchSearch}
                        {...args}
                      />
                    </div>
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <CommonTableGrid
                rows={values.orderSetItems}
                style={{
                  margin: `${theme.spacing(1)}px 0`,
                }}
                {...this.tableProps}
              />
            </GridItem>
          </GridContainer>
          {footer({
            onSave: this.validateAndSubmitIfOk,
            onReset: this.handleReset,
            showAdjustment: false,
          })}
        </div>
      </Authorized>
    )
  }
}
export default OrderSet
