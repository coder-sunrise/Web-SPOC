import React, { PureComponent } from 'react'
import { FormattedMessage } from 'umi/locale'
import { status } from '@/utils/codes'
import {
	withFormikExtend,
	FastField,
	GridContainer,
	GridItem,
	Button,
	TextField,
	Checkbox,
	ProgressButton,
} from '@/components'

@withFormikExtend({
	mapPropsToValues: ({ settingMedicationFrequency }) => settingMedicationFrequency.filter || {},
	handleSubmit: () => {},
	displayName: 'MedicationFrequencyFilter'
})
class Filter extends PureComponent {
	render() {
		//console.log({ props: this.props.values })
		const { classes } = this.props
		return (
			<div className={classes.filterBar}>
				<GridContainer>
					<GridItem xs={6} md={3}>
						<FastField
							name='code'
							render={(args) => {
								return <TextField label='Code' {...args} />
							}}
						/>
					</GridItem>
					<GridItem xs={6} md={3}>
						<FastField
							name='displayValue'
							render={(args) => {
								return <TextField label='Display Value' {...args} />
							}}
						/>
					</GridItem>
					<GridItem xs={6} md={3}>
						<div className={classes.filterBtn}>
							<ProgressButton
								color='primary'
								icon={null}
								onClick={() => {
									this.props.dispatch({
										type: 'settingMedicationFrequency/query',
										payload: this.props.values
									})
								}}
							>
								<FormattedMessage id='form.search' />
							</ProgressButton>

							<Button
								color='primary'
								onClick={() => {
									this.props.dispatch({
										type: 'settingMedicationFrequency/updateState',
										payload: {
											entity: undefined
										}
									})
									this.props.toggleModal()
								}}
							>
								Add New
							</Button>
						</div>
					</GridItem>
				</GridContainer>
			</div>
		)
	}
}

export default Filter
