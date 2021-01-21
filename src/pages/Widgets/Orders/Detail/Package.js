import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { IntegratedSummary } from '@devexpress/dx-react-grid'
import moment from 'moment'
import _ from 'lodash'
import {
  GridContainer,
  GridItem,
  CodeSelect,
  withFormikExtend,
  EditableTableGrid,
  Field,
  serverDateTimeFormatFull,
  notification,
  DatePicker,
} from '@/components'
import Yup from '@/utils/yup'
import { getUniqueId, getUniqueGUID, roundTo } from '@/utils/utils'
import { openCautionAlertPrompt } from '@/pages/Widgets/Orders/utils'
import { DURATION_UNIT } from '@/utils/constants'

@connect(({ global, codetable, user, visitRegistration }) => ({ 
  global, 
  codetable, 
  user,
  visitRegistration,
}))
@withFormikExtend({
  authority: [
    'queue.consultation.order.package',
  ],
  mapPropsToValues: ({ orders = {}, type }) => {
    const v = {
      ...(orders.entity || orders.defaultPackage),
      type,
    }
    return v
  },
  enableReinitialize: true,
  validationSchema: Yup.object().shape({
    packageFK: Yup.number().required(),
  }),
  handleSubmit: (values, { props, onConfirm, setValues }) => {
    const { dispatch, orders, codetable, getNextSequence, user, visitRegistration } = props
    const {
      inventorymedication = [],
      inventoryvaccination = [],
      inventoryconsumable = [],
      doctorprofile,
    } = codetable    

    const { doctorProfileFK } = visitRegistration.entity.visit
    const visitDoctorUserId = doctorprofile.find(d => d.id === doctorProfileFK).clinicianProfile.userProfileFK

    const packageGlobalId = getUniqueGUID()

    const getInstruction = (medication) => {
      let instruction = ''
      const usageMethod = medication.medicationUsage
      instruction += `${usageMethod ? usageMethod.name : ''} `
      const dosage = medication.prescribingDosage
      instruction += `${dosage ? dosage.name : ''} `
      const prescribe = medication.prescribingUOM
      instruction += `${prescribe ? prescribe.name : ''} `
      const drugFrequency = medication.medicationFrequency
      instruction += `${drugFrequency ? drugFrequency.name : ''}`
      const itemDuration = medication.duration
          ? ` For ${medication.duration} day(s)`
          : ''
          instruction += itemDuration
      return instruction
    }

    const getOrderMedicationFromPackage = (packageCode, packageName, packageItem) => {
      const medication = inventorymedication.find(
        (item) =>
          item.id === packageItem.inventoryMedicationFK,
      )

      let item
      if (medication.isActive === true) {
        const medicationdispensingUOM = medication.dispensingUOM
        const medicationusage = medication.medicationUsage
        const medicationfrequency = medication.medicationFrequency
        const medicationdosage = medication.prescribingDosage
        const medicationprescribingUOM = medication.prescribingUOM
        const medicationPrecautions =
        medication.inventoryMedication_MedicationPrecaution
        const isDefaultBatchNo = medication.medicationStock.find(
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
          isActive: medication.isActive,
          inventoryMedicationFK: medication.id,
          drugCode: medication.code,
          drugName: medication.displayValue,
          quantity: packageItem.quantity,
          costPrice: medication.averageCostPrice,
          unitPrice: packageItem.unitPrice,
          totalPrice: packageItem.subTotal,
          adjAmount: 0,
          adjType: 'ExactAmount',
          adjValue: 0,
          isClaimable: true,
          totalAfterItemAdjustment: packageItem.subTotal,
          totalAfterOverallAdjustment: packageItem.subTotal,          
          expiryDate: isDefaultBatchNo
            ? isDefaultBatchNo.expiryDate
            : undefined,
          batchNo: isDefaultBatchNo ? isDefaultBatchNo.batchNo : undefined,
          isExternalPrescription: false,
          instruction: getInstruction(medication),
          dispenseUOMFK: medication.dispensingUOM.id,
          dispenseUOMCode: medicationdispensingUOM
            ? medicationdispensingUOM.code
            : undefined,
          dispenseUOMDisplayValue: medicationdispensingUOM
            ? medicationdispensingUOM.name
            : undefined,
          corPrescriptionItemPrecaution: currentMedicationPrecautions,
          corPrescriptionItemInstruction: [
            {
              usageMethodFK: medication.medicationUsage.id,
              usageMethodCode: medicationusage
                ? medicationusage.code
                : undefined,
              usageMethodDisplayValue: medicationusage
                ? medicationusage.name
                : undefined,
              dosageFK: medication.prescribingDosage.id,
              dosageCode: medicationdosage ? medicationdosage.code : undefined,
              dosageDisplayValue: medicationdosage
                ? medicationdosage.name
                : undefined,
              prescribeUOMFK: medication.prescribingUOM.id,
              prescribeUOMCode: medicationprescribingUOM
                ? medicationprescribingUOM.code
                : undefined,
              prescribeUOMDisplayValue: medicationprescribingUOM
                ? medicationprescribingUOM.name
                : undefined,
              drugFrequencyFK: medication.medicationFrequency.id,
              drugFrequencyCode: medicationfrequency
                ? medicationfrequency.code
                : undefined,
              drugFrequencyDisplayValue: medicationfrequency
                ? medicationfrequency.name
                : undefined,
              duration: medication.duration,
              stepdose: 'AND',
              sequence: 0,
            },
          ],
          isPackage: true,
          packageCode,
          packageName,
          defaultConsumeQuantity: packageItem.defaultConsumeQuantity,
          packageConsumeQuantity: packageItem.consumeQuantity,
          remainingQuantity: packageItem.quantity,
          performingUserFK: visitDoctorUserId,
          packageGlobalId,
        }
      }
      return item
    }

    const getOrderVaccinationFromPackage = (packageCode, packageName, packageItem) => {
      const vaccination = inventoryvaccination.find(
        (item) =>
          item.id === packageItem.inventoryVaccinationFK,
      )

      let item
      if (vaccination.isActive === true) {
        const vaccinationUOM = vaccination.prescribingUOM
        const vaccinationusage = vaccination.vaccinationUsage
        const vaccinationdosage = vaccination.prescribingDosage
        const isDefaultBatchNo = vaccination.vaccinationStock.find(
          (o) => o.isDefault === true,
        )

        item = {
          isActive: vaccination.isActive,
          inventoryVaccinationFK: vaccination.id,
          vaccinationGivenDate: moment().format(serverDateTimeFormatFull),
          vaccinationCode: vaccination.code,
          vaccinationName: vaccination.displayValue,
          usageMethodFK: vaccination.vaccinationUsage.id,
          usageMethodCode: vaccinationusage ? vaccinationusage.code : undefined,
          usageMethodDisplayValue: vaccinationusage
            ? vaccinationusage.name
            : undefined,
          dosageFK: vaccination.prescribingDosage.id,
          dosageCode: vaccinationdosage ? vaccinationdosage.code : undefined,
          dosageDisplayValue: vaccinationdosage
            ? vaccinationdosage.name
            : undefined,
          uomfk: vaccination.prescribingUOM.id,
          uomCode: vaccinationUOM ? vaccinationUOM.code : undefined,
          uomDisplayValue: vaccinationUOM ? vaccinationUOM.name : undefined,
          quantity: packageItem.quantity,
          unitPrice: packageItem.unitPrice,
          totalPrice: packageItem.subTotal,
          adjAmount: 0,
          adjType: 'ExactAmount',
          adjValue: 0,
          totalAfterItemAdjustment: packageItem.subTotal,
          totalAfterOverallAdjustment: packageItem.subTotal,
          expiryDate: isDefaultBatchNo
            ? isDefaultBatchNo.expiryDate
            : undefined,
          batchNo: isDefaultBatchNo ? isDefaultBatchNo.batchNo : undefined,
          isPackage: true,
          packageCode,
          packageName,
          defaultConsumeQuantity: packageItem.defaultConsumeQuantity,
          packageConsumeQuantity: packageItem.consumeQuantity,
          remainingQuantity: packageItem.quantity,
          performingUserFK: visitDoctorUserId,
          packageGlobalId,
        }
      }

      let newCORVaccinationCert = []
      // if (item.isGenerateCertificate) {
      //   const { documenttemplate = [] } = codetable
      //   const defaultTemplate = documenttemplate.find(
      //     (dt) =>
      //       dt.isDefaultTemplate === true && dt.documentTemplateTypeFK === 3,
      //   )
      //   if (defaultTemplate) {
      //     newCORVaccinationCert = [
      //       {
      //         type: '3',
      //         certificateDate: moment(),
      //         issuedByUserFK: clinicianProfile.userProfileFK,
      //         subject: `Vaccination Certificate - ${name}, ${patientAccountNo}, ${gender.code ||
      //           ''}, ${Math.floor(
      //           moment.duration(moment().diff(dob)).asYears(),
      //         )}`,
      //         content: ReplaceCertificateTeplate(
      //           defaultTemplate.templateContent,
      //           item,
      //         ),
      //         sequence: nextDocumentSequence,
      //       },
      //     ]
      //     nextDocumentSequence += 1
      //   } else {
      //     showNoTemplate = true
      //   }
      // }
      return { ...item, corVaccinationCert: newCORVaccinationCert }
    }

    const getOrderServiceCenterServiceFromPackage = (
      packageCode,
      packageName,
      packageItem,
    ) => {
      let item
      item = {
        isActive: packageItem.isActive,
        serviceCenterServiceFK: packageItem.serviceCenterServiceFK,
        quantity: packageItem.quantity,
        unitPrice: packageItem.unitPrice,
        total: packageItem.subTotal,
        adjAmount: 0,
        adjType: 'ExactAmount',
        adjValue: 0,
        totalAfterItemAdjustment: packageItem.subTotal,
        totalAfterOverallAdjustment: packageItem.subTotal,
        serviceCode: packageItem.serviceCode,
        serviceName: packageItem.serviceName,
        serviceFK: packageItem.serviceFK,
        serviceCenterFK: packageItem.serviceCenterFK,
        isPackage: true,
        packageCode,
        packageName,
        defaultConsumeQuantity: packageItem.defaultConsumeQuantity,
        packageConsumeQuantity: packageItem.consumeQuantity,
        remainingQuantity: packageItem.quantity,
        performingUserFK: visitDoctorUserId,   
        packageGlobalId,   
      }
      return item
    }

    const getOrderConsumableFromPackage = (packageCode, packageName, packageItem) => {
      const consumable = inventoryconsumable.find(
        (item) =>
          item.id === packageItem.inventoryConsumableFK,
      )

      let item
      let isDefaultBatchNo
      if (consumable) {
        isDefaultBatchNo = consumable.consumableStock.find(
          (o) => o.isDefault === true,
        )
      }

      item = {
        inventoryConsumableFK: packageItem.inventoryConsumableFK,
        isActive: packageItem.isActive,
        quantity: packageItem.quantity,
        unitPrice: packageItem.unitPrice,
        totalPrice: packageItem.subTotal,
        adjAmount: 0,
        adjType: 'ExactAmount',
        adjValue: 0,
        totalAfterItemAdjustment: packageItem.subTotal,
        totalAfterOverallAdjustment: packageItem.subTotal,
        consumableCode: packageItem.consumableCode,
        consumableName: packageItem.consumableName,
        expiryDate: isDefaultBatchNo
          ? isDefaultBatchNo.expiryDate
          : undefined,
        batchNo: isDefaultBatchNo ? isDefaultBatchNo.batchNo : undefined,
        isPackage: true,
        packageCode,
        packageName,
        defaultConsumeQuantity: packageItem.defaultConsumeQuantity,
        packageConsumeQuantity: packageItem.consumeQuantity,
        remainingQuantity: packageItem.quantity,
        performingUserFK: visitDoctorUserId,
        packageGlobalId,
      }

      return item
    }

    const getOrderFromPackage = (packageCode, packageName, packageItem) => {
      let item
      if (packageItem.type === '1') {
        item = getOrderMedicationFromPackage(packageCode, packageName, packageItem)
      }
      if (packageItem.type === '2') {
        item = getOrderVaccinationFromPackage(packageCode, packageName, packageItem)
      }
      if (packageItem.type === '3') {
        item = getOrderServiceCenterServiceFromPackage(packageCode, packageName, packageItem)
      }
      if (packageItem.type === '4') {
        item = getOrderConsumableFromPackage(packageCode, packageName, packageItem)
      }
      return item
    }

    const { packageItems, selectedPackage, expiryDate } = values
    let datas = []
    let nextSequence = getNextSequence()
    for (let index = 0; index < packageItems.length; index++) {
      const newOrder = getOrderFromPackage(selectedPackage.code, selectedPackage.displayValue, packageItems[index])
      if (newOrder) {
        const data = {
          isOrderedByDoctor:
            user.data.clinicianProfile.userProfile.role.clinicRoleFK === 1,
          sequence: nextSequence,
          ...newOrder,
          subject: packageItems[index].name,
          isDeleted: false,
          type: packageItems[index].type,
        }
        datas.push(data)
        nextSequence += 1
      }
    }
    
    dispatch({
      type: 'orders/upsertRows',
      payload: datas,
    })

    if (datas.length > 0) {
      dispatch({
        type: 'orders/addPackage',
        payload: {
          packageFK: selectedPackage.id,
          packageCode: selectedPackage.code,
          packageName: selectedPackage.displayValue,
          expiryDate,
          totalPrice: _.sumBy(datas, 'totalAfterItemAdjustment') || 0,
          packageGlobalId,
        },
      })
    }

    if (onConfirm) onConfirm()
    setValues({
      ...orders.defaultPackage,
      type: orders.type,
    })
  },
  displayName: 'PackagePage',
})
class Package extends PureComponent {
  constructor (props) {
    super(props)

    const calUnitPrice = (e) => {
      const { row } = e
      const { subTotal, quantity } = row
      row.unitPrice = 0
      if (subTotal && quantity && quantity !== 0) {
        row.unitPrice = roundTo(subTotal / quantity)
      }
    }

    this.packageItemSchema = Yup.object().shape({
      quantity: Yup.number().required().min(1),
      consumeQuantity: Yup.number().required()
        .min(0, 'Consumed quantity must be greater than or equal to 0')
        .max(Yup.ref('quantity'), 'Consumed quantity cannot exceed Quantity'),
      subTotal: Yup.number().required().min(0),
    })

    this.tableProps = {
      getRowId: (r) => r.uid,
      columns: [
        { name: 'typeName', title: 'Type' },
        { name: 'name', title: 'Name' },
        { name: 'consumeQuantity', title: 'Consumed' },
        { name: 'quantity', title: 'Quantity' },
        { name: 'subTotal', title: 'Total' },
      ],
      columnExtensions: [
        {
          columnName: 'typeName',
          width: 180,
          type: 'text',
          sortingEnabled: false,
          disabled: true,
        },
        {
          columnName: 'name',
          type: 'text',
          sortingEnabled: false,
          disabled: true,
        },
        {
          columnName: 'consumeQuantity',
          width: 90,
          type: 'number',
          format: '0.0',
          sortingEnabled: false,
          isDisabled: (row) => row.isActive !== true,
        },
        {
          columnName: 'quantity',
          width: 90,
          type: 'number',
          format: '0.0',
          sortingEnabled: false,
          isDisabled: (row) => row.isActive !== true,
          onChange: calUnitPrice,
        },
        {
          columnName: 'subTotal',
          width: 130,
          type: 'number',
          currency: true,
          sortingEnabled: false,
          isDisabled: (row) => row.isActive !== true,
          onChange: calUnitPrice,
        },
      ],
    }

    const calculateExpiryDate = (duration, durationUnit) => {
      const today = new Date()
      let untilDate
      if (duration) {
        switch (durationUnit) {
          case DURATION_UNIT.DAY:
            untilDate = moment(today).add(duration, 'days').toDate()
            break
          case DURATION_UNIT.WEEK:
            untilDate = moment(today).add(duration, 'weeks').toDate()
            break
          case DURATION_UNIT.MONTH:
            untilDate = moment(today).add(duration, 'months').toDate()
            break
          case DURATION_UNIT.YEAR:
            untilDate = moment(today).add(duration, 'years').toDate()
            break
          default:
            break
        }

        untilDate = new Date(
          Date.UTC(untilDate.getUTCFullYear(), untilDate.getUTCMonth(), untilDate.getUTCDate())
        )
      }

      return untilDate
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
                (o.isActive === true ? '' : ' (Inactive)'),
              isActive: o.isActive === true,
              caution: o.caution,
              subject: o.medicationName,
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
                (o.isActive === true ? '' : ' (Inactive)'),
              isActive: o.isActive === true,
              caution: o.caution,
              subject: o.vaccinationName,
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
                (o.isActive ? '' : ' (Inactive)'),
              isActive: o.isActive === true,
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
                (o.isActive === true ? '' : ' (Inactive)'),
              isActive: o.isActive === true,
            }
          }),
        )
      }

      const untilDate = calculateExpiryDate(op.validDuration, op.durationUnitFK)   
      setValues({
        ...values,
        packageItems: rows,
        selectedPackage: op,
        expiryDate: untilDate,
      })

      const hasCautionItems = rows.filter(
        (f) => f.caution && f.caution.trim().length > 0,
      )
      if (hasCautionItems.length > 0) {
        openCautionAlertPrompt(hasCautionItems, () => {})
      }
    }

    this.handleReset = () => {
      const { setValues, orders } = this.props
      setValues({
        ...orders.defaultPackage,
        type: orders.type,
      })
    }
  }

  validateAndSubmitIfOk = async () => {
    const {
      handleSubmit,
      validateForm,
      values: { packageItems = [] },
    } = this.props
    const validateResult = await validateForm()
    const isFormValid = _.isEmpty(validateResult)
    if (isFormValid) {
      const inactivePackageItems = packageItems.filter(
        (f) => f.isActive !== true,
      )
      if(inactivePackageItems.length > 0) {
        notification.error({
          message: 'One or more items in the package are inactive.',
        })
        return false
      }

      handleSubmit()
      return true      
    }
    return false
  }

  render () {
    const { theme, values, footer, handleSubmit } = this.props
    return (
      <div>
        <GridContainer>
          <GridItem xs={6}>
            <Field
              name='packageFK'
              render={(args) => {
                return (
                  <div id={`autofocus_${values.type}`}>
                    <CodeSelect
                      temp
                      label='Package Name'
                      code='package'
                      labelField='displayValue'
                      onChange={this.changePackage}
                      {...args}
                    />
                  </div>
                )
              }}
            />
          </GridItem>
          <GridItem xs={2}>
            <Field
              name='expiryDate'
              render={(args) => {
                  return (
                    <DatePicker
                      label='Expiry Date'
                      {...args}
                    />
                  )
                }}
            />
          </GridItem>
          <GridItem xs={12}>
            <EditableTableGrid
              rows={values.packageItems}
              style={{
                margin: `${theme.spacing(1)}px 0`,
              }}
              {...this.tableProps}
              schema={this.packageItemSchema}
              EditingProps={{
                showCommandColumn: false,
              }}
              FuncProps={{
                pager: false,
                summary: true,
                summaryConfig: {
                  state: {
                    totalItems: [
                      { columnName: 'subTotal', type: 'sum' },
                    ],
                  },
                  integrated: {
                    calculator: IntegratedSummary.defaultCalculator,
                  },
                  row: {
                    messages: {
                      sum: 'Total',
                    },
                  },
                },
              }}
            />
          </GridItem>
        </GridContainer>
        {footer({
          onSave: this.validateAndSubmitIfOk,
          onReset: this.handleReset,
          showAdjustment: false,
        })}
      </div>
    )
  }
}
export default Package