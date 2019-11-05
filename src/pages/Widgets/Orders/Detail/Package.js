import React, { PureComponent } from 'react'
import { connect } from 'dva'
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
} from '@/components'
import Yup from '@/utils/yup'
import { getUniqueId } from '@/utils/utils'
import { orderTypes } from '@/utils/codes'
import config from '@/utils/config'

const { qtyFormat } = config

@connect(({ global }) => ({ global }))
@withFormikExtend({
  mapPropsToValues: ({ orders = {}, type }) => {
    const v = {
      ...orders.defaultPackage,
      type,
    }
    return v
  },
  enableReinitialize: true,
  validationSchema: Yup.object().shape({
    inventorypackageFK: Yup.number().required(),
  }),
  handleSubmit: (values, { props, onConfirm }) => {
    const { dispatch, orders } = props
    const { rows } = orders
    const getOrderMedicationFromPackage = (packageCode, packageItem) => {
      const { inventoryMedication } = packageItem
      const medicationPrecautions =
        inventoryMedication.inventoryMedication_MedicationPrecaution
      let item
      if (inventoryMedication.isActive === true) {
        let currentMedicationPrecautions = []
        currentMedicationPrecautions = currentMedicationPrecautions.concat(
          medicationPrecautions.map((o) => {
            return {
              precautionCode: o.medicationPrecaution.code,
              Precaution: o.medicationPrecaution.name,
              sequence: o.sequence,
              medicationPrecautionFK: o.medicationPrecautionFK,
            }
          }),
        )

        item = {
          inventoryMedicationFK: inventoryMedication.id,
          drugCode: inventoryMedication.code,
          drugName: inventoryMedication.displayValue,
          quantity: packageItem.quantity,
          costPrice: inventoryMedication.costPrice,
          unitPrice: packageItem.unitPrice,
          totalPrice: packageItem.unitPrice * packageItem.quantity,
          adjAmount: 0,
          totalAfterItemAdjustment:
            packageItem.unitPrice * packageItem.quantity,
          totalAfterOverallAdjustment:
            packageItem.unitPrice * packageItem.quantity,
          packageCode,
          expiryDate: undefined,
          batchNo: undefined,
          isExternalPrescription: false,
          // instruction:,
          dispenseUOMFK: inventoryMedication.dispensingUOMFK,
          dispenseUOMCode: undefined,
          dispenseUOMDisplayValue: undefined,
          corPrescriptionItemPrecaution: currentMedicationPrecautions,
          corPrescriptionItemInstruction: [
            {
              usageMethodFK: inventoryMedication.medicationUsageFK,
              dosageFK: inventoryMedication.prescribingDosageFK,
              prescribeUOMFK: inventoryMedication.prescribingUOMFK,
              drugFrequencyFK: inventoryMedication.medicationFrequencyFK,
              duration: inventoryMedication.duration,
              stepdose: 'AND',
              sequence: 0,
              // duration:,
            },
          ],
        }
      }
      return item
    }

    const getOrderVaccinationFromPackage = (packageCode, packageItem) => {
      const { inventoryVaccination } = packageItem
      let item
      if (inventoryVaccination.isActive === true) {
        item = {
          inventoryVaccinationFK: inventoryVaccination.id,
          vaccinationGivenDate: moment().format(serverDateTimeFormatFull),
          vaccinationCode: inventoryVaccination.code,
          vaccinationName: inventoryVaccination.displayValue,
          // vaccinationSequenceDisplayValue:
          usageMethodFK: inventoryVaccination.vaccinationUsageFK,
          usageMethodCode: undefined,
          usageMethodDisplayValue: undefined,
          dosageFK: inventoryVaccination.prescribingDosageFK,
          dosageCode: undefined,
          dosageDisplayValue: undefined,
          uomfk: inventoryVaccination.prescribingUOMFK,
          uomCode: undefined,
          uomDisplayValue: undefined,
          quantity: inventoryVaccination.dispensingQuantity,
          unitPrice: packageItem.unitPrice,
          totalPrice: packageItem.unitPrice * packageItem.quantity,
          adjAmount: 0,
          totalAfterItemAdjustment:
            packageItem.unitPrice * packageItem.quantity,
          totalAfterOverallAdjustment:
            packageItem.unitPrice * packageItem.quantity,
          packageCode,
          expiryDate: undefined,
          batchNo: undefined,
        }
      }
      return item
    }

    const getOrderServiceCenterServiceFromPackage = (
      packageCode,
      packageItem,
    ) => {
      const { service } = packageItem
      const serviceCenterService = service.ctServiceCenter_ServiceNavigation[0]
      const serviceCenter = serviceCenterService.serviceCenterFKNavigation
      let item
      if (
        service.isActive === true &&
        serviceCenterService.isActive === true &&
        serviceCenter.isActive === true
      ) {
        item = {
          serviceCenterServiceFK: serviceCenterService.id,
          quantity: packageItem.quantity,
          unitPrice: packageItem.unitPrice,
          total: packageItem.unitPrice * packageItem.quantity,
          adjAmount: 0,
          totalAfterItemAdjustment:
            packageItem.unitPrice * packageItem.quantity,
          totalAfterOverallAdjustment:
            packageItem.unitPrice * packageItem.quantity,
          packageCode,
          // priority:,
          serviceCode: service.code,
          serviceName: service.displayValue,
          serviceFK: service.id,
          serviceCenterFK: serviceCenterService.serviceCenterFK,
        }
      }
      return item
    }

    const getOrderConsumableFromPackage = (packageCode, packageItem) => {
      const { inventoryConsumable } = packageItem
      let item
      if (inventoryConsumable.isActive === true) {
        item = {
          inventoryConsumableFK: inventoryConsumable.id,
          // unitOfMeasurement:,
          quantity: packageItem.quantity,
          unitPrice: packageItem.unitPrice,
          totalPrice: packageItem.unitPrice * packageItem.quantity,
          adjAmount: 0,
          totalAfterItemAdjustment:
            packageItem.unitPrice * packageItem.quantity,
          totalAfterOverallAdjustment:
            packageItem.unitPrice * packageItem.quantity,
          packageCode,
          consumableCode: inventoryConsumable.code,
          consumableName: inventoryConsumable.displayValue,
        }
      }

      return item
    }
    const getOrderFromPackage = (packageCode, packageItem) => {
      let item
      if (packageItem.type === '1') {
        item = getOrderMedicationFromPackage(packageCode, packageItem)
      }
      if (packageItem.type === '2') {
        item = getOrderVaccinationFromPackage(packageCode, packageItem)
      }
      if (packageItem.type === '3') {
        item = getOrderServiceCenterServiceFromPackage(packageCode, packageItem)
      }
      if (packageItem.type === '4') {
        item = getOrderConsumableFromPackage(packageCode, packageItem)
      }
      return item
    }

    let { length } = rows
    const { packageItems, packageCode } = values
    let datas = []
    for (let index = 0; index < packageItems.length; index++) {
      const newOrder = getOrderFromPackage(packageCode, packageItems[index])
      if (newOrder) {
        const data = {
          sequence: length,
          ...newOrder,
          subject: packageItems[index].name,
          isDeleted: false,
          type: packageItems[index].type,
        }
        datas.push(data)
        length += 1
      }
    }
    dispatch({
      type: 'orders/upsertRows',
      payload: datas,
    })
    if (onConfirm) onConfirm()
  },
  displayName: 'OrderPage',
})
class Package extends PureComponent {
  constructor (props) {
    super(props)
    this.tableProps = {
      getRowId: (r) => r.uid,
      columns: [
        { name: 'typeName', title: 'Type' },
        { name: 'name', title: 'Name' },
        { name: 'quantity', title: 'Quantity' },
        { name: 'subTotal', title: 'Total' },
      ],
      columnExtensions: [
        {
          columnName: 'typeName',
          render: (row) => {
            if (row.isActive === true) {
              return <CustomInput text value={row.typeName} />
            }
            return <CustomInput text inActive value={row.typeName} />
          },
        },
        {
          columnName: 'name',
          render: (row) => {
            if (row.isActive === true) {
              return <CustomInput text value={row.name} />
            }
            return <CustomInput text inActive value={row.name} />
          },
        },
        {
          columnName: 'quantity',
          align: 'right',
          render: (row) => {
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
          render: (row) => {
            if (row.isActive === true) {
              return <NumberInput text currency value={row.subTotal} />
            }
            return <NumberInput text inActive currency value={row.subTotal} />
          },
        },
      ],
    }

    this.changePackage = (v, op) => {
      const { setValues, values } = this.props
      let rows = []
      if (op && op.medicationPackageItem) {
        rows = rows.concat(
          op.medicationPackageItem.map((o) => {
            return {
              ...o,
              name: o.medicationName,
              uid: getUniqueId(),
              type: '1',
              typeName:
                orderTypes.find((type) => type.value === '1').name +
                (o.inventoryMedication.isActive === true ? '' : ' (Inactive)'),
              isActive: o.inventoryMedication.isActive === true,
            }
          }),
        )
      }
      if (op && op.vaccinationPackageItem) {
        rows = rows.concat(
          op.vaccinationPackageItem.map((o) => {
            return {
              ...o,
              name: o.vaccinationName,
              uid: getUniqueId(),
              type: '2',
              typeName:
                orderTypes.find((type) => type.value === '2').name +
                (o.inventoryVaccination.isActive === true ? '' : ' (Inactive)'),
              isActive: o.inventoryVaccination.isActive === true,
            }
          }),
        )
      }
      if (op && op.servicePackageItem) {
        rows = rows.concat(
          op.servicePackageItem.map((o) => {
            return {
              ...o,
              name: o.serviceName,
              uid: getUniqueId(),
              type: '3',
              typeName:
                orderTypes.find((type) => type.value === '3').name +
                (o.service.isActive === true &&
                o.service.ctServiceCenter_ServiceNavigation[0].isActive ===
                  true &&
                o.service.ctServiceCenter_ServiceNavigation[0]
                  .serviceCenterFKNavigation.isActive === true
                  ? ''
                  : ' (Inactive)'),
              isActive:
                o.service.isActive === true &&
                o.service.ctServiceCenter_ServiceNavigation[0].isActive ===
                  true &&
                o.service.ctServiceCenter_ServiceNavigation[0]
                  .serviceCenterFKNavigation.isActive === true,
            }
          }),
        )
      }
      if (op && op.consumablePackageItem) {
        rows = rows.concat(
          op.consumablePackageItem.map((o) => {
            return {
              ...o,
              name: o.consumableName,
              uid: getUniqueId(),
              type: '4',
              typeName:
                orderTypes.find((type) => type.value === '4').name +
                (o.inventoryConsumable.isActive === true ? '' : ' (Inactive)'),
              isActive: o.inventoryConsumable.isActive === true,
            }
          }),
        )
      }
      setValues({
        ...values,
        packageItems: rows,
        packageCode: op ? op.code : '',
      })
    }

    this.handleReset = () => {
      const { setValues, orders } = this.props
      setValues({
        ...orders.defaultPackage,
        type: orders.type,
      })
    }
  }

  render () {
    const { theme, values, footer, handleSubmit } = this.props
    return (
      <div>
        <GridContainer>
          <GridItem xs={12}>
            <Field
              name='inventorypackageFK'
              render={(args) => {
                return (
                  <CodeSelect
                    label='Package Name'
                    code='inventorypackage'
                    labelField='displayValue'
                    onChange={this.changePackage}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={12}>
            <CommonTableGrid
              rows={values.packageItems}
              style={{
                margin: `${theme.spacing(1)}px 0`,
              }}
              {...this.tableProps}
            />
          </GridItem>
        </GridContainer>
        {footer({
          onSave: handleSubmit,
          onReset: this.handleReset,
          showAdjustment: false,
        })}
      </div>
    )
  }
}
export default Package
