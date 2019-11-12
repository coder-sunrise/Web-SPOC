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
import config from '@/utils/config'

const { qtyFormat } = config

@connect(({ global, codetable }) => ({ global, codetable }))
@withFormikExtend({
  mapPropsToValues: ({ orders = {}, type }) => {
    const v = {
      ...(orders.entity || orders.defaultPackage),
      type,
    }
    return v
  },
  enableReinitialize: true,
  validationSchema: Yup.object().shape({
    inventorypackageFK: Yup.number().required(),
  }),
  handleSubmit: (values, { props, onConfirm }) => {
    const { dispatch, orders, codetable } = props
    const { rows } = orders
    const {
      ctmedicationusage,
      ctmedicationunitofmeasurement,
      ctmedicationfrequency,
      ctmedicationdosage,
      ctvaccinationunitofmeasurement,
      ctvaccinationusage,
    } = codetable

    const getInstruction = (inventoryMedication) => {
      let instruction = ''
      const usageMethod = ctmedicationusage.find(
        (codeTableItem) =>
          codeTableItem.id === inventoryMedication.medicationUsageFK,
      )
      instruction += `${usageMethod ? usageMethod.name : ''} `
      const dosage = ctmedicationdosage.find(
        (codeTableItem) =>
          codeTableItem.id === inventoryMedication.prescribingDosageFK,
      )
      instruction += `${dosage ? dosage.displayValue : ''} `
      const prescribe = ctmedicationunitofmeasurement.find(
        (codeTableItem) =>
          codeTableItem.id === inventoryMedication.prescribingUOMFK,
      )
      instruction += `${prescribe ? prescribe.name : ''} `
      const drugFrequency = ctmedicationfrequency.find(
        (codeTableItem) =>
          codeTableItem.id === inventoryMedication.medicationFrequencyFK,
      )
      instruction += `${drugFrequency ? drugFrequency.displayValue : ''} For `
      instruction += `${inventoryMedication.duration
        ? inventoryMedication.duration
        : ''} day(s)`
      return instruction
    }

    const getOrderMedicationFromPackage = (packageCode, packageItem) => {
      const { inventoryMedication } = packageItem

      let item
      if (inventoryMedication.isActive === true) {
        const medicationdispensingUOM = ctmedicationunitofmeasurement.find(
          (uom) => uom.id === inventoryMedication.dispensingUOMFK,
        )
        const medicationusage = ctmedicationusage.find(
          (usage) => usage.id === inventoryMedication.medicationUsageFK,
        )
        const medicationfrequency = ctmedicationfrequency.find(
          (frequency) =>
            frequency.id === inventoryMedication.medicationFrequencyFK,
        )
        const medicationdosage = ctmedicationdosage.find(
          (dosage) => dosage.id === inventoryMedication.prescribingDosageFK,
        )
        const medicationprescribingUOM = ctmedicationunitofmeasurement.find(
          (uom) => uom.id === inventoryMedication.prescribingUOMFK,
        )
        const medicationPrecautions =
          inventoryMedication.inventoryMedication_MedicationPrecaution
        const isDefaultBatchNo = inventoryMedication.medicationStock.find(
          (o) => o.isDefault === true,
        )
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
          expiryDate: isDefaultBatchNo
            ? isDefaultBatchNo.expiryDate
            : undefined,
          batchNo: isDefaultBatchNo ? isDefaultBatchNo.batchNo : undefined,
          isExternalPrescription: false,
          instruction: getInstruction(inventoryMedication),
          dispenseUOMFK: inventoryMedication.dispensingUOMFK,
          dispenseUOMCode: medicationdispensingUOM
            ? medicationdispensingUOM.code
            : undefined,
          dispenseUOMDisplayValue: medicationdispensingUOM
            ? medicationdispensingUOM.name
            : undefined,
          corPrescriptionItemPrecaution: currentMedicationPrecautions,
          corPrescriptionItemInstruction: [
            {
              usageMethodFK: inventoryMedication.medicationUsageFK,
              usageMethodCode: medicationusage
                ? medicationusage.code
                : undefined,
              usageMethodDisplayValue: medicationusage
                ? medicationusage.name
                : undefined,
              dosageFK: inventoryMedication.prescribingDosageFK,
              dosageCode: medicationdosage ? medicationdosage.code : undefined,
              dosageDisplayValue: medicationdosage
                ? medicationdosage.displayValue
                : undefined,
              prescribeUOMFK: inventoryMedication.prescribingUOMFK,
              prescribeUOMCode: medicationprescribingUOM
                ? medicationprescribingUOM.code
                : undefined,
              prescribeUOMDisplayValue: medicationprescribingUOM
                ? medicationprescribingUOM.name
                : undefined,
              drugFrequencyFK: inventoryMedication.medicationFrequencyFK,
              drugFrequencyCode: medicationfrequency
                ? medicationfrequency.code
                : undefined,
              drugFrequencyDisplayValue: medicationfrequency
                ? medicationfrequency.displayValue
                : undefined,
              duration: inventoryMedication.duration,
              stepdose: 'AND',
              sequence: 0,
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
        const vaccinationUOM = ctvaccinationunitofmeasurement.find(
          (uom) => uom.id === inventoryVaccination.prescribingUOMFK,
        )
        const vaccinationusage = ctvaccinationusage.find(
          (usage) => usage.id === inventoryVaccination.vaccinationUsageFK,
        )
        const vaccinationdosage = ctmedicationdosage.find(
          (dosage) => dosage.id === inventoryVaccination.prescribingDosageFK,
        )
        const isDefaultBatchNo = inventoryVaccination.vaccinationStock.find(
          (o) => o.isDefault === true,
        )

        item = {
          inventoryVaccinationFK: inventoryVaccination.id,
          vaccinationGivenDate: moment().format(serverDateTimeFormatFull),
          vaccinationCode: inventoryVaccination.code,
          vaccinationName: inventoryVaccination.displayValue,
          // vaccinationSequenceDisplayValue:
          usageMethodFK: inventoryVaccination.vaccinationUsageFK,
          usageMethodCode: vaccinationusage ? vaccinationusage.code : undefined,
          usageMethodDisplayValue: vaccinationusage
            ? vaccinationusage.name
            : undefined,
          dosageFK: inventoryVaccination.prescribingDosageFK,
          dosageCode: vaccinationdosage ? vaccinationdosage.code : undefined,
          dosageDisplayValue: vaccinationdosage
            ? vaccinationdosage.displayValue
            : undefined,
          uomfk: inventoryVaccination.prescribingUOMFK,
          uomCode: vaccinationUOM ? vaccinationUOM.code : undefined,
          uomDisplayValue: vaccinationUOM ? vaccinationUOM.name : undefined,
          quantity: inventoryVaccination.dispensingQuantity,
          unitPrice: packageItem.unitPrice,
          totalPrice: packageItem.unitPrice * packageItem.quantity,
          adjAmount: 0,
          totalAfterItemAdjustment:
            packageItem.unitPrice * packageItem.quantity,
          totalAfterOverallAdjustment:
            packageItem.unitPrice * packageItem.quantity,
          packageCode,
          expiryDate: isDefaultBatchNo
            ? isDefaultBatchNo.expiryDate
            : undefined,
          batchNo: isDefaultBatchNo ? isDefaultBatchNo.batchNo : undefined,
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
    const { dispatch } = props
    const codeTableNameArray = []
    codeTableNameArray.push('ctmedicationusage')
    codeTableNameArray.push('ctmedicationunitofmeasurement')
    codeTableNameArray.push('ctmedicationfrequency')
    codeTableNameArray.push('ctmedicationdosage')
    codeTableNameArray.push('ctvaccinationunitofmeasurement')
    codeTableNameArray.push('ctvaccinationusage')

    codeTableNameArray.forEach((o) => {
      dispatch({
        type: 'codetable/fetchCodes',
        payload: {
          code: o,
        },
      })
    })

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
      const { setValues, values, orderTypes } = this.props
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
                    temp
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
