import React, { Component, PureComponent } from 'react'
import { connect } from 'dva'
import {
	GridContainer,
	GridItem,
	TextField,
	Select,
	CodeSelect,
	DatePicker,
	RichEditor,
	NumberInput,
	FastField,
	withFormikExtend
} from '@/components'
import Yup from '@/utils/yup'
import { calculateAdjustAmount } from '@/utils/utils'

@connect(({ global }) => ({ global }))
@withFormikExtend({
	mapPropsToValues: ({ orders = {}, type }) => {
		const v = {
			...(orders.entity || orders.defaultVaccination),
			type
		}
		return v
	},
	enableReinitialize: true,
	validationSchema: Yup.object().shape({
		inventoryVaccinationFK: Yup.number().required(),
		//unitPrice: Yup.number().required(),
		totalPrice: Yup.number().required(),
		vaccinationGivenDate: Yup.date().required(),
		quantity: Yup.number().required(),
		usageMethodFK: Yup.number().required(),
		dosageFK: Yup.number().required(),
		uomfk: Yup.number().required()
	}),

	handleSubmit: (values, { props, resetForm }) => {
		const { dispatch, orders, currentType } = props
		const { rows } = orders
		const data = {
			sequence: rows.length,
			...values,
			subject: currentType.getSubject(values),
			isDeleted: false
		}
		dispatch({
			type: 'orders/upsertRow',
			payload: data
		}).then((response) => {
			resetForm()
		})
	},
	displayName: 'OrderPage'
})
class Vaccination extends PureComponent {
	UNSAFE_componentWillReceiveProps(nextProps) {
		if (
			(!this.props.global.openAdjustment && nextProps.global.openAdjustment) ||
			nextProps.orders.shouldPushToState
		) {
			nextProps.dispatch({
				type: 'orders/updateState',
				payload: {
					entity: nextProps.values,
					shouldPushToState: false
				}
			})
		}
	}

	changeVaccination = (v, op = {}) => {
		const { setFieldValue, values } = this.props

		setFieldValue('dosageFK', op.prescribingDosage ? op.prescribingDosage.id : undefined)
		setFieldValue('uomfk', op.prescribingUOM ? op.prescribingUOM.id : undefined)
		setFieldValue('usageMethodFK', op.vaccinationUsage ? op.vaccinationUsage.id : undefined)
		setFieldValue('vaccinationName', op.displayValue)
		setFieldValue('vaccinationCode', op.code)

		if (op.sellingPrice !== undefined && op.sellingPrice !== null) {
			setFieldValue('unitPrice', op.sellingPrice)
			setFieldValue('totalPrice', op.sellingPrice * values.quantity)
			this.updateTotalPrice(op.sellingPrice * values.quantity)
		} else {
			setFieldValue('unitPrice', undefined)
			setFieldValue('totalPrice', undefined)
			this.updateTotalPrice(undefined)
		}
	}

	updateTotalPrice = (v) => {
		if (v !== undefined) {
			const { adjType, adjValue } = this.props.values
			const adjustment = calculateAdjustAmount(adjType === 'ExactAmount', v, adjValue)
			this.props.setFieldValue('totalAfterItemAdjustment', adjustment.amount)
			this.props.setFieldValue('adjAmount', adjustment.adjAmount)
		} else {
			this.props.setFieldValue('totalAfterItemAdjustment', undefined)
			this.props.setFieldValue('adjAmount', undefined)
		}
	}

	render() {
		const { theme, classes, values, footer, handleSubmit, setFieldValue } = this.props
		return (
			<div>
				<GridContainer>
					<GridItem xs={12}>
						<FastField
							name="inventoryVaccinationFK"
							render={(args) => {
								return (
									<CodeSelect
										label="Name"
										labelField="displayValue"
										code="inventoryvaccination"
										onChange={this.changeVaccination}
										{...args}
									/>
								)
							}}
						/>
					</GridItem>
				</GridContainer>
				<GridContainer>
					<GridItem xs={6}>
						<FastField
							name="vaccinationGivenDate"
							render={(args) => {
								return <DatePicker label="Date Given" {...args} />
							}}
						/>
					</GridItem>
				</GridContainer>
				<GridContainer>
					<GridItem xs={4}>
						<FastField
							name="usageMethodFK"
							render={(args) => {
								return (
									<CodeSelect label="Usage" allowClear={false} code="ctVaccinationUsage" {...args} />
								)
							}}
						/>
					</GridItem>
					<GridItem xs={4}>
						<FastField
							name="dosageFK"
							render={(args) => {
								return (
									<CodeSelect
										label="Dosage"
										labelField="displayValue"
										allowClear={false}
										code="ctMedicationDosage"
										labelField="displayValue"
										valueFiled="id"
										{...args}
									/>
								)
							}}
						/>
					</GridItem>
					<GridItem xs={4}>
						<FastField
							name="uomfk"
							render={(args) => {
								return (
									<CodeSelect
										label="UOM"
										allowClear={false}
										code="ctVaccinationUnitOfMeasurement"
										{...args}
									/>
								)
							}}
						/>
					</GridItem>
					<GridItem xs={4}>
						<FastField
							name="quantity"
							render={(args) => {
								return (
									<NumberInput
										label="Quantity"
										formatter={(v) => `${v} Tab/s`}
										step={1}
										min={1}
										onChange={(e) => {
											if (values.unitPrice) {
												const total = e.target.value * values.unitPrice
												setFieldValue('totalPrice', total)
												this.updateTotalPrice(total)
											}
										}}
										{...args}
									/>
								)
							}}
						/>
					</GridItem>
					<GridItem xs={4}>
						<FastField
							name="totalPrice"
							render={(args) => {
								return (
									<NumberInput
										label="Total"
										currency
										onChange={(e) => {
											this.updateTotalPrice(e.target.value)
										}}
										{...args}
									/>
								)
							}}
						/>
					</GridItem>
					<GridItem xs={4}>
						<FastField
							name="totalAfterItemAdjustment"
							render={(args) => {
								return <NumberInput label="Total After Adj" currency disabled {...args} />
							}}
						/>
					</GridItem>
				</GridContainer>
				<GridContainer>
					<GridItem xs={12}>
						<FastField
							name="remarks"
							render={(args) => {
								// return <RichEditor placeholder='Remarks' {...args} />
								return <TextField multiline rowsMax="5" label="Remarks" {...args} />
							}}
						/>
					</GridItem>
				</GridContainer>
				{footer({
					onSave: handleSubmit
				})}
			</div>
		)
	}
}
export default Vaccination
