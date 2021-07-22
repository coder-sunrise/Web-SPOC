import React, { PureComponent } from 'react'
import _ from 'lodash'
import { connect } from 'dva'
import * as Yup from 'yup'
import moment from 'moment'
// medisys components
import { LoadingWrapper } from '@/components/_medisys'
// custom component
import { notification } from '@/components'
import { withFormik } from 'formik'
// sub components
import {
  openCautionAlertPrompt,
  ReplaceCertificateTeplate,
} from '@/pages/Widgets/Orders/utils'
import FitlerBar from './FilterBar'
import Grid from './Grid'
import { getClinicianProfile } from '../../../ConsultationDocument/utils'

@connect(
  ({
    loading,
    codetable,
    visitRegistration,
    clinicSettings,
    patient,
    user
  }) => ({
    loading,
    codetable,
    visitRegistration,
    clinicSettings: clinicSettings.settings || clinicSettings.default,
    patient,
    user
  }),
)
@withFormik({
  displayName: 'PrescriptionSetList',
  validationSchema: Yup.object().shape({}),
  mapPropsToValues: () => ({}),
  handleSubmit: () => ({}),
})
class PrescriptionSetList extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      addedItems: [],
      searchName: '',
      pageIndex: 0,
      loadPrescriptionSets: [],
      totalPrescriptionSets: 0,
      activeKey: [],
    }
  }

  componentWillMount () {
    this.searchPrescriptionSet()
  }

  setAddedItems = (v) => {
    this.setState({
      addedItems: v,
    })
  }

  getInstruction = (instructions) => {
    let instruction = ''
    let nextStepdose = ''
    const activeInstructions = instructions
      ? instructions.filter((item) => !item.isDeleted)
      : undefined
    if (activeInstructions) {
      for (let index = 0; index < activeInstructions.length; index++) {
        let item = activeInstructions[index]
        if (instruction !== '') {
          instruction += ' '
        }

        if (index < activeInstructions.length - 1) {
          nextStepdose = ` ${activeInstructions[index + 1].stepdose}`
        } else {
          nextStepdose = ''
        }

        const itemDuration = item.duration ? ` For ${item.duration} day(s)` : ''

        instruction += `${item.usageMethodDisplayValue
          ? item.usageMethodDisplayValue
          : ''} ${item.dosageDisplayValue
            ? item.dosageDisplayValue
            : ''} ${item.prescribeUOMDisplayValue
              ? item.prescribeUOMDisplayValue
              : ''} ${item.drugFrequencyDisplayValue
                ? item.drugFrequencyDisplayValue
                : ''}${itemDuration}${nextStepdose}`
      }
    }
    return instruction
  }

  getVisitDoctorUserId = props => {
    const { doctorprofile } = props.codetable
    const { doctorProfileFK } = props.visitRegistration.entity.visit
    let visitDoctorUserId
    if (doctorprofile && doctorProfileFK) {
      visitDoctorUserId = doctorprofile.find(d => d.id === doctorProfileFK).clinicianProfile.userProfileFK
    }

    return visitDoctorUserId
  }

  GetNewMedication = () => {
    const { getNextSequence, codetable, type } = this.props
    const {
      inventorymedication,
      ctmedicationusage,
      ctmedicationdosage,
      ctmedicationunitofmeasurement,
      ctmedicationfrequency,
    } = codetable

    const medications = this.state.addedItems
    let data = []
    let sequence = getNextSequence()
    data = data.concat(
      medications.map((item) => {
        let currentSequence = sequence
        sequence += 1

        let itemInstructions =
          item.corPrescriptionItemInstruction ||
          item.retailPrescriptionItemInstruction
        itemInstructions = itemInstructions.map((instruction) => {
          let usage = ctmedicationusage.find(
            (drugusage) => drugusage.id === instruction.usageMethodFK,
          )
          let dosage = ctmedicationdosage.find(
            (drugdosage) => drugdosage.id === instruction.dosageFK,
          )
          let uom = ctmedicationunitofmeasurement.find(
            (druguom) => druguom.id === instruction.prescribeUOMFK,
          )
          let frequency = ctmedicationfrequency.find(
            (drugfrequency) => drugfrequency.id === instruction.drugFrequencyFK,
          )
          return {
            usageMethodFK: usage ? usage.id : undefined,
            usageMethodCode: usage ? usage.code : undefined,
            usageMethodDisplayValue: usage ? usage.name : undefined,
            dosageFK: dosage ? dosage.id : undefined,
            dosageCode: dosage ? dosage.code : undefined,
            dosageDisplayValue: dosage ? dosage.displayValue : undefined,
            prescribeUOMFK: uom ? uom.id : undefined,
            prescribeUOMCode: uom ? uom.code : undefined,
            prescribeUOMDisplayValue: uom ? uom.name : undefined,
            drugFrequencyFK: frequency ? frequency.id : undefined,
            drugFrequencyCode: frequency ? frequency.code : undefined,
            drugFrequencyDisplayValue: frequency
              ? frequency.displayValue
              : undefined,
            duration: instruction.duration,
            sequence: instruction.sequence,
            stepdose: instruction.stepdose,
            isDeleted: false,
          }
        })

        let instruction = this.getInstruction(itemInstructions)

        let itemExpiryDate
        let itemBatchNo
        let itemCostPrice
        let itemUnitPrice
        let itemDispenseUOMCode
        let itemDispenseUOMDisplayValue
        let itemDispenseUOMFK
        let itemDrugCode
        let itemDrugName
        let itemTotalPrice
        let newTotalQuantity
        let ItemPrecautions = []
        let itemCorPrescriptionItemDrugMixture = []
        let itemDrugCaution
        if (item.inventoryMedicationFK) {
          // Normal Drug
          let drug = inventorymedication.find(
            (medication) => medication.id === item.inventoryMedicationFK,
          )
          let defaultBatch = drug.medicationStock.find(
            (o) => o.isDefault === true,
          )

          let precautionIndex = 0
          if (
            drug.inventoryMedication_MedicationPrecaution &&
            drug.inventoryMedication_MedicationPrecaution.length > 0
          ) {
            ItemPrecautions = ItemPrecautions.concat(
              drug.inventoryMedication_MedicationPrecaution.map((o) => {
                let currentPrecautionSequence = precautionIndex
                precautionIndex += 1
                return {
                  medicationPrecautionFK: o.medicationPrecautionFK,
                  precaution: o.medicationPrecaution.name,
                  precautionCode: o.medicationPrecaution.code,
                  sequence: currentPrecautionSequence,
                  isDeleted: false,
                }
              }),
            )
          } else {
            ItemPrecautions = [
              {
                precaution: '',
                sequence: 0,
              },
            ]
          }

          newTotalQuantity = item.quantity

          itemTotalPrice = item.isExternalPrescription
            ? 0
            : newTotalQuantity * drug.sellingPrice

          itemExpiryDate =
            !item.isExternalPrescription && defaultBatch
              ? defaultBatch.expiryDate
              : undefined
          itemBatchNo =
            !item.isExternalPrescription && defaultBatch
              ? defaultBatch.batchNo
              : undefined

          itemCostPrice = drug.averageCostPrice
          itemUnitPrice = drug.sellingPrice

          itemDispenseUOMCode = drug.dispensingUOM
            ? drug.dispensingUOM.code
            : undefined

          itemDispenseUOMDisplayValue = drug.dispensingUOM
            ? drug.dispensingUOM.name
            : undefined

          itemDispenseUOMFK = drug.dispensingUOM
            ? drug.dispensingUOM.id
            : undefined
          itemDrugCode = drug.code
          itemDrugName = drug.displayValue
          itemDrugCaution = drug.caution
        } else if (item.isDrugMixture) {
          // Drug Mixture
          itemExpiryDate = item.expiryDate
          itemBatchNo = item.batchNo
          itemCostPrice = item.costPrice || 0
          itemUnitPrice = item.unitPrice || 0
          itemDispenseUOMCode = item.dispenseUOMCode
          itemDispenseUOMDisplayValue = item.dispenseUOMDisplayValue
          itemDispenseUOMFK = item.dispenseUOMFK
          itemDrugCode = item.drugCode
          itemDrugName = item.drugName
          itemTotalPrice = item.totalPrice
          newTotalQuantity = item.quantity

          let precautionIndex = 0
          const precautions =
            item.corPrescriptionItemPrecaution ||
            item.retailPrescriptionItemPrecaution
          if (precautions && precautions.length > 0) {
            ItemPrecautions = ItemPrecautions.concat(
              precautions.map((o) => {
                let currentPrecautionSequence = precautionIndex
                precautionIndex += 1
                return {
                  medicationPrecautionFK: o.medicationPrecautionFK,
                  precaution: o.precaution,
                  precautionCode: o.precautionCode,
                  sequence: currentPrecautionSequence,
                  isDeleted: false,
                }
              }),
            )
          } else {
            ItemPrecautions = [
              {
                precaution: '',
                sequence: 0,
              },
            ]
          }

          let drugMixtureIndex = 0
          const drugMixtures =
            item.corPrescriptionItemDrugMixture ||
            item.retailPrescriptionItemDrugMixture
          if (drugMixtures && drugMixtures.length > 0) {
            itemCorPrescriptionItemDrugMixture = itemCorPrescriptionItemDrugMixture.concat(
              drugMixtures.map((o) => {
                let drug = inventorymedication.find(
                  (medication) => medication.id === o.inventoryMedicationFK,
                )
                let currentDrugMixtureSequence = drugMixtureIndex
                drugMixtureIndex += 1
                return {
                  inventoryMedicationFK: o.inventoryMedicationFK,
                  drugCode: o.drugCode,
                  drugName: o.drugName,
                  quantity: o.quantity,
                  costPrice: o.costPrice,
                  unitPrice: o.unitPrice,
                  totalPrice: o.totalPrice,
                  uomfk: o.uomfk,
                  uomCode: o.uomCode,
                  uomDisplayValue: o.uomDisplayValue,
                  batchNo: o.batchNo,
                  expiryDate: o.expiryDate,
                  revenueCategoryFK: o.revenueCategoryFK,
                  sequence: currentDrugMixtureSequence,
                  isDeleted: false,
                  isNew: true,
                  subject: o.drugName,
                  caution: drug.caution,
                }
              }),
            )
          }
        }

        return {
          type,
          adjAmount: 0,
          adjType: 'ExactAmount',
          adjValue: 0,
          expiryDate: itemExpiryDate,
          batchNo: itemBatchNo,
          corPrescriptionItemInstruction: itemInstructions,
          corPrescriptionItemPrecaution: ItemPrecautions,
          corPrescriptionItemDrugMixture: itemCorPrescriptionItemDrugMixture,
          costPrice: itemCostPrice,
          unitPrice: itemUnitPrice,
          dispenseUOMCode: itemDispenseUOMCode,
          dispenseUOMDisplayValue: itemDispenseUOMDisplayValue,
          dispenseUOMFK: itemDispenseUOMFK,
          drugCode: itemDrugCode,
          drugName: itemDrugName,
          instruction,
          inventoryMedicationFK: item.inventoryMedicationFK,
          isActive: true,
          isDeleted: false,
          quantity: newTotalQuantity,
          remarks: item.remarks,
          sequence: currentSequence,
          subject: item.drugName,
          totalPrice: itemTotalPrice,
          totalAfterItemAdjustment: itemTotalPrice,
          isExternalPrescription: item.isExternalPrescription,
          visitPurposeFK: undefined,
          isDrugMixture: item.isDrugMixture,
          isClaimable: item.isClaimable,
          caution: itemDrugCaution,
          performingUserFK: this.getVisitDoctorUserId(this.props),
          packageGlobalId: '',
        }
      }),
    )
    return data
  }

  onSelectItems = (items) => {
    let addedItems = this.state.addedItems.map((o) => {
      return {
        ...o,
      }
    })

    if (items instanceof Array) {
      items.forEach((item) => {
        if (!addedItems.find((o) => o.id === item.id)) {
          addedItems.push(item)
        }
      })
    } else {
      let exxistsItem = addedItems.find((o) => o.id === items.id)
      if (exxistsItem) {
        addedItems = addedItems.filter((o) => o.id !== items.id)
      } else {
        addedItems.push(items)
      }
    }
    this.setAddedItems(addedItems)
  }

  handleSubmit = () => {
    const { dispatch, onConfirm, type } = this.props
    let data = []
    const cautionItems = []

    data = this.GetNewMedication()
    data.map((m) => {
      if (m.isDrugMixture) {
        const mixtureItems = m.corPrescriptionItemDrugMixture || []
        mixtureItems
          .filter((i) => i.caution && i.caution.trim().length > 0)
          .map((mixture) => {
            if (
              !cautionItems.find(
                (f) => f.id === mixture.inventoryMedicationFK,
              )
            ) {
              cautionItems.push({
                subject: mixture.subject,
                caution: mixture.caution,
                id: mixture.inventoryMedicationFK,
              })
            }
          })
      } else if (
        m.caution &&
        m.caution.trim().length > 0 &&
        !cautionItems.find((f) => f.id === m.inventoryMedicationFK)
      ) {
        cautionItems.push({
          subject: m.subject,
          caution: m.caution,
          id: m.inventoryMedicationFK,
        })
      }
    })

    const updateRows = () => {
      dispatch({
        type: 'orders/upsertRows',
        payload: data,
      }).then(() => {
        if (onConfirm) onConfirm()
      })
    }

    if (cautionItems.length > 0) {
      openCautionAlertPrompt(cautionItems, updateRows)
    } else {
      updateRows()
    }
  }

  handelSearch = () => {
    const { values } = this.props
    const { searchName } = values
    this.setState(
      {
        searchName,
        pageIndex: 0,
        loadPrescriptionSets: [],
        addedItems: [],
        totalPrescriptionSets: 0,
        activeKey: [],
      },
      this.searchPrescriptionSet,
    )
  }

  handelLoadMore = () => {
    this.searchPrescriptionSet()
  }

  searchPrescriptionSet = () => {
    const {
      searchName,
      pageIndex,
    } = this.state
    const { dispatch, clinicSettings, user } = this.props
    const { viewVisitPageSize = 10 } = clinicSettings
    dispatch({
      type: 'prescriptionSet/query',
      payload: {
        prescriptionSetName: searchName,
        current: pageIndex + 1,
        pageSize: viewVisitPageSize,
        group: [
          {
            ownedByUserFK: user.data.id,
            isShared: true,
            combineCondition: 'or',
          },
        ],
      },
    }).then((r) => {
      if (r) {
        console.log('111111', r)
        this.setState((preState) => {
          return {
            ...preState,
            loadPrescriptionSets: [
              ...preState.loadPrescriptionSets,
              ...(r.data || []),
            ],
            totalPrescriptionSets: r.totalRecords,
            pageIndex: preState.pageIndex + 1,
            activeKey: [
              ...preState.activeKey,
              ...(r.data || []).map((o) => o.id),
            ],
          }
        })
      }
    })
  }

  clickCollapseHeader = (prescriptionSetID) => {
    this.setState((preState) => {
      if (preState.activeKey.find((key) => key === prescriptionSetID)) {
        return {
          ...preState,
          activeKey: preState.activeKey.filter((key) => key !== prescriptionSetID),
        }
      }
      return {
        ...preState,
        activeKey: [
          ...preState.activeKey,
          prescriptionSetID,
        ],
      }
    })
  }

  render () {
    const { loading, type, footer, clinicSettings } = this.props
    const { viewVisitPageSize = 10 } = clinicSettings
    const { pageIndex, loadPrescriptionSets, totalPrescriptionSets, activeKey } = this.state
    const moreData = totalPrescriptionSets > pageIndex * viewVisitPageSize
    const show = loading.effects['medicationHistory/queryMedicationHistory']
    return (
      <LoadingWrapper
        loading={show}
        text='Retrieving prescription set list...'
      >
        <div>
          <FitlerBar
            handelSearch={this.handelSearch}
            {...this.props}
          />
          <Grid
            onSelectMedication={this.onSelectMedication}
            onSelectItems={this.onSelectItems}
            addedItems={this.state.addedItems}
            moreData={moreData}
            handelLoadMore={this.handelLoadMore}
            loadPrescriptionSets={loadPrescriptionSets}
            activeKey={activeKey}
            clickCollapseHeader={this.clickCollapseHeader}
            {...this.props}
          />
        </div>
        {footer &&
          footer({
            onConfirm: this.handleSubmit,
            confirmBtnText: 'Confirm',
            confirmProps: {
              disabled: this.state.addedItems.length <= 0,
            },
          })}
      </LoadingWrapper>
    )
  }
}

export default PrescriptionSetList
