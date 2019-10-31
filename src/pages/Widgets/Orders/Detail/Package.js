import React, { Component, PureComponent } from 'react'
import { connect } from 'dva'
import {
	GridContainer,
	GridItem,
	Select,
	CodeSelect,
	RadioGroup,
	confirm,
	FastField,
	withFormikExtend,
	CommonTableGrid,
	serverDateTimeFormatFull,
	Field
} from '@/components'
import Yup from '@/utils/yup'
import { getUniqueId } from '@/utils/utils'
import { orderTypes } from '@/utils/codes'
import moment from 'moment'

@connect(({ global, codetable }) => ({ global }))
@withFormikExtend({
	mapPropsToValues: ({ orders = {}, type }) => {
		const v = {
			...orders.defaultPackage,
			type
		}
		return v
	},
	enableReinitialize: true,
	validationSchema: Yup.object().shape({
		inventorypackageFK: Yup.number().required()
	}),
	handleSubmit: (values, { props, resetForm }) => {
		const { dispatch, orders } = props
		const { rows } = orders
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
		const getOrderMedicationFromPackage = (packageCode, packageItem) => {
			const { inventoryMedication } = packageItem
			const medicationPrecautions = inventoryMedication.inventoryMedication_MedicationPrecaution
			let item = undefined
			if (inventoryMedication.isActive === true) {
				let currentMedicationPrecautions = []
				currentMedicationPrecautions = currentMedicationPrecautions.concat(
					medicationPrecautions.map((o) => {
						return {
							precautionCode: o.medicationPrecaution.code,
							Precaution: o.medicationPrecaution.Name,
							sequence: o.sequence,
							medicationPrecautionFK: o.medicationPrecautionFK
						}
					})
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
					totalAfterItemAdjustment: packageItem.unitPrice * packageItem.quantity,
					totalAfterOverallAdjustment: packageItem.unitPrice * packageItem.quantity,
					packageCode: packageCode,
					expiryDate: undefined,
					batchNo: undefined,
					isExternalPrescription: false,
					//instruction:,
					dispenseUOMFK: inventoryMedication.dispensingUOMFK,
					dispenseUOMCode: undefined,
					dispenseUOMDisplayValue: undefined,
					cORPrescriptionItemPrecaution: currentMedicationPrecautions,
					cORPrescriptionItemInstruction: [
						{
							usageMethodFK: inventoryMedication.medicationUsageFK,
							dosageFK: inventoryMedication.prescribingDosageFK,
							prescribeUOMFK: inventoryMedication.prescribingUOMFK,
							drugFrequencyFK: packageItem.medicationFrequency
								? packageItem.medicationFrequency.id
								: undefined
							//duration:,
						}
					]
				}
			}
			return item
		}

		const getOrderVaccinationFromPackage = (packageCode, packageItem) => {
			const { inventoryVaccination } = packageItem
			let item = undefined
			if (inventoryVaccination.isActive === true) {
				item = {
					inventoryVaccinationFK: inventoryVaccination.id,
					vaccinationGivenDate: moment().format(serverDateTimeFormatFull),
					vaccinationCode: inventoryVaccination.code,
					vaccinationName: inventoryVaccination.displayValue,
					//vaccinationSequenceDisplayValue:
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
					totalAfterItemAdjustment: packageItem.unitPrice * packageItem.quantity,
					totalAfterOverallAdjustment: packageItem.unitPrice * packageItem.quantity,
					packageCode: packageCode,
					expiryDate: undefined,
					batchNo: undefined
				}
			}
			return item
		}

		const getOrderServiceCenterServiceFromPackage = (packageCode, packageItem) => {
			const { service } = packageItem
			const serviceCenterService = service.ctServiceCenter_ServiceNavigation[0]
			const serviceCenter = serviceCenterService.serviceCenterFKNavigation
			let item = undefined
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
					totalAfterItemAdjustment: packageItem.unitPrice * packageItem.quantity,
					totalAfterOverallAdjustment: packageItem.unitPrice * packageItem.quantity,
					packageCode: packageCode,
					//priority:,
					serviceName: service.displayValue,
					serviceFK: service.id,
					serviceCenterFK: serviceCenterService.serviceCenterFK
				}
			}
			return item
		}

		const getOrderConsumableFromPackage = (packageCode, packageItem) => {
			const { inventoryConsumable } = packageItem
			let item = undefined
			if (inventoryConsumable.isActive === true) {
				item = {
					inventoryConsumableFK: inventoryConsumable.id,
					//unitOfMeasurement:,
					quantity: packageItem.quantity,
					unitPrice: packageItem.unitPrice,
					totalPrice: packageItem.unitPrice * packageItem.quantity,
					adjAmount: 0,
					totalAfterItemAdjustment: packageItem.unitPrice * packageItem.quantity,
					totalAfterOverallAdjustment: packageItem.unitPrice * packageItem.quantity,
					packageCode: packageCode,
					consumableName: inventoryConsumable.displayValue
				}
			}

			return item
		}

		let length = rows.length
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
					type: packageItems[index].type
				}
				datas.push(data)
				length++
			}
		}
		dispatch({
			type: 'orders/upsertRows',
			payload: datas
		}).then((response) => {
			resetForm()
		})
	},
	displayName: 'OrderPage'
})
class Package extends PureComponent {
	constructor(props) {
		super(props)
		this.tableProps = {
			getRowId: (r) => r.uid,
			columns: [
				{ name: 'typeName', title: 'Type' },
				{ name: 'name', title: 'Name' },
				{ name: 'quantity', title: 'Quantity' },
				{ name: 'subTotal', title: 'Total' }
			],
			columnExtensions: [
				{
					columnName: 'quantity',
					type: 'number'
				},
				{
					columnName: 'subTotal',
					type: 'currency'
				}
			]
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
							typeName: orderTypes.find((type) => type.value === '1').name
						}
					})
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
							typeName: orderTypes.find((type) => type.value === '2').name
						}
					})
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
							typeName: orderTypes.find((type) => type.value === '3').name
						}
					})
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
							typeName: orderTypes.find((type) => type.value === '4').name
						}
					})
				)
			}
			setValues({
				...values,
				packageItems: rows,
				packageCode: op ? op.code : ''
			})
		}
	}

	render() {
		const { theme, values, footer, handleSubmit } = this.props
		return (
			<div>
				<GridContainer>
					<GridItem xs={12}>
						<Field
							name="inventorypackageFK"
							render={(args) => {
								return (
									<CodeSelect
										label="Package Name"
										code="inventorypackage"
										labelField="displayValue"
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
								margin: `${theme.spacing(1)}px 0`
							}}
							{...this.tableProps}
						/>
					</GridItem>
				</GridContainer>
				{footer({
					onSave: handleSubmit,
					showAdjustment: false
				})}
			</div>
		)
	}
}
export default Package
